from fastapi import FastAPI, Depends, HTTPException, Query, Path, Body, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime, date, time, timedelta
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

from app.database import (
    get_db, create_tables, Especialidad, Usuario, Paciente, Medico, 
    DisponibilidadMedico, HorarioSlot, Cita, Pago, Ticket,
    SlotEstado, CitaEstado, PagoEstado, TicketEstado
)

# Cargar variables de entorno
load_dotenv()

# Crear instancia de FastAPI
app = FastAPI(title="HealPoint API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración para hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración para JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "clave_jwt_temporal")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

# OAuth2 para autenticación con contraseña
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Crear tablas al iniciar
create_tables()

# ----- ESQUEMAS PYDANTIC -----

# Esquemas para Especialidad
class EspecialidadBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class EspecialidadCreate(EspecialidadBase):
    pass

class EspecialidadResponse(EspecialidadBase):
    id_especialidad: int
    
    class Config:
        from_attributes = True

# Esquemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol: str

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioResponse(UsuarioBase):
    id_usuario: int
    estado: bool
    fecha_registro: datetime
    
    class Config:
        from_attributes = True

# Esquemas para Paciente
class PacienteBase(BaseModel):
    fecha_nacimiento: Optional[date] = None
    genero: Optional[str] = None
    telefono: Optional[str] = None

class PacienteCreate(PacienteBase):
    usuario: UsuarioCreate

class PacienteResponse(PacienteBase):
    id_paciente: int
    id_usuario: int
    usuario: Optional[UsuarioResponse] = None
    
    class Config:
        from_attributes = True

# Esquemas para Médico
class MedicoBase(BaseModel):
    id_especialidad: int
    numero_licencia: Optional[str] = None

class MedicoCreate(MedicoBase):
    usuario: UsuarioCreate

class MedicoResponse(MedicoBase):
    id_medico: int
    id_usuario: int
    usuario: Optional[UsuarioResponse] = None
    especialidad: Optional[EspecialidadResponse] = None
    
    class Config:
        from_attributes = True

# Esquemas para DisponibilidadMedico
class DisponibilidadMedicoBase(BaseModel):
    dia_semana: str
    hora_inicio: time
    hora_fin: time
    duracion_slot_min: int

class DisponibilidadMedicoCreate(DisponibilidadMedicoBase):
    pass

class DisponibilidadMedicoResponse(DisponibilidadMedicoBase):
    id_disponibilidad: int
    id_medico: int
    
    class Config:
        from_attributes = True

# Esquemas para HorarioSlot
class HorarioSlotBase(BaseModel):
    fecha: date
    hora_inicio: time
    hora_fin: time
    estado: Optional[SlotEstado] = SlotEstado.disponible

class HorarioSlotCreate(HorarioSlotBase):
    id_disponibilidad: int

class HorarioSlotResponse(HorarioSlotBase):
    id_slot: int
    id_disponibilidad: int
    
    class Config:
        from_attributes = True

# Esquemas para Cita
class CitaBase(BaseModel):
    motivo: Optional[str] = None
    nota_medica: Optional[str] = None
    estado: Optional[CitaEstado] = CitaEstado.pendiente

class CitaCreate(CitaBase):
    id_paciente: int
    id_medico: int
    id_slot: int

class CitaResponse(CitaBase):
    id_cita: int
    id_paciente: int
    id_medico: int
    id_slot: int
    
    class Config:
        from_attributes = True

class CitaDetalladaResponse(CitaResponse):
    paciente: Optional[PacienteResponse] = None
    medico: Optional[MedicoResponse] = None
    slot: Optional[HorarioSlotResponse] = None
    
    class Config:
        from_attributes = True

# Esquemas para autenticación
class Token(BaseModel):
    access_token: str
    token_type: str
    user_data: Dict[str, Any]

class TokenData(BaseModel):
    sub: Optional[str] = None

class LoginRequest(BaseModel):
    correo: EmailStr
    contraseña: str

# ----- FUNCIONES AUXILIARES -----

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = TokenData(sub=user_id)
        return token_data
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    user = db.query(Usuario).filter(Usuario.id_usuario == token_data.sub).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )
    return user

# ----- ENDPOINTS DE AUTENTICACIÓN -----

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.contraseña):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token JWT
    access_token = create_access_token(data={"sub": str(user.id_usuario)})
    
    # Obtener datos adicionales según el rol
    role_data = {}
    if user.rol == "paciente":
        paciente = db.query(Paciente).filter(Paciente.id_usuario == user.id_usuario).first()
        if paciente:
            role_data["id_paciente"] = paciente.id_paciente
    elif user.rol == "medico":
        medico = db.query(Medico).filter(Medico.id_usuario == user.id_usuario).first()
        if medico:
            role_data["id_medico"] = medico.id_medico
            role_data["id_especialidad"] = medico.id_especialidad
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_data": {
            "id_usuario": user.id_usuario,
            "nombre": user.nombre,
            "correo": user.correo,
            "rol": user.rol,
            **role_data
        }
    }

@app.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo == login_data.correo).first()
    
    if not user or not verify_password(login_data.contraseña, user.contraseña):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token JWT
    access_token = create_access_token(data={"sub": str(user.id_usuario)})
    
    # Obtener datos adicionales según el rol
    role_data = {}
    if user.rol == "paciente":
        paciente = db.query(Paciente).filter(Paciente.id_usuario == user.id_usuario).first()
        if paciente:
            role_data["id_paciente"] = paciente.id_paciente
    elif user.rol == "medico":
        medico = db.query(Medico).filter(Medico.id_usuario == user.id_usuario).first()
        if medico:
            role_data["id_medico"] = medico.id_medico
            role_data["id_especialidad"] = medico.id_especialidad
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_data": {
            "id_usuario": user.id_usuario,
            "nombre": user.nombre,
            "correo": user.correo,
            "rol": user.rol,
            **role_data
        }
    }

@app.get("/usuarios/me", response_model=UsuarioResponse)
async def read_users_me(current_user: Usuario = Depends(get_current_user)):
    """Obtiene la información del usuario autenticado"""
    return current_user

@app.post("/verify-token")
async def verify_token_endpoint(token: str = Body(..., embed=True), db: Session = Depends(get_db)):
    """Verifica un token JWT y retorna información del usuario"""
    try:
        token_data = verify_token(token)
        user_id = token_data.sub
        
        user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
        if not user:
            return {"valid": False, "error": "Usuario no encontrado"}
        
        # Datos específicos según el rol
        role_data = {}
        if user.rol == "paciente":
            paciente = db.query(Paciente).filter(Paciente.id_usuario == user.id_usuario).first()
            if paciente:
                role_data["id_paciente"] = paciente.id_paciente
        elif user.rol == "medico":
            medico = db.query(Medico).filter(Medico.id_usuario == user.id_usuario).first()
            if medico:
                role_data["id_medico"] = medico.id_medico
                role_data["id_especialidad"] = medico.id_especialidad
        
        return {
            "valid": True,
            "user_data": {
                "id_usuario": user.id_usuario,
                "nombre": user.nombre,
                "correo": user.correo,
                "rol": user.rol,
                **role_data
            }
        }
    except Exception as e:
        return {"valid": False, "error": str(e)}

# ----- ENDPOINTS BÁSICOS -----

@app.get("/")
def read_root():
    return {"message": "Bienvenido a HealPoint API"}

# Test de conexión a la base de datos
@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        result = db.execute("SELECT 1").first()
        if result[0] == 1:
            return {"status": "success", "message": "Database connection successful!"}
        return {"status": "error", "message": "Database query failed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# ----- ENDPOINTS ESPECIALIDADES -----

@app.post("/especialidades/", response_model=EspecialidadResponse, tags=["especialidades"])
def crear_especialidad(especialidad: EspecialidadCreate, db: Session = Depends(get_db)):
    db_especialidad = Especialidad(**especialidad.dict())
    db.add(db_especialidad)
    db.commit()
    db.refresh(db_especialidad)
    return db_especialidad

@app.get("/especialidades/", response_model=List[EspecialidadResponse], tags=["especialidades"])
def listar_especialidades(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    especialidades = db.query(Especialidad).offset(skip).limit(limit).all()
    return especialidades

@app.get("/especialidades/{id_especialidad}", response_model=EspecialidadResponse, tags=["especialidades"])
def obtener_especialidad(id_especialidad: int, db: Session = Depends(get_db)):
    especialidad = db.query(Especialidad).filter(Especialidad.id_especialidad == id_especialidad).first()
    if especialidad is None:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return especialidad

# ----- ENDPOINTS USUARIOS -----

@app.post("/usuarios/", response_model=UsuarioResponse, tags=["usuarios"])
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.correo == usuario.correo).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    hashed_password = get_password_hash(usuario.contraseña)
    
    # Crear usuario con contraseña hasheada
    db_usuario = Usuario(
        nombre=usuario.nombre,
        correo=usuario.correo,
        contraseña=hashed_password,
        rol=usuario.rol
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@app.get("/usuarios/", response_model=List[UsuarioResponse], tags=["usuarios"])
def listar_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).offset(skip).limit(limit).all()
    return usuarios

@app.get("/usuarios/{id_usuario}", response_model=UsuarioResponse, tags=["usuarios"])
def obtener_usuario(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

# ----- ENDPOINTS PACIENTES -----

@app.post("/pacientes/", response_model=PacienteResponse, tags=["pacientes"])
def crear_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    # Verificar si el correo ya existe
    db_usuario = db.query(Usuario).filter(Usuario.correo == paciente.usuario.correo).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    # Crear usuario para el paciente
    hashed_password = get_password_hash(paciente.usuario.contraseña)
    
    db_usuario = Usuario(
        nombre=paciente.usuario.nombre,
        correo=paciente.usuario.correo,
        contraseña=hashed_password,
        rol=paciente.usuario.rol
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    
    # Crear el paciente
    db_paciente = Paciente(
        id_usuario=db_usuario.id_usuario,
        fecha_nacimiento=paciente.fecha_nacimiento,
        genero=paciente.genero,
        telefono=paciente.telefono
    )
    
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

@app.get("/pacientes/", response_model=List[PacienteResponse], tags=["pacientes"])
def listar_pacientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    pacientes = db.query(Paciente).offset(skip).limit(limit).all()
    return pacientes

@app.get("/pacientes/{id_paciente}", response_model=PacienteResponse, tags=["pacientes"])
def obtener_paciente(id_paciente: int, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id_paciente == id_paciente).first()
    if paciente is None:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente

# ----- ENDPOINTS MÉDICOS -----

@app.post("/medicos/", response_model=MedicoResponse, tags=["medicos"])
def crear_medico(medico: MedicoCreate, db: Session = Depends(get_db)):
    # Verificar si el correo ya existe
    db_usuario = db.query(Usuario).filter(Usuario.correo == medico.usuario.correo).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    # Verificar si la especialidad existe
    db_especialidad = db.query(Especialidad).filter(Especialidad.id_especialidad == medico.id_especialidad).first()
    if not db_especialidad:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    
    # Crear usuario para el médico
    hashed_password = get_password_hash(medico.usuario.contraseña)
    
    db_usuario = Usuario(
        nombre=medico.usuario.nombre,
        correo=medico.usuario.correo,
        contraseña=hashed_password,
        rol=medico.usuario.rol
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    
    # Crear el médico
    db_medico = Medico(
        id_usuario=db_usuario.id_usuario,
        id_especialidad=medico.id_especialidad,
        numero_licencia=medico.numero_licencia
    )
    
    db.add(db_medico)
    db.commit()
    db.refresh(db_medico)
    return db_medico

@app.get("/medicos/", response_model=List[MedicoResponse], tags=["medicos"])
def listar_medicos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    medicos = db.query(Medico).offset(skip).limit(limit).all()
    return medicos

@app.get("/medicos/{id_medico}", response_model=MedicoResponse, tags=["medicos"])
def obtener_medico(id_medico: int, db: Session = Depends(get_db)):
    medico = db.query(Medico).filter(Medico.id_medico == id_medico).first()
    if medico is None:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico

@app.get("/especialidades/{id_especialidad}/medicos", response_model=List[MedicoResponse], tags=["medicos"])
def listar_medicos_por_especialidad(id_especialidad: int, db: Session = Depends(get_db)):
    especialidad = db.query(Especialidad).filter(Especialidad.id_especialidad == id_especialidad).first()
    if especialidad is None:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    
    medicos = db.query(Medico).filter(Medico.id_especialidad == id_especialidad).all()
    return medicos

# ----- ENDPOINTS DISPONIBILIDAD -----

@app.post("/medicos/{id_medico}/disponibilidad", response_model=DisponibilidadMedicoResponse, tags=["disponibilidad"])
def crear_disponibilidad(
    id_medico: int,
    disponibilidad: DisponibilidadMedicoCreate,
    db: Session = Depends(get_db)
):
    # Verificar si el médico existe
    medico = db.query(Medico).filter(Medico.id_medico == id_medico).first()
    if medico is None:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    
    db_disponibilidad = DisponibilidadMedico(
        id_medico=id_medico,
        dia_semana=disponibilidad.dia_semana,
        hora_inicio=disponibilidad.hora_inicio,
        hora_fin=disponibilidad.hora_fin,
        duracion_slot_min=disponibilidad.duracion_slot_min
    )
    
    db.add(db_disponibilidad)
    db.commit()
    db.refresh(db_disponibilidad)
    return db_disponibilidad

@app.get("/medicos/{id_medico}/disponibilidad", response_model=List[DisponibilidadMedicoResponse], tags=["disponibilidad"])
def listar_disponibilidad_medico(id_medico: int, db: Session = Depends(get_db)):
    medico = db.query(Medico).filter(Medico.id_medico == id_medico).first()
    if medico is None:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    
    disponibilidades = db.query(DisponibilidadMedico).filter(DisponibilidadMedico.id_medico == id_medico).all()
    return disponibilidades

# ----- ENDPOINTS HORARIO SLOTS -----

@app.post("/disponibilidad/{id_disponibilidad}/slots", response_model=List[HorarioSlotResponse], tags=["slots"])
def generar_slots(id_disponibilidad: int, fecha_inicio: date = Body(...), fecha_fin: date = Body(...), db: Session = Depends(get_db)):
    # Verificar si la disponibilidad existe
    disponibilidad = db.query(DisponibilidadMedico).filter(DisponibilidadMedico.id_disponibilidad == id_disponibilidad).first()
    if disponibilidad is None:
        raise HTTPException(status_code=404, detail="Disponibilidad no encontrada")
    
    slots_creados = []
    current_date = fecha_inicio
    
    # Para cada día entre fecha_inicio y fecha_fin
    while current_date <= fecha_fin:
        # Verificar si el dia de la semana coincide con la disponibilidad
        dia_semana_actual = current_date.strftime("%A").lower()
        if dia_semana_actual == disponibilidad.dia_semana.lower():
            # Calcular slots para este día
            hora_actual = disponibilidad.hora_inicio
            duracion = timedelta(minutes=disponibilidad.duracion_slot_min)
            
            while hora_actual < disponibilidad.hora_fin:
                hora_fin_slot = (datetime.combine(date.today(), hora_actual) + duracion).time()
                
                # Crear slot
                db_slot = HorarioSlot(
                    id_disponibilidad=id_disponibilidad,
                    fecha=current_date,
                    hora_inicio=hora_actual,
                    hora_fin=hora_fin_slot,
                    estado=SlotEstado.disponible
                )
                
                db.add(db_slot)
                slots_creados.append(db_slot)
                
                # Avanzar a la siguiente hora
                hora_actual = hora_fin_slot
        
        # Avanzar al siguiente día
        current_date += timedelta(days=1)
    
    db.commit()
    
    # Refrescar los objetos para obtener sus IDs
    for slot in slots_creados:
        db.refresh(slot)
    
    return slots_creados

@app.get("/medicos/{id_medico}/slots-disponibles", response_model=List[HorarioSlotResponse], tags=["slots"])
def listar_slots_disponibles_medico(
    id_medico: int,
    fecha_inicio: date = Query(None),
    fecha_fin: date = Query(None),
    db: Session = Depends(get_db)
):
    # Verificar si el médico existe
    medico = db.query(Medico).filter(Medico.id_medico == id_medico).first()
    if medico is None:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    
    # Construir la consulta base
    query = db.query(HorarioSlot).join(
        DisponibilidadMedico, HorarioSlot.id_disponibilidad == DisponibilidadMedico.id_disponibilidad
    ).filter(
        DisponibilidadMedico.id_medico == id_medico,
        HorarioSlot.estado == SlotEstado.disponible
    )
    
    # Aplicar filtros de fecha si se proporcionan
    if fecha_inicio:
        query = query.filter(HorarioSlot.fecha >= fecha_inicio)
    if fecha_fin:
        query = query.filter(HorarioSlot.fecha <= fecha_fin)
    
    slots = query.all()
    return slots

# ----- ENDPOINTS CITAS -----

@app.post("/citas/", response_model=CitaResponse, tags=["citas"])
def crear_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    # Verificar si el paciente existe
    paciente = db.query(Paciente).filter(Paciente.id_paciente == cita.id_paciente).first()
    if paciente is None:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Verificar si el médico existe
    medico = db.query(Medico).filter(Medico.id_medico == cita.id_medico).first()
    if medico is None:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    
    # Verificar si el slot existe y está disponible
    slot = db.query(HorarioSlot).filter(
        HorarioSlot.id_slot == cita.id_slot,
        HorarioSlot.estado == SlotEstado.disponible
    ).first()
    
    if slot is None:
        raise HTTPException(status_code=400, detail="Slot no disponible o no existe")
    
    # Crear la cita
    db_cita = Cita(
        id_paciente=cita.id_paciente,
        id_medico=cita.id_medico,
        id_slot=cita.id_slot,
        motivo=cita.motivo,
        estado=cita.estado
    )
    
    # Marcar el slot como reservado
    slot.estado = SlotEstado.reservado
    
    db.add(db_cita)
    db.commit()
    db.refresh(db_cita)
    return db_cita

@app.get("/citas/", response_model=List[CitaDetalladaResponse], tags=["citas"])
def listar_citas(
    estado: Optional[CitaEstado] = None,
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Cita)
    
    # Aplicar filtros
    if estado:
        query = query.filter(Cita.estado == estado)
    
    if fecha_inicio or fecha_fin:
        query = query.join(HorarioSlot, Cita.id_slot == HorarioSlot.id_slot)
        
        if fecha_inicio:
            query = query.filter(HorarioSlot.fecha >= fecha_inicio)
        
        if fecha_fin:
            query = query.filter(HorarioSlot.fecha <= fecha_fin)
    
    citas = query.offset(skip).limit(limit).all()
    return citas

@app.get("/citas/{id_cita}", response_model=CitaDetalladaResponse, tags=["citas"])
def obtener_cita(id_cita: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id_cita == id_cita).first()
    if cita is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita

@app.put("/citas/{id_cita}/estado", response_model=CitaResponse, tags=["citas"])
def actualizar_estado_cita(id_cita: int, estado: CitaEstado, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id_cita == id_cita).first()
    if cita is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    cita.estado = estado
    
    # Si la cita es cancelada, liberar el slot
    if estado == CitaEstado.cancelada:
        slot = db.query(HorarioSlot).filter(HorarioSlot.id_slot == cita.id_slot).first()
        if slot:
            slot.estado = SlotEstado.disponible
    
    db.commit()
    db.refresh(cita)
    return cita

@app.get("/pacientes/{id_paciente}/citas", response_model=List[CitaDetalladaResponse], tags=["citas"])
def listar_citas_paciente(id_paciente: int, estado: Optional[CitaEstado] = None, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id_paciente == id_paciente).first()
    if paciente is None:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    query = db.query(Cita).filter(Cita.id_paciente == id_paciente)
    
    if estado:
        query = query.filter(Cita.estado == estado)
    
    citas = query.all()
    return citas

@app.get("/medicos/{id_medico}/citas", response_model=List[CitaDetalladaResponse], tags=["citas"])
def listar_citas_medico(id_medico: int, fecha: Optional[date] = None, estado: Optional[CitaEstado] = None, db: Session = Depends(get_db)):
    medico = db.query(Medico).filter(Medico.id_medico == id_medico).first()
    if medico is None:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    
    query = db.query(Cita).filter(Cita.id_medico == id_medico)
    
    if fecha or estado:
        if fecha:
            query = query.join(HorarioSlot, Cita.id_slot == HorarioSlot.id_slot)
            query = query.filter(HorarioSlot.fecha == fecha)
        
        if estado:
            query = query.filter(Cita.estado == estado)
    
    citas = query.all()
    return citas