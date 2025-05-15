from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
from typing import Generator

# Credenciales de base de datos directamente en el código
DB_USER = "root"
DB_PASSWORD = "password"
DB_HOST = "localhost"
DB_PORT = "3307"
DB_NAME = "healpoint"

# Configuración de la conexión
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Crear instancia del motor de SQLAlchemy
engine = create_engine(DATABASE_URL)

# Crear una clase para las sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos declarativos
Base = declarative_base()

# Función para obtener una sesión de base de datos
def get_db() -> Generator:
    """
    Genera una sesión de base de datos y se asegura de cerrarla al finalizar
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Contexto para usar en funciones que no son endpoints de FastAPI
@contextmanager
def get_db_context():
    """
    Administrador de contexto para usar en funciones no-FastAPI
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

# Función para verificar la conexión a la base de datos
def check_database_connection():
    """
    Verifica que la conexión a la base de datos funciona correctamente
    """
    try:
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            return True
    except Exception as e:
        print(f"Error al conectar con la base de datos: {e}")
        return False