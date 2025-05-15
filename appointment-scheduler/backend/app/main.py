from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List
import traceback
from datetime import datetime, date

from .database import get_db, check_database_connection
from .models import Usuario, Paciente, Medico, HorarioSlot, Cita
from .schemas import UsuarioResponse, CitaCreate, CitaResponse, HorarioSlotResponse

app = FastAPI(
    title="HealPoint API",
    description="API para sistema de gestión de citas médicas",
    version="1.0.0"
)

@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        error_detail = f"Error: {str(e)}\n{traceback.format_exc()}"
        print(error_detail)  # Para ver el error en los logs
        return JSONResponse(
            status_code=500,
            content={"message": "Internal Server Error", "detail": str(e)}
        )

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de HealPoint"}

@app.get("/check-db/")
def check_db():
    """
    Verifica la conexión a la base de datos
    """
    result = check_database_connection()
    if result:
        return {"status": "ok", "message": "Conexión a la base de datos exitosa"}
    else:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

@app.get("/usuarios/", response_model=List[UsuarioResponse])
def get_usuarios(db: Session = Depends(get_db)):
    """
    Obtiene todos los usuarios registrados en el sistema
    """
    usuarios = db.query(Usuario).all()
    return usuarios

# Endpoint para ver slots disponibles por médico y fecha
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