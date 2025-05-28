import React, { useState, useEffect } from "react";
import "./MyCitations.css";
import Navbar from "./Navbar";

const MyCitations = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [timeLoading, setTimeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Verificar inicio de sesión y cargar citas del usuario
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("login");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("login");
      return;
    }

    // Simular carga desde API
    setTimeout(() => {
      const savedCitations = JSON.parse(localStorage.getItem(`citations_${userEmail}`) || "[]");
      setCitations(savedCitations);
      setLoading(false);
    }, 800);
  }, [isLoggedIn, navigate]);

  // Generar horarios disponibles al cambiar fecha
  useEffect(() => {
    if (selectedDate && showRescheduleModal) {
      setTimeLoading(true);
      
      // Simular llamada API para obtener horarios
      setTimeout(() => {
        const times = [];
        const startHour = 8;
        const endHour = 17;
        
        // Horarios disponibles según el día
        const dateObj = new Date(selectedDate);
        const dayOfWeek = dateObj.getDay();
        const totalSlots = dayOfWeek === 0 || dayOfWeek === 6 ? 5 : 12;
        
        for (let i = 0; i < totalSlots; i++) {
          const hour = startHour + Math.floor(Math.random() * (endHour - startHour));
          const minute = Math.random() > 0.5 ? "00" : "30";
          times.push(`${hour}:${minute}`);
        }
        
        // Ordenar horarios y eliminar duplicados
        times.sort();
        setAvailableTimes([...new Set(times)]);
        setTimeLoading(false);
      }, 600);
    }
  }, [selectedDate, showRescheduleModal]);

  // Formatear fecha para mostrar - Corregido para zona horaria
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // Aseguramos que la fecha se interprete correctamente independientemente de la zona horaria
    const parts = dateString.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Los meses en JavaScript son 0-indexados
    const day = parseInt(parts[2]);
    
    // Crear la fecha en la zona horaria local sin ajustes UTC
    const date = new Date(year, month, day);
    
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    
    return date.toLocaleDateString("es-ES", options);
  };

  // Comparar fechas sin considerar la hora - Solución para el filtrado
  const compareDatesOnly = (dateString) => {
    if (!dateString) return new Date(0); // Fecha mínima si no hay fecha
    
    // Crear una fecha local sin problemas de zona horaria
    const parts = dateString.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    
    return new Date(year, month, day);
  };

  // Obtener la fecha actual sin la hora
  const getCurrentDateWithoutTime = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  // Filtrar citas según la pestaña activa - Corregido para zona horaria
  const filteredCitations = citations.filter(citation => {
    // Usar nuestras funciones auxiliares para comparar fechas sin problemas de zona horaria
    const citationDate = compareDatesOnly(citation.date);
    const today = getCurrentDateWithoutTime();
    
    if (activeTab === "upcoming") {
      return citation.status !== "cancelada" && citationDate >= today;
    } else if (activeTab === "past") {
      return citation.status !== "cancelada" && citationDate < today;
    } else {
      return citation.status === "cancelada";
    }
  });

  // Obtener color según estado de la cita
  const getStatusColor = (status) => {
    switch(status) {
      case "confirmada":
        return "statusConfirmed";
      case "reprogramada":
        return "statusRescheduled";
      case "cancelada":
        return "statusCancelled";
      default:
        return "";
    }
  };

  // Manejar solicitud de reprogramación
  const handleReschedule = (citation) => {
    setSelectedCitation(citation);
    setSelectedDate("");
    setSelectedTime("");
    setShowRescheduleModal(true);
  };

  // Manejar solicitud de cancelación
  const handleCancelRequest = (citation) => {
    setSelectedCitation(citation);
    setShowCancelModal(true);
  };

  // Confirmar reprogramación de cita
  const confirmReschedule = () => {
    if (!selectedDate || !selectedTime || !selectedCitation) return;
    
    // Actualizar la cita en el array
    const updatedCitations = citations.map(cit => {
      if (cit.id === selectedCitation.id) {
        return {
          ...cit,
          date: selectedDate,
          time: selectedTime,
          status: "reprogramada"
        };
      }
      return cit;
    });
    
    // Guardar en localStorage
    const userEmail = localStorage.getItem("userEmail");
    localStorage.setItem(`citations_${userEmail}`, JSON.stringify(updatedCitations));
    
    // Actualizar estado
    setCitations(updatedCitations);
    setShowRescheduleModal(false);
    
    // Mostrar mensaje de éxito (puedes implementar un toast o alerta)
    alert("Cita reprogramada exitosamente para el " + formatDate(selectedDate) + " a las " + selectedTime);
  };

  // Confirmar cancelación de cita
  const confirmCancel = () => {
    if (!selectedCitation) return;
    
    // Actualizar la cita en el array
    const updatedCitations = citations.map(cit => {
      if (cit.id === selectedCitation.id) {
        return {
          ...cit,
          status: "cancelada"
        };
      }
      return cit;
    });
    
    // Guardar en localStorage
    const userEmail = localStorage.getItem("userEmail");
    localStorage.setItem(`citations_${userEmail}`, JSON.stringify(updatedCitations));
    
    // Actualizar estado
    setCitations(updatedCitations);
    setShowCancelModal(false);
    
    // Mostrar mensaje de éxito (puedes implementar un toast o alerta)
    alert("Cita cancelada exitosamente");
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} navigate={navigate} />
      
      <div className="myCitationsContainer">
        <div className="myCitationsCard">
          <div className="myCitationsHeader">
            <div className="logoContainer">
              <div className="logoBox">H</div>
              <span className="logoText">HealPoint</span>
            </div>
            <h1 className="pageTitle">Mis Citas Médicas</h1>
            <p className="pageSubtitle">
              Gestiona tus citas programadas, historial y solicitudes
            </p>
          </div>

          <div className="tabsContainer">
            <button 
              className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Próximas Citas
            </button>
            <button 
              className={`tab ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Historial
            </button>
            <button 
              className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Canceladas
            </button>
          </div>
          
          <div className="citationsListContainer">
            {loading ? (
              <div className="loadingContainer">
                <div className="loadingSpinner"></div>
                <p>Cargando sus citas...</p>
              </div>
            ) : filteredCitations.length === 0 ? (
              <div className="emptyCitations">
                <div className="emptyIcon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3>No hay citas {activeTab === 'upcoming' ? 'programadas' : activeTab === 'past' ? 'pasadas' : 'canceladas'}</h3>
                {activeTab === 'upcoming' && (
                  <button className="newCitationButton" onClick={() => navigate("cita-medica")}>
                    Agendar Nueva Cita
                  </button>
                )}
              </div>
            ) : (
              <div className="citationsList">
                {filteredCitations.map((citation) => (
                  <div key={citation.id} className="citationCard">
                    <div className="citationHeader">
                      <span className={`citationStatus ${getStatusColor(citation.status)}`}>
                        {citation.status === "confirmada" ? "Confirmada" : 
                         citation.status === "reprogramada" ? "Reprogramada" : "Cancelada"}
                      </span>
                      <span className="citationType">{citation.typeName}</span>
                    </div>
                    
                    <div className="citationDetails">
                      <div className="citationDetail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{formatDate(citation.date)}</span>
                      </div>
                      
                      <div className="citationDetail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{citation.time} hrs ({citation.duration} min)</span>
                      </div>
                    </div>
                    
                    <div className="citationSymptoms">
                      <strong>Motivo:</strong> {citation.symptoms}
                    </div>
                    
                    {activeTab === 'upcoming' && (
                      <div className="citationActions">
                        <button 
                          className="rescheduleButton"
                          onClick={() => handleReschedule(citation)}
                        >
                          Reprogramar
                        </button>
                        <button 
                          className="cancelButton"
                          onClick={() => handleCancelRequest(citation)}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'upcoming' && filteredCitations.length > 0 && (
              <div className="newCitationButtonContainer">
                <button className="newCitationButton" onClick={() => navigate("cita-medica")}>
                  Agendar Nueva Cita
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal para reprogramar cita */}
      {showRescheduleModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>Reprogramar Cita</h3>
              <button className="closeButton" onClick={() => setShowRescheduleModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modalBody">
              <p className="modalInfo">
                Está reprogramando su cita de {selectedCitation?.typeName} originalmente agendada para el {formatDate(selectedCitation?.date)} a las {selectedCitation?.time}
              </p>
              
              <div className="formGroup">
                <label htmlFor="rescheduleDate" className="formLabel">Nueva fecha</label>
                <input
                  type="date"
                  id="rescheduleDate"
                  className="formInput dateInput"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              
              {selectedDate && (
                <div className="formGroup">
                  <label className="formLabel">Nuevo horario</label>
                  {timeLoading ? (
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
                            className={`timeSlot ${selectedTime === time ? "selected" : ""}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))
                      ) : (
                        <p className="noTimesMessage">
                          No hay horarios disponibles para la fecha seleccionada.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="modalFooter">
              <button 
                className="secondaryButton"
                onClick={() => setShowRescheduleModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="primaryButton"
                disabled={!selectedDate || !selectedTime}
                onClick={confirmReschedule}
              >
                Confirmar Cambio
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para cancelar cita */}
      {showCancelModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>Cancelar Cita</h3>
              <button className="closeButton" onClick={() => setShowCancelModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modalBody">
              <div className="cancelWarning">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <p>¿Está seguro que desea cancelar su cita?</p>
              </div>
              <div className="cancelInfo">
                <p><strong>Tipo:</strong> {selectedCitation?.typeName}</p>
                <p><strong>Fecha:</strong> {formatDate(selectedCitation?.date)}</p>
                <p><strong>Hora:</strong> {selectedCitation?.time}</p>
              </div>
              <p className="cancelPolicy">
                Nota: Las cancelaciones con menos de 24 horas de anticipación pueden estar sujetas a cargos según nuestra política.
              </p>
            </div>
            
            <div className="modalFooter">
              <button 
                className="secondaryButton"
                onClick={() => setShowCancelModal(false)}
              >
                No, Mantener Cita
              </button>
              <button 
                className="dangerButton"
                onClick={confirmCancel}
              >
                Sí, Cancelar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyCitations;