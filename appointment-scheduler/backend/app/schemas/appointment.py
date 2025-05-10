from pydantic import BaseModel
from datetime import datetime

class AppointmentSchema(BaseModel):
    id: int
    date: datetime
    time: str
    description: str

    class Config:
        orm_mode = True