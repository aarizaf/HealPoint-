from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, text
from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator
import traceback
import time
import hashlib
from datetime import datetime, date, timedelta  # Añadir esta importación
from passlib.context import CryptContext
from .database import get_db, check_database_connection
from .models import Usuario, Paciente, Medico, HorarioSlot, Cita
from .schemas import UsuarioResponse, CitaCreate, CitaResponse, HorarioSlotResponse


app = FastAPI(
    title="HealPoint API",
    description="API para sistema de gestión de citas médicas",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Especifica el origen de tu frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Permite todos los métodos
    allow_headers=["*"],  # Permite todos los encabezados
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Modelo para solicitud de login
class LoginRequest(BaseModel):
    correo: EmailStr
    contraseña: str
    rememberMe: bool = False

# Modelo para respuesta de login
class LoginResponse(BaseModel):
    id: int
    nombre: str
    correo: str
    cedula: str
    token: str


# Actualiza el schema PacienteCreate para coincidir con el frontend
class PacienteCreate(BaseModel):
    nombre: str
    correo: EmailStr
    cedula: str
    contraseña: str
    telefono: Optional[str] = None
    genero: Optional[str] = "no especificado"
    fecha_nacimiento: Optional[date] = None
    
    @validator('cedula')
    def cedula_valida(cls, v):
        if not v or len(v) < 5:
            raise ValueError('La cédula debe tener al menos 5 caracteres')
        return v
    
    @validator('contraseña')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        return v

# Actualiza la respuesta para reflejar la estructura real de la tabla
class PacienteResponse(BaseModel):
    id: int
    nombre: str
    correo: str
    cedula: str
    telefono: Optional[str]
    genero: str
    fecha_nacimiento: Optional[date]
    fecha_registro: datetime
    
    class Config:
        from_attributes = True


@app.get("/usuarios/", response_model=List[UsuarioResponse])
def get_usuarios(db: Session = Depends(get_db)):
    """
    Obtiene todos los usuarios registrados en el sistema
    """
    usuarios = db.query(Usuario).all()
    return usuarios


@app.get("/slots-disponibles/{id_medico}", response_model=List[HorarioSlotResponse])
def get_slots_disponibles(
    id_medico: int, 
    fecha: date = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene los slots horarios disponibles para un médico en una fecha específica
    """
    try:
        # Verificar que el médico existe
        medico = db.query(Medico).filter(Medico.id_medico == id_medico).first()
        if not medico:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Médico con ID {id_medico} no encontrado"
            )

        # Consultar slots disponibles
        query = db.query(HorarioSlot).join(
            HorarioSlot.disponibilidad
        ).filter(
            HorarioSlot.disponibilidad.has(id_medico=id_medico),
            HorarioSlot.estado == "disponible"
        )
        
        # Si se proporcionó una fecha, filtrar por ella
        if fecha:
            query = query.filter(HorarioSlot.fecha == fecha)
        
        slots_disponibles = query.all()
        return slots_disponibles
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al buscar slots disponibles: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar slots disponibles: {str(e)}"
        )

# Endpoint para crear una nueva cita
@app.post("/citas/", response_model=CitaResponse, status_code=status.HTTP_201_CREATED)
def crear_cita(
    cita_data: CitaCreate, 
    db: Session = Depends(get_db)
):
    """
    Registra una nueva cita médica para un paciente
    """
    try:
        # 1. Verificar que el paciente existe
        paciente = db.query(Paciente).filter(Paciente.id_paciente == cita_data.id_paciente).first()
        if not paciente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Paciente con ID {cita_data.id_paciente} no encontrado"
            )
        
        # 2. Verificar que el médico existe
        medico = db.query(Medico).filter(Medico.id_medico == cita_data.id_medico).first()
        if not medico:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Médico con ID {cita_data.id_medico} no encontrado"
            )
        
        # 3. Verificar que el slot horario existe y está disponible
        slot = db.query(HorarioSlot).filter(
            HorarioSlot.id_slot == cita_data.id_slot,
            HorarioSlot.estado == "disponible"
        ).first()
        if not slot:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El slot horario seleccionado no existe o no está disponible"
            )
        
        # 4. Crear la cita en la base de datos
        nueva_cita = Cita(
            id_paciente=cita_data.id_paciente,
            id_medico=cita_data.id_medico,
            id_slot=cita_data.id_slot,
            motivo=cita_data.motivo,
            estado="pendiente"  # Estado inicial
        )
        
        db.add(nueva_cita)
        db.flush()  # Para obtener el ID de la cita sin hacer commit
        
        # 5. Actualizar el estado del slot horario a "reservado"
        slot.estado = "reservado"
        
        # 6. Confirmar transacción
        db.commit()
        db.refresh(nueva_cita)
        
        return nueva_cita
    
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print(f"Error al crear cita: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear cita: {str(e)}"
        )

# Endpoint para ver citas de un paciente
@app.get("/citas/paciente/{id_paciente}", response_model=List[CitaResponse])
def get_citas_paciente(
    id_paciente: int,
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las citas de un paciente específico
    """
    try:
        # Verificar que el paciente existe
        paciente = db.query(Paciente).filter(Paciente.id_paciente == id_paciente).first()
        if not paciente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Paciente con ID {id_paciente} no encontrado"
            )
        
        # Obtener las citas del paciente
        citas = db.query(Cita).filter(Cita.id_paciente == id_paciente).all()
        return citas
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al buscar citas del paciente: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar citas del paciente: {str(e)}"
        )
        
# Endpoint para iniciar sesión
@app.post("/login/", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Autentica a un usuario en el sistema
    """
    try:
        # 1. Buscar al paciente por correo
        paciente = db.execute(
            text("SELECT * FROM pacientes WHERE correo = :correo"),
            {"correo": login_data.correo}
        ).fetchone()
        
        # 2. Verificar si el paciente existe
        if not paciente:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Correo o contraseña incorrectos"
            )
        
        # 3. Verificar la contraseña
        if not verify_password(login_data.contraseña, paciente.contraseña):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Correo o contraseña incorrectos"
            )
        
        # 4. Generar un token simple (en una aplicación real, usarías JWT)
        timestamp = str(int(time.time()))
        token_data = f"{paciente.id}:{timestamp}:healpoint-secret-key"
        token = hashlib.sha256(token_data.encode()).hexdigest()
        
        # 5. Devolver información del paciente y token
        return {
            "id": paciente.id,
            "nombre": paciente.nombre,
            "correo": paciente.correo,
            "cedula": paciente.cedula,
            "token": token
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en el login: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en el proceso de login: {str(e)}"
        )

# Endpoint para registrar un nuevo paciente
@app.post("/pacientes/", response_model=PacienteResponse, status_code=status.HTTP_201_CREATED)
def registrar_paciente(
    paciente_data: PacienteCreate,
    db: Session = Depends(get_db)
):
    """
    Registra un nuevo paciente en el sistema según la estructura de la tabla pacientes
    """
    try:
        # 1. Verificar que el correo no esté ya registrado
        paciente_existente = db.execute(
            text("SELECT * FROM pacientes WHERE correo = :correo"),
            {"correo": paciente_data.correo}
        ).fetchone()
        
        if paciente_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este correo electrónico ya está registrado"
            )
        
        # 2. Verificar que la cédula no esté ya registrada
        paciente_existente = db.execute(
            text("SELECT * FROM pacientes WHERE cedula = :cedula"),
            {"cedula": paciente_data.cedula}
        ).fetchone()
        
        if paciente_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Esta cédula ya está registrada en el sistema"
            )
        
        # 3. Encriptar la contraseña
        hashed_password = get_password_hash(paciente_data.contraseña)
        
        # 4. Insertar nuevo paciente
        fecha_nacimiento_sql = paciente_data.fecha_nacimiento.isoformat() if paciente_data.fecha_nacimiento else None
        
        query = text("""
            INSERT INTO pacientes 
            (nombre, correo, cedula, contraseña, telefono, genero, fecha_nacimiento)
            VALUES 
            (:nombre, :correo, :cedula, :contrasena, :telefono, :genero, :fecha_nacimiento)
        """)
        
        result = db.execute(query, {
            "nombre": paciente_data.nombre,
            "correo": paciente_data.correo,
            "cedula": paciente_data.cedula,
            "contrasena": hashed_password,
            "telefono": paciente_data.telefono,
            "genero": paciente_data.genero,
            "fecha_nacimiento": fecha_nacimiento_sql
        })
        
        db.commit()
        
        # 5. Obtener el paciente recién creado
        nuevo_paciente = db.execute(
            text("SELECT * FROM pacientes WHERE cedula = :cedula"),
            {"cedula": paciente_data.cedula}
        ).fetchone()
        
        # Convertir el resultado a un diccionario para devolverlo
        paciente_dict = {
            "id": nuevo_paciente.id,
            "nombre": nuevo_paciente.nombre,
            "correo": nuevo_paciente.correo,
            "cedula": nuevo_paciente.cedula,
            "telefono": nuevo_paciente.telefono,
            "genero": nuevo_paciente.genero,
            "fecha_nacimiento": nuevo_paciente.fecha_nacimiento,
            "fecha_registro": nuevo_paciente.fecha_registro
        }
        
        return paciente_dict
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print(f"Error al registrar paciente: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar paciente: {str(e)}"
        )

# Endpoint para obtener todos los pacientes
@app.get("/pacientes/", response_model=List[PacienteResponse])
def get_pacientes(db: Session = Depends(get_db)):
    """
    Obtiene todos los pacientes registrados en el sistema
    """
    try:
        # Usar consulta SQL directa para obtener los pacientes
        pacientes_raw = db.execute(text("SELECT * FROM pacientes")).fetchall()
        
        # Convertir los resultados a la estructura esperada
        pacientes = []
        for p in pacientes_raw:
            pacientes.append({
                "id": p.id,
                "nombre": p.nombre,
                "correo": p.correo,
                "cedula": p.cedula,
                "telefono": p.telefono,
                "genero": p.genero,
                "fecha_nacimiento": p.fecha_nacimiento,
                "fecha_registro": p.fecha_registro
            })
            
        return pacientes
    
    except Exception as e:
        print(f"Error al obtener pacientes: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener pacientes: {str(e)}"
        )



# Modelo para la creación de citas desde el frontend
class CitaFrontendCreate(BaseModel):
    patientName: str
    patientID: str
    patientEmail: EmailStr
    patientPhone: str
    date: date
    time: str
    typeId: str
    typeName: str
    duration: int
    symptoms: str
    status: str = "confirmada"

@app.post("/agendar-cita/", status_code=status.HTTP_201_CREATED)
def agendar_cita(
    cita_data: CitaFrontendCreate,
    db: Session = Depends(get_db)
):
    """
    Registra una nueva cita médica desde el formulario del frontend
    Adaptado a la estructura real de la tabla Cita
    """
    try:
        print(f"Recibiendo datos de cita: {cita_data}")
        
        # 1. Verificar que el paciente existe por su cédula
        paciente = db.execute(
            text("SELECT * FROM pacientes WHERE cedula = :cedula"),
            {"cedula": cita_data.patientID}
        ).fetchone()
        
        if not paciente:
            # Intentar buscar por correo
            paciente = db.execute(
                text("SELECT * FROM pacientes WHERE correo = :correo"),
                {"correo": cita_data.patientEmail}
            ).fetchone()
            
            if not paciente:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Paciente con cédula {cita_data.patientID} no encontrado. Por favor regístrese primero."
                )
        
        print(f"Paciente encontrado: {paciente.id} - {paciente.nombre}")
        
        # 2. Generar un ID único para la cita
        # Puedes usar un enfoque simple o más sofisticado según tus necesidades
        import random
        import time
        cita_id = int(time.time() * 1000) + random.randint(1, 1000)  # Timestamp + número aleatorio
        
        # 3. Insertar la cita directamente usando SQL con los nombres de columna correctos
        query = text("""
            INSERT INTO Cita (
                id, 
                patient_name, 
                patient_id, 
                patient_email, 
                patient_phone, 
                appointment_date, 
                appointment_time, 
                type_id, 
                type_name, 
                duration, 
                symptoms, 
                status
            )
            VALUES (
                :id,
                :patient_name, 
                :patient_id, 
                :patient_email, 
                :patient_phone, 
                :appointment_date, 
                :appointment_time, 
                :type_id, 
                :type_name, 
                :duration, 
                :symptoms, 
                :status
            )
        """)
        
        # Formatear la hora correctamente (de string a TIME)
        time_parts = cita_data.time.split(":")
        formatted_time = f"{time_parts[0]}:{time_parts[1]}:00"
        
        # Ejecutar la consulta con los parámetros correctos
        result = db.execute(query, {
            "id": cita_id,
            "patient_name": cita_data.patientName,
            "patient_id": cita_data.patientID,
            "patient_email": cita_data.patientEmail,
            "patient_phone": cita_data.patientPhone,
            "appointment_date": cita_data.date.isoformat(),
            "appointment_time": formatted_time,
            "type_id": cita_data.typeId,
            "type_name": cita_data.typeName,
            "duration": cita_data.duration,
            "symptoms": cita_data.symptoms,
            "status": cita_data.status
        })
        
        db.commit()
        
        print(f"Cita creada exitosamente con ID: {cita_id}")
        
        # Devolver información sobre la cita
        return {
            "id": cita_id,
            "patient_name": cita_data.patientName,
            "patient_id": cita_data.patientID,
            "patient_email": cita_data.patientEmail,
            "appointment_date": cita_data.date,
            "appointment_time": cita_data.time,
            "type_name": cita_data.typeName,
            "duration": cita_data.duration,
            "symptoms": cita_data.symptoms,
            "status": cita_data.status,
            "mensaje": "Cita agendada exitosamente"
        }
    
    except HTTPException as e:
        db.rollback()
        print(f"Error HTTP: {e.detail}")
        raise
    except Exception as e:
        db.rollback()
        print(f"Error al agendar cita: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al agendar cita: {str(e)}"
        )