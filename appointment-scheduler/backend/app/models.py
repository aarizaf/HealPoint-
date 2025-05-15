from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, Date, Time, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

# Definir todos los modelos según la estructura de la base de datos

class Usuario(Base):
    __tablename__ = "Usuario"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contraseña = Column(String(255), nullable=False)
    rol = Column(String(50), nullable=False)
    estado = Column(Boolean, default=True)
    fecha_registro = Column(DateTime, default=func.current_timestamp())


class Paciente(Base):
    __tablename__ = "Paciente"

    id_paciente = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("Usuario.id_usuario"), nullable=False)
    fecha_nacimiento = Column(Date)
    genero = Column(String(20))
    telefono = Column(String(20))
    
    usuario = relationship("Usuario")


class Especialidad(Base):
    __tablename__ = "Especialidad"

    id_especialidad = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)


class Medico(Base):
    __tablename__ = "Medico"

    id_medico = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("Usuario.id_usuario"), nullable=False)
    id_especialidad = Column(Integer, ForeignKey("Especialidad.id_especialidad"), nullable=False)
    numero_licencia = Column(String(50))
    
    usuario = relationship("Usuario")
    especialidad = relationship("Especialidad")


class DisponibilidadMedico(Base):
    __tablename__ = "DisponibilidadMedico"

    id_disponibilidad = Column(Integer, primary_key=True, index=True)
    id_medico = Column(Integer, ForeignKey("Medico.id_medico"), nullable=False)
    dia_semana = Column(String(20))
    hora_inicio = Column(Time)
    hora_fin = Column(Time)
    duracion_slot_min = Column(Integer)
    
    medico = relationship("Medico")


class HorarioSlot(Base):
    __tablename__ = "HorarioSlot"

    id_slot = Column(Integer, primary_key=True, index=True)
    id_disponibilidad = Column(Integer, ForeignKey("DisponibilidadMedico.id_disponibilidad"), nullable=False)
    fecha = Column(Date)
    hora_inicio = Column(Time)
    hora_fin = Column(Time)
    estado = Column(Enum('disponible', 'reservado', 'bloqueado'), default='disponible')
    
    disponibilidad = relationship("DisponibilidadMedico")


class Cita(Base):
    __tablename__ = "Cita"

    id_cita = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("Paciente.id_paciente"), nullable=False)
    id_medico = Column(Integer, ForeignKey("Medico.id_medico"), nullable=False)
    id_slot = Column(Integer, ForeignKey("HorarioSlot.id_slot"), nullable=False)
    motivo = Column(Text)
    nota_medica = Column(Text)
    estado = Column(Enum('pendiente', 'confirmada', 'cancelada', 'completada'), default='pendiente')
    id_pago = Column(Integer)
    
    paciente = relationship("Paciente")
    medico = relationship("Medico")
    slot = relationship("HorarioSlot")


class Pago(Base):
    __tablename__ = "Pago"

    id_pago = Column(Integer, primary_key=True, index=True)
    id_cita = Column(Integer, ForeignKey("Cita.id_cita"), nullable=False)
    monto = Column(String(10))  # DECIMAL(10,2) en MySQL
    metodo_pago = Column(String(50))
    estado = Column(Enum('pagado', 'pendiente', 'fallido'), default='pendiente')
    fecha_pago = Column(DateTime, default=func.current_timestamp())
    
    cita = relationship("Cita")


class Ticket(Base):
    __tablename__ = "Ticket"

    id_ticket = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("Usuario.id_usuario"), nullable=False)
    asunto = Column(String(100))
    mensaje = Column(Text)
    estado = Column(Enum('abierto', 'cerrado'), default='abierto')
    creado = Column(DateTime, default=func.current_timestamp())
    
    usuario = relationship("Usuario")