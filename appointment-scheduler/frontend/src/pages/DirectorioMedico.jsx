import React, { useState, useEffect } from "react";
import "./DirectorioMedico.css";
import Navbar from "./Navbar";

const DirectorioMedico = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);

  // Cargar médicos (simulación)
  useEffect(() => {
    // Datos de muestra - en un entorno real, esto vendría de una API
    const fetchDoctors = () => {
      setLoading(true);
      
      // Simulación de carga desde API
      setTimeout(() => {
        const mockDoctors = [
          {
            id: "1",
            name: "Dra. Ana Martínez",
            specialty: "Medicina General",
            rating: 4.8,
            experience: "12 años",
            education: "Universidad Nacional de Colombia",
            photo: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Especialista en medicina familiar con enfoque en prevención y cuidado integral. Experiencia en manejo de enfermedades crónicas y promoción de estilos de vida saludables.",
            workdays: "Lunes a Viernes",
            workhours: "8:00 AM - 6:00 PM",
            languages: ["Español", "Inglés"]
          },
          {
            id: "2",
            name: "Dr. Carlos Rodríguez",
            specialty: "Cardiología",
            rating: 4.9,
            experience: "15 años",
            education: "Universidad de Los Andes",
            photo: "https://randomuser.me/api/portraits/men/29.jpg",
            bio: "Cardiólogo intervencionista con amplia experiencia en procedimientos diagnósticos y tratamiento de enfermedades cardiovasculares complejas.",
            workdays: "Martes, Jueves y Viernes",
            workhours: "9:00 AM - 5:00 PM",
            languages: ["Español", "Inglés", "Francés"]
          },
          {
            id: "3",
            name: "Dr. Luis Vargas",
            specialty: "Pediatría",
            rating: 4.7,
            experience: "8 años",
            education: "Universidad del Rosario",
            photo: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Pediatra con enfoque en el desarrollo infantil y adolescente. Experiencia en manejo de enfermedades infecciosas y trastornos del crecimiento.",
            workdays: "Lunes, Miércoles y Viernes",
            workhours: "7:00 AM - 3:00 PM",
            languages: ["Español"]
          },
          {
            id: "4",
            name: "Dra. Patricia Gómez",
            specialty: "Dermatología",
            rating: 4.6,
            experience: "10 años",
            education: "Universidad Javeriana",
            photo: "https://randomuser.me/api/portraits/women/64.jpg",
            bio: "Dermatóloga con especialidad en tratamientos estéticos y manejo de enfermedades de la piel. Experiencia en procedimientos quirúrgicos dermatológicos.",
            workdays: "Lunes a Jueves",
            workhours: "10:00 AM - 7:00 PM",
            languages: ["Español", "Portugués"]
          },
          {
            id: "5",
            name: "Dr. Manuel Sánchez",
            specialty: "Neurología",
            rating: 4.9,
            experience: "20 años",
            education: "Universidad de Barcelona",
            photo: "https://randomuser.me/api/portraits/men/52.jpg",
            bio: "Neurólogo con amplia experiencia en trastornos neurológicos complejos. Especialista en epilepsia y enfermedad de Parkinson.",
            workdays: "Martes a Sábado",
            workhours: "8:00 AM - 4:00 PM",
            languages: ["Español", "Inglés", "Catalán"]
          },
          {
            id: "6",
            name: "Dra. Sofía López",
            specialty: "Ginecología",
            rating: 4.8,
            experience: "14 años",
            education: "Universidad Nacional Autónoma",
            photo: "https://randomuser.me/api/portraits/women/87.jpg",
            bio: "Ginecóloga especializada en salud reproductiva y atención prenatal. Experiencia en cirugías mínimamente invasivas.",
            workdays: "Lunes, Martes, Jueves y Viernes",
            workhours: "8:00 AM - 6:00 PM",
            languages: ["Español", "Inglés"]
          },
          {
            id: "7",
            name: "Dr. Alejandro Reyes",
            specialty: "Oftalmología",
            rating: 4.7,
            experience: "11 años",
            education: "Universidad de Harvard",
            photo: "https://randomuser.me/api/portraits/men/81.jpg",
            bio: "Oftalmólogo especializado en cirugía refractiva y tratamiento de enfermedades de la retina. Experiencia en nuevas tecnologías para corrección visual.",
            workdays: "Miércoles a Domingo",
            workhours: "9:00 AM - 5:00 PM",
            languages: ["Español", "Inglés"]
          },
          {
            id: "8",
            name: "Dra. Carmen Valencia",
            specialty: "Nutrición",
            rating: 4.5,
            experience: "9 años",
            education: "Universidad Complutense",
            photo: "https://randomuser.me/api/portraits/women/72.jpg",
            bio: "Nutricionista especializada en trastornos alimentarios y nutrición deportiva. Enfoque en planes alimenticios personalizados y educación nutricional.",
            workdays: "Lunes a Viernes",
            workhours: "7:00 AM - 3:00 PM",
            languages: ["Español", "Italiano"]
          }
        ];
        
        setDoctors(mockDoctors);
        
        // Extraer especialidades únicas
        const uniqueSpecialties = [...new Set(mockDoctors.map(doctor => doctor.specialty))];
        setSpecialties(uniqueSpecialties);
        
        setLoading(false);
      }, 1000);
    };
    
    fetchDoctors();
  }, []);

  // Filtrar doctores según búsqueda y especialidad
  const filteredDoctors = doctors.filter(doctor => {
    const nameMatch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const specialtyMatch = selectedSpecialty === "" || doctor.specialty === selectedSpecialty;
    return nameMatch && specialtyMatch;
  });

  // Ver detalles de un doctor
  const viewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    window.scrollTo(0, 0);
  };

  // Cerrar detalles del doctor
  const closeDoctorDetails = () => {
    setSelectedDoctor(null);
  };

  // Programar cita con doctor seleccionado
  const scheduleAppointment = (doctorId) => {
    // Aquí podrías guardar el ID del doctor en localStorage o estado global
    localStorage.setItem("selectedDoctorId", doctorId);
    navigate("cita-medica");
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        navigate={navigate}
      />
      
      <div className="directorioContainer">
        <div className="directorioHeader">
          <h1>Directorio Médico</h1>
          <p>Encuentre al especialista adecuado para su atención médica</p>
        </div>
        
        {/* Filtros y Búsqueda */}
        <div className="directorioFilters">
          <div className="searchBar">
            <input
              type="text"
              placeholder="Buscar médico por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <div className="specialtyFilter">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">Todas las especialidades</option>
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vista detallada de un doctor */}
        {selectedDoctor && (
          <div className="doctorDetailCard">
            <button className="closeDetailBtn" onClick={closeDoctorDetails}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="doctorDetailHeader">
              <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="doctorDetailPhoto" />
              <div className="doctorDetailInfo">
                <h2>{selectedDoctor.name}</h2>
                <p className="doctorSpecialty">{selectedDoctor.specialty}</p>
                <div className="doctorRating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(selectedDoctor.rating) ? "star filled" : "star"}>★</span>
                    ))}
                  </div>
                  <span className="ratingValue">{selectedDoctor.rating}/5</span>
                </div>
              </div>
            </div>
            
            <div className="doctorDetailBody">
              <div className="detailSection">
                <h3>Sobre el médico</h3>
                <p>{selectedDoctor.bio}</p>
              </div>
              
              <div className="detailGrid">
                <div className="detailItem">
                  <h4>Experiencia</h4>
                  <p>{selectedDoctor.experience}</p>
                </div>
                <div className="detailItem">
                  <h4>Educación</h4>
                  <p>{selectedDoctor.education}</p>
                </div>
                <div className="detailItem">
                  <h4>Días laborales</h4>
                  <p>{selectedDoctor.workdays}</p>
                </div>
                <div className="detailItem">
                  <h4>Horario</h4>
                  <p>{selectedDoctor.workhours}</p>
                </div>
                <div className="detailItem">
                  <h4>Idiomas</h4>
                  <p>{selectedDoctor.languages.join(", ")}</p>
                </div>
              </div>
              
              <button 
                className="scheduleWithDoctorBtn"
                onClick={() => scheduleAppointment(selectedDoctor.id)}
              >
                Agendar cita con {selectedDoctor.name.split(" ")[0]}
              </button>
            </div>
          </div>
        )}

        {/* Lista de doctores */}
        <div className="doctorsList">
          {loading ? (
            <div className="loadingContainer">
              <div className="loadingSpinner"></div>
              <p>Cargando directorio de médicos...</p>
            </div>
          ) : (
            <>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div className="doctorCard" key={doctor.id}>
                    <div className="doctorPhoto">
                      <img src={doctor.photo} alt={doctor.name} />
                    </div>
                    <div className="doctorInfo">
                      <h2>{doctor.name}</h2>
                      <p className="doctorSpecialty">{doctor.specialty}</p>
                      <div className="doctorMeta">
                        <span className="experience">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                          </svg>
                          {doctor.experience}
                        </span>
                        <span className="rating">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          {doctor.rating}
                        </span>
                      </div>
                    </div>
                    <div className="doctorActions">
                      <button className="viewDetailBtn" onClick={() => viewDoctorDetails(doctor)}>
                        Ver detalles
                      </button>
                      <button className="scheduleBtn" onClick={() => scheduleAppointment(doctor.id)}>
                        Agendar cita
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="noResultsContainer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <h3>No se encontraron médicos</h3>
                  <p>Intente con otros criterios de búsqueda</p>
                  <button onClick={() => {setSearchTerm(""); setSelectedSpecialty("");}}>
                    Borrar filtros
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DirectorioMedico;