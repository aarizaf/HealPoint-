from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, Date, Time, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

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
    __tablename__ = "pacientes"
    
    id_paciente = Column(Integer, primary_key=True, index=True)  # Asegúrate de que este sea el nombre correcto
    nombre = Column(String(100))
    correo = Column(String(100), unique=True)
    cedula = Column(String(20), unique=True)
    contraseña = Column(String(100))
    telefono = Column(String(20))
    genero = Column(String(20))
    fecha_nacimiento = Column(Date)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    
    # Definir la relación con Cita correctamente
    citas = relationship("Cita", back_populates="paciente")


class Especialidad(Base):
    __tablename__ = "Especialidad"

    id_especialidad = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)


class Medico(Base):
    __tablename__ = "medicos"
    
    id_medico = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    especialidad = Column(String(100))
    # Otros campos relevantes
    
    # Definir la relación con Cita correctamente
    citas = relationship("Cita", back_populates="medico")


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
    __tablename__ = "horario_slots"
    
    id_slot = Column(Integer, primary_key=True, index=True)
    id_disponibilidad = Column(Integer)
    fecha = Column(Date)
    hora_inicio = Column(Time)
    hora_fin = Column(Time)
    estado = Column(String(20), default="disponible")  # disponible, reservado, cancelado
    
    # Definir la relación con Cita correctamente
    cita = relationship("Cita", back_populates="slot", uselist=False)


# Agregar a models.py
class Cita(Base):
    __tablename__ = "cita"
    
    id_cita = Column(Integer, primary_key=True, index=True)
    # Asegúrate de que estos nombres coincidan con las columnas en tu base de datos
    id_paciente = Column(Integer, ForeignKey("pacientes.id_paciente"))
    id_medico = Column(Integer, ForeignKey("medicos.id_medico"))
    id_slot = Column(Integer, ForeignKey("horario_slots.id_slot"))
    motivo = Column(String(500))
    estado = Column(String(50), default="pendiente")
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    tipo_consulta = Column(String(100))
    duracion = Column(Integer)
    
    # Definir las relaciones correctamente
    paciente = relationship("Paciente", back_populates="citas")
    medico = relationship("Medico", back_populates="citas")
    slot = relationship("HorarioSlot", back_populates="cita")


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