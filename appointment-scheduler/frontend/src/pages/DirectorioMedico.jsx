import React, { useState, useEffect } from "react";
import "./DirectorioMedico.css";
import Navbar from "./Navbar";
import doctora1 from  "../imgs/doctora1.jpg"
import doctor2 from  "../imgs/doctor2.jpg"
import doctor3 from  "../imgs/doctor3.jpg"
import doctora4 from  "../imgs/doctora4.jpg"
import doctor5 from  "../imgs/doctor5.jpg"
import doctora6 from  "../imgs/doctora6.jpeg"
import doctor7 from  "../imgs/doctor7.jpg"
import doctora8 from  "../imgs/doctora8.jpg"
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
            photo: doctora1,
            bio: "Especialista en medicina familiar con enfoque en prevención y cuidado integral. Experiencia en manejo de enfermedades crónicas y promoción de estilos de vida saludables.",
            languages: ["Español", "Inglés"],
            certifications: ["Medicina Familiar", "Atención Primaria"],
            areas: ["Prevención", "Enfermedades crónicas", "Medicina preventiva"]
          },
          {
            id: "2",
            name: "Dr. Carlos Rodríguez",
            specialty: "Cardiología",
            rating: 4.9,
            experience: "15 años",
            education: "Universidad de Los Andes",
            photo: doctor2,
            bio: "Cardiólogo intervencionista con amplia experiencia en procedimientos diagnósticos y tratamiento de enfermedades cardiovasculares complejas.",
            languages: ["Español", "Inglés", "Francés"],
            certifications: ["Cardiología Intervencionista", "Ecocardiografía"],
            areas: ["Enfermedades coronarias", "Hipertensión", "Arritmias"]
          },
          {
            id: "3",
            name: "Dr. Luis Vargas",
            specialty: "Pediatría",
            rating: 4.7,
            experience: "8 años",
            education: "Universidad del Rosario",
            photo: doctor3,
            bio: "Pediatra con enfoque en el desarrollo infantil y adolescente. Experiencia en manejo de enfermedades infecciosas y trastornos del crecimiento.",
            languages: ["Español"],
            certifications: ["Pediatría General", "Desarrollo Infantil"],
            areas: ["Crecimiento y desarrollo", "Vacunación", "Pediatría preventiva"]
          },
          {
            id: "4",
            name: "Dra. Patricia Gómez",
            specialty: "Dermatología",
            rating: 4.6,
            experience: "10 años",
            education: "Universidad Javeriana",
            photo: doctora4,
            bio: "Dermatóloga con especialidad en tratamientos estéticos y manejo de enfermedades de la piel. Experiencia en procedimientos quirúrgicos dermatológicos.",
            languages: ["Español", "Portugués"],
            certifications: ["Dermatología Clínica", "Dermatología Estética"],
            areas: ["Acné", "Dermatitis", "Procedimientos estéticos"]
          },
          {
            id: "5",
            name: "Dr. Manuel Sánchez",
            specialty: "Neurología",
            rating: 4.9,
            experience: "20 años",
            education: "Universidad de Barcelona",
            photo: doctor5,
            bio: "Neurólogo con amplia experiencia en trastornos neurológicos complejos. Especialista en epilepsia y enfermedad de Parkinson.",
            languages: ["Español", "Inglés", "Catalán"],
            certifications: ["Neurología Clínica", "Electroencefalografía"],
            areas: ["Epilepsia", "Parkinson", "Cefaleas", "Deterioro cognitivo"]
          },
          {
            id: "6",
            name: "Dra. Sofía López",
            specialty: "Ginecología",
            rating: 4.8,
            experience: "14 años",
            education: "Universidad Nacional Autónoma",
            photo: doctora6,
            bio: "Ginecóloga especializada en salud reproductiva y atención prenatal. Experiencia en cirugías mínimamente invasivas.",
            languages: ["Español", "Inglés"],
            certifications: ["Ginecología y Obstetricia", "Colposcopía"],
            areas: ["Salud reproductiva", "Control prenatal", "Menopausia"]
          },
          {
            id: "7",
            name: "Dr. Alejandro Reyes",
            specialty: "Oftalmología",
            rating: 4.7,
            experience: "11 años",
            education: "Universidad de Harvard",
            photo: doctor7,
            bio: "Oftalmólogo especializado en cirugía refractiva y tratamiento de enfermedades de la retina. Experiencia en nuevas tecnologías para corrección visual.",
            languages: ["Español", "Inglés"],
            certifications: ["Oftalmología Quirúrgica", "Retinología"],
            areas: ["Cirugía refractiva", "Cataratas", "Glaucoma", "Retina"]
          },
          {
            id: "8",
            name: "Dra. Carmen Valencia",
            specialty: "Nutrición",
            rating: 4.5,
            experience: "9 años",
            education: "Universidad Complutense",
            photo: doctora8,
            bio: "Nutricionista especializada en trastornos alimentarios y nutrición deportiva. Enfoque en planes alimenticios personalizados y educación nutricional.",
            languages: ["Español", "Italiano"],
            certifications: ["Nutrición Clínica", "Nutrición Deportiva"],
            areas: ["Trastornos alimenticios", "Dietas especializadas", "Nutrición deportiva"]
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
          <p>Conozca a nuestro equipo de profesionales de la salud</p>
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
              
              <div className="detailSection">
                <h3>Áreas de especialización</h3>
                <div className="areasTags">
                  {selectedDoctor.areas && selectedDoctor.areas.map((area, index) => (
                    <span key={index} className="areaTag">{area}</span>
                  ))}
                </div>
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
                  <h4>Idiomas</h4>
                  <p>{selectedDoctor.languages.join(", ")}</p>
                </div>
                <div className="detailItem">
                  <h4>Certificaciones</h4>
                  <p>{selectedDoctor.certifications ? selectedDoctor.certifications.join(", ") : "No especificado"}</p>
                </div>
              </div>
              
              <div className="infoNote">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p>Para conocer la disponibilidad, inicie sesión y use la opción "Agendar Cita Médica" en el menú principal.</p>
              </div>
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
                      <button className="viewDetailBtn fullWidth" onClick={() => viewDoctorDetails(doctor)}>
                        Ver perfil completo
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