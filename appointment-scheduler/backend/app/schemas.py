from pydantic import BaseModel, EmailStr
from datetime import datetime,date,time
from typing import Optional,List

class UsuarioBase(BaseModel):
    nombre: str
    correo: str  
    rol: str
    estado: bool
    fecha_registro: datetime

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioResponse(UsuarioBase):
    id_usuario: int
    fecha_registro: datetime

    class Config:
        from_attributes = True
        
        


# Esquemas existentes
class UsuarioBase(BaseModel):
    nombre: str
    correo: str
    rol: str
    estado: Optional[bool] = True

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioResponse(UsuarioBase):
    id_usuario: int
    fecha_registro: datetime

    class Config:
        from_attributes = True

# Nuevos esquemas para citas
class CitaBase(BaseModel):
    id_paciente: int
    id_medico: int
    id_slot: int
    motivo: Optional[str] = None
    
class CitaCreate(CitaBase):
    pass

class CitaResponse(CitaBase):
    id_cita: int
    estado: str
    nota_medica: Optional[str] = None
    id_pago: Optional[int] = None

    class Config:
        from_attributes = True

# Esquemas para consultar disponibilidad
class HorarioSlotResponse(BaseModel):
    id_slot: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    estado: str

    class Config:
        from_attributes = True