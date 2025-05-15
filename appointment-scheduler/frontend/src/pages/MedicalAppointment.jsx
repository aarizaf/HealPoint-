import React, { useState, useEffect } from 'react';
import './MedicalAppointment.css';

const MedicalAppointment = ({ navigate, isLoggedIn }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Tipos de citas disponibles
  const appointmentTypes = [
    { id: 'general', name: 'Consulta General', duration: 30 },
    { id: 'specialist', name: 'Especialista', duration: 45 },
    { id: 'followup', name: 'Seguimiento', duration: 20 },
    { id: 'emergency', name: 'Urgencia', duration: 60 },
  ];

  // Verificar inicio de sesión al cargar el componente
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('login');
    } else {
      // Si está logueado, obtener email del usuario
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        setPatientEmail(userEmail);
      }
    }
  }, [isLoggedIn, navigate]);

  // Generar horarios disponibles cuando la fecha cambia
  useEffect(() => {
    if (selectedDate) {
      // Aquí se conectaría con tu backend para obtener horarios disponibles
      // Por ahora, generamos datos de ejemplo
      generateAvailableTimes(selectedDate);
    }
  }, [selectedDate, selectedType]);

  // Generar horarios disponibles (simulación)
  const generateAvailableTimes = (date) => {
    setLoading(true);
    
    // Simulamos una llamada a la API con un timeout
    setTimeout(() => {
      const times = [];
      // Horario de 8:00 AM a 5:00 PM con intervalos de 30 minutos
      const startHour = 8;
      const endHour = 17;
      
      // La disponibilidad cambia según el día de la semana
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // 0 = domingo, 1 = lunes, etc.
      
      // Menos horarios disponibles en fin de semana
      const totalSlots = dayOfWeek === 0 || dayOfWeek === 6 ? 5 : 12;
      
      for (let i = 0; i < totalSlots; i++) {
        const hour = startHour + Math.floor(Math.random() * (endHour - startHour));
        const minute = Math.random() > 0.5 ? '00' : '30';
        times.push(`${hour}:${minute}`);
      }
      
      // Ordenar horarios
      times.sort();
      
      setAvailableTimes([...new Set(times)]); // Eliminar duplicados
      setLoading(false);
    }, 600);
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Datos de la cita
    const appointmentData = {
      patientName,
      patientEmail,
      patientPhone,
      date: selectedDate,
      time: selectedTime,
      type: appointmentTypes.find(type => type.id === selectedType),
      symptoms
    };

    console.log('Datos de la cita:', appointmentData);

    // Simulamos envío a un servidor
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        navigate('home');
      }, 3000);
    }, 1500);
  };

  // Formatear fecha para mostrar en formato amigable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (success) {
    return (
      <div className="appointmentContainer">
        <div className="appointmentSuccessCard">
          <div className="successIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 className="successTitle">¡Cita Agendada Exitosamente!</h2>
          <p className="successText">
            Su cita ha sido programada para el {formatDate(selectedDate)} a las {selectedTime}.
            Recibirá un correo de confirmación con los detalles en breve.
          </p>
          <button 
            className="returnButton"
            onClick={() => navigate('home')}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointmentContainer">
      <div className="appointmentCard">
        <div className="appointmentHeader">
          <div className="logoContainer">
            <div className="logoBox">H</div>
            <span className="logoText">HealPoint</span>
          </div>
          <h1 className="appointmentTitle">Agendar Cita Médica</h1>
          <p className="appointmentSubtitle">
            Complete el formulario para agendar su cita de atención médica
          </p>
        </div>

        <form onSubmit={handleSubmit} className="appointmentForm">
          <div className="appointmentSection">
            <h2 className="sectionTitle">1. Información Personal</h2>
            
            <div className="formGroup">
              <label htmlFor="patientName" className="formLabel">Nombre completo</label>
              <input 
                type="text"
                id="patientName"
                className="formInput"
                placeholder="Ingrese su nombre completo"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="patientEmail" className="formLabel">Correo electrónico</label>
                <input 
                  type="email"
                  id="patientEmail"
                  className="formInput"
                  placeholder="correo@ejemplo.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="patientPhone" className="formLabel">Teléfono</label>
                <input 
                  type="tel"
                  id="patientPhone"
                  className="formInput"
                  placeholder="(123) 456-7890"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="appointmentSection">
            <h2 className="sectionTitle">2. Tipo de Consulta</h2>
            
            <div className="appointmentTypeGrid">
              {appointmentTypes.map(type => (
                <div 
                  key={type.id}
                  className={`appointmentTypeCard ${selectedType === type.id ? 'selected' : ''}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="typeIcon">
                    {type.id === 'general' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    )}
                    {type.id === 'specialist' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    )}
                    {type.id === 'followup' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    )}
                    {type.id === 'emergency' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    )}
                  </div>
                  <h3 className="typeName">{type.name}</h3>
                  <p className="typeDuration">{type.duration} minutos</p>
                </div>
              ))}
            </div>
          </div>

          <div className="appointmentSection">
            <h2 className="sectionTitle">3. Fecha y Hora</h2>
            
            <div className="formGroup">
              <label htmlFor="appointmentDate" className="formLabel">Seleccione una fecha</label>
              <input 
                type="date"
                id="appointmentDate"
                className="formInput dateInput"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {selectedDate && (
              <div className="formGroup">
                <label className="formLabel">Horarios disponibles</label>
                {loading ? (
                  <div className="loadingTimeslots">
                    <div className="loadingSpinner"></div>
                    <span>Cargando horarios disponibles...</span>
                  </div>
                ) : (
                  <div className="timeSlotGrid">
                    {availableTimes.length > 0 ? (
                      availableTimes.map((time, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`timeSlot ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <p className="noTimesMessage">No hay horarios disponibles para la fecha seleccionada.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="appointmentSection">
            <h2 className="sectionTitle">4. Motivo de la Consulta</h2>
            <div className="formGroup">
              <label htmlFor="symptoms" className="formLabel">Describa sus síntomas o razón de la consulta</label>
              <textarea
                id="symptoms"
                className="formInput textArea"
                placeholder="Por favor, describa brevemente sus síntomas o el motivo de su consulta..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <div className="appointmentActions">
            <button 
              type="button" 
              className="cancelButton"
              onClick={() => navigate('home')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submitButton"
              disabled={!selectedDate || !selectedTime || !selectedType || loading}
            >
              {loading ? (
                <div className="buttonLoading">
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle className="spinnerPath" cx="12" cy="12" r="10" fill="none" strokeWidth="3"></circle>
                  </svg>
                  <span>Procesando...</span>
                </div>
              ) : (
                <span>Agendar Cita</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalAppointment;