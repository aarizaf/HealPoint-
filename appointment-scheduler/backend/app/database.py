from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, Date, Time, Enum, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, date, time
import os
from dotenv import load_dotenv
import enum

# Cargar variables de entorno
load_dotenv()

# Configuración de la base de datos
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "healpoint")

# URL de conexión a MySQL
DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

# Crear motor SQLAlchemy
engine = create_engine(DATABASE_URL)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

# Clases Enum para estados
class SlotEstado(str, enum.Enum):
    disponible = "disponible"
    reservado = "reservado"
    bloqueado = "bloqueado"

class CitaEstado(str, enum.Enum):
    pendiente = "pendiente"
    confirmada = "confirmada"
    cancelada = "cancelada"
    completada = "completada"

class PagoEstado(str, enum.Enum):
    pagado = "pagado"
    pendiente = "pendiente"
    fallido = "fallido"

class TicketEstado(str, enum.Enum):
    abierto = "abierto"
    cerrado = "cerrado"

# Definición de modelos
class Especialidad(Base):
    __tablename__ = "Especialidad"
    
    id_especialidad = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    
    # Relaciones
    medicos = relationship("Medico", back_populates="especialidad")
    
class Usuario(Base):
    __tablename__ = "Usuario"
    
    id_usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contraseña = Column(String(255), nullable=False)
    rol = Column(String(50), nullable=False)
    estado = Column(Boolean, default=True)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    paciente = relationship("Paciente", uselist=False, back_populates="usuario")
    medico = relationship("Medico", uselist=False, back_populates="usuario")
    tickets = relationship("Ticket", back_populates="usuario")

class Paciente(Base):
    __tablename__ = "Paciente"
    
    id_paciente = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("Usuario.id_usuario"), nullable=False)
    fecha_nacimiento = Column(Date)
    genero = Column(String(20))
    telefono = Column(String(20))
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="paciente")
    citas = relationship("Cita", back_populates="paciente")

class Medico(Base):
    __tablename__ = "Medico"
    
    id_medico = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("Usuario.id_usuario"), nullable=False)
    id_especialidad = Column(Integer, ForeignKey("Especialidad.id_especialidad"), nullable=False)
    numero_licencia = Column(String(50))
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="medico")
    especialidad = relationship("Especialidad", back_populates="medicos")
    disponibilidades = relationship("DisponibilidadMedico", back_populates="medico")
    citas = relationship("Cita", back_populates="medico")

class DisponibilidadMedico(Base):
    __tablename__ = "DisponibilidadMedico"
    
    id_disponibilidad = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_medico = Column(Integer, ForeignKey("Medico.id_medico"), nullable=False)
    dia_semana = Column(String(20))
    hora_inicio = Column(Time)
    hora_fin = Column(Time)
    duracion_slot_min = Column(Integer)
    
    # Relaciones
    medico = relationship("Medico", back_populates="disponibilidades")
    slots = relationship("HorarioSlot", back_populates="disponibilidad")

class HorarioSlot(Base):
    __tablename__ = "HorarioSlot"
    
    id_slot = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_disponibilidad = Column(Integer, ForeignKey("DisponibilidadMedico.id_disponibilidad"), nullable=False)
    fecha = Column(Date)
    hora_inicio = Column(Time)
    hora_fin = Column(Time)
    estado = Column(Enum(SlotEstado), default=SlotEstado.disponible)
    
    # Relaciones
    disponibilidad = relationship("DisponibilidadMedico", back_populates="slots")
    cita = relationship("Cita", uselist=False, back_populates="slot")

class Cita(Base):
    __tablename__ = "Cita"
    
    id_cita = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_paciente = Column(Integer, ForeignKey("Paciente.id_paciente"), nullable=False)
    id_medico = Column(Integer, ForeignKey("Medico.id_medico"), nullable=False)
    id_slot = Column(Integer, ForeignKey("HorarioSlot.id_slot"), nullable=False)
    motivo = Column(Text)
    nota_medica = Column(Text)
    estado = Column(Enum(CitaEstado), default=CitaEstado.pendiente)
    
    # Relaciones
    paciente = relationship("Paciente", back_populates="citas")
    medico = relationship("Medico", back_populates="citas")
    slot = relationship("HorarioSlot", back_populates="cita")
    pago = relationship("Pago", back_populates="cita", uselist=False)

class Pago(Base):
    __tablename__ = "Pago"
    
    id_pago = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_cita = Column(Integer, ForeignKey("Cita.id_cita"), nullable=False)
    monto = Column(Float)
    metodo_pago = Column(String(50))
    estado = Column(Enum(PagoEstado), default=PagoEstado.pendiente)
    fecha_pago = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    cita = relationship("Cita", back_populates="pago")

class Ticket(Base):
    __tablename__ = "Ticket"
    
    id_ticket = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("Usuario.id_usuario"), nullable=False)
    asunto = Column(String(100))
    mensaje = Column(Text)
    estado = Column(Enum(TicketEstado), default=TicketEstado.abierto)
    creado = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="tickets")

# Función para obtener la conexión a la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear tablas
def create_tables():
    Base.metadata.create_all(bind=engine)