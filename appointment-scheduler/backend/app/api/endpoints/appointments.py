from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.appointment import AppointmentSchema
from ..services.appointment_service import (
    create_appointment,
    get_appointment,
    get_appointments,
    update_appointment,
    delete_appointment
)

router = APIRouter()

@router.post("/appointments/", response_model=AppointmentSchema)
async def create_appointment_endpoint(appointment: AppointmentSchema):
    return await create_appointment(appointment)

@router.get("/appointments/", response_model=List[AppointmentSchema])
async def get_appointments_endpoint():
    return await get_appointments()

@router.get("/appointments/{appointment_id}", response_model=AppointmentSchema)
async def get_appointment_endpoint(appointment_id: int):
    appointment = await get_appointment(appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.put("/appointments/{appointment_id}", response_model=AppointmentSchema)
async def update_appointment_endpoint(appointment_id: int, appointment: AppointmentSchema):
    updated_appointment = await update_appointment(appointment_id, appointment)
    if updated_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated_appointment

@router.delete("/appointments/{appointment_id}", response_model=dict)
async def delete_appointment_endpoint(appointment_id: int):
    success = await delete_appointment(appointment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted successfully"}