import React, { useState, useEffect } from "react";
import "./Medicamentos.css";
import Navbar from "./Navbar";
import medicamento1 from  "../imgs/medicamento1.jpeg"
import medicamento2 from  "../imgs/medicamento2.png"
import medicamento3 from  "../imgs/medicamento3.jpg"
import medicamento4 from  "../imgs/medicamento4.jpg"
import medicamento5 from  "../imgs/medicamento5.jpg"
import medicamento6 from  "../imgs/medicamento6.jpg"
import medicamento7 from  "../imgs/medicamento7.jpg"
import medicamento8 from  "../imgs/medicamento8.jpg"
import medicamento9 from  "../imgs/medicamento9.jpeg"
import medicamento10 from  "../imgs/medicamento10.jpeg"
// Importaciones para los nuevos medicamentos - Asegúrate de tener estas imágenes
// Si no tienes las imágenes, puedes reutilizar las existentes
import medicamento11 from  "../imgs/medicamento11.jpg" // Reutiliza la imagen si no tienes una nueva
import medicamento12 from  "../imgs/medicamento12.jpg" 
import medicamento13 from  "../imgs/medicamento13.jpeg"
import medicamento14 from  "../imgs/medicamento14.jpg"
import medicamento15 from  "../imgs/medicamento15.jpeg"
import medicamento16 from  "../imgs/medicamento16.jpeg"
import medicamento17 from  "../imgs/medicamento17.jpg"
import medicamento18 from  "../imgs/medicamento18.jpeg"
import medicamento19 from  "../imgs/medicamento19.jpeg"
import medicamento20 from  "../imgs/medicamento20.jpeg"

const Medicamentos = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);

  // Simular carga de medicamentos
  useEffect(() => {
    const fetchMedications = () => {
      setLoading(true);
      
      // Simulación de carga desde API
      setTimeout(() => {
        const mockMedications = [
          {
            id: "1",
            name: "Paracetamol",
            brand: "Tylenol",
            category: "Analgésicos",
            description: "Analgésico y antipirético utilizado para aliviar el dolor leve a moderado y reducir la fiebre.",
            availability: "Disponibilidad alta",
            dosageForm: "Tabletas",
            strength: "500 mg",
            price: "15.900",
            prescription: false,
            image: medicamento1,
            stock: true,
            indications: "Alivio temporal de dolores leves a moderados tales como dolor de cabeza, dolor muscular, artritis, dolor de espalda, resfriados, y fiebre.",
            contraindications: "Hipersensibilidad al paracetamol, enfermedad hepática grave, alcoholismo.",
            location: "Sección A - Medicamentos generales"
          },
          {
            id: "2",
            name: "Ibuprofeno",
            brand: "Advil",
            category: "Antiinflamatorios",
            description: "Antiinflamatorio no esteroideo (AINE) utilizado para reducir el dolor, la inflamación y la fiebre.",
            availability: "Disponibilidad media",
            dosageForm: "Cápsulas",
            strength: "400 mg",
            price: "18.500",
            prescription: false,
            image: medicamento2,
            stock: true,
            indications: "Alivio de dolor e inflamación en condiciones como artritis, dolores menstruales, dolor de cabeza, dolor dental, y dolor muscular.",
            contraindications: "Hipersensibilidad al ibuprofeno, úlcera péptica activa, trastornos de la coagulación, insuficiencia cardíaca grave.",
            location: "Sección A - Medicamentos generales"
          },
          {
            id: "3",
            name: "Amoxicilina",
            brand: "Amoxil",
            category: "Antibióticos",
            description: "Antibiótico del grupo de las penicilinas utilizado para tratar infecciones bacterianas.",
            availability: "Disponibilidad limitada",
            dosageForm: "Cápsulas",
            strength: "500 mg",
            price: "23.700",
            prescription: true,
            image: medicamento3,
            stock: true,
            indications: "Tratamiento de infecciones bacterianas del tracto respiratorio, oído, nariz, garganta, vías urinarias, piel y tejidos blandos.",
            contraindications: "Hipersensibilidad a las penicilinas o cefalosporinas, mononucleosis infecciosa.",
            location: "Sección B - Antibióticos"
          },
          {
            id: "4",
            name: "Loratadina",
            brand: "Claritin",
            category: "Antialérgicos",
            description: "Antihistamínico que reduce los efectos de la histamina natural en el cuerpo, utilizado para tratar síntomas de alergia.",
            availability: "Disponibilidad alta",
            dosageForm: "Tabletas",
            strength: "10 mg",
            price: "17.200",
            prescription: false,
            image: medicamento4,
            stock: true,
            indications: "Alivio temporal de síntomas de alergia como estornudos, picazón y lagrimeo de ojos, y picazón de garganta y nariz.",
            contraindications: "Hipersensibilidad a la loratadina.",
            location: "Sección A - Medicamentos generales"
          },
          {
            id: "5",
            name: "Omeprazol",
            brand: "Prilosec",
            category: "Gastrointestinales",
            description: "Inhibidor de la bomba de protones que reduce la cantidad de ácido producido en el estómago.",
            availability: "Disponibilidad alta",
            dosageForm: "Cápsulas",
            strength: "20 mg",
            price: "21.300",
            prescription: false,
            image: medicamento5,
            stock: true,
            indications: "Tratamiento de úlcera gástrica o duodenal, esofagitis por reflujo, síndrome de Zollinger-Ellison, y prevención de úlceras en pacientes de riesgo.",
            contraindications: "Hipersensibilidad al omeprazol o a otros inhibidores de la bomba de protones.",
            location: "Sección C - Medicamentos digestivos"
          },
          {
            id: "6",
            name: "Atorvastatina",
            brand: "Lipitor",
            category: "Cardiovasculares",
            description: "Estatina que reduce los niveles de colesterol y triglicéridos en la sangre.",
            availability: "Disponibilidad media",
            dosageForm: "Tabletas",
            strength: "10 mg",
            price: "32.500",
            prescription: true,
            image: medicamento6,
            stock: true,
            indications: "Reducción de niveles elevados de colesterol y prevención de enfermedades cardiovasculares.",
            contraindications: "Enfermedad hepática activa, embarazo, lactancia.",
            location: "Sección D - Medicamentos cardiovasculares"
          },
          {
            id: "7",
            name: "Salbutamol",
            brand: "Ventolin",
            category: "Respiratorios",
            description: "Broncodilatador que relaja los músculos en las vías respiratorias y aumenta el flujo de aire a los pulmones.",
            availability: "Disponibilidad alta",
            dosageForm: "Inhalador",
            strength: "100 mcg/dosis",
            price: "25.800",
            prescription: false,
            image: medicamento7,
            stock: true,
            indications: "Alivio de broncoespasmo en pacientes con asma bronquial y EPOC.",
            contraindications: "Hipersensibilidad al salbutamol.",
            location: "Sección E - Medicamentos respiratorios"
          },
          {
            id: "8",
            name: "Metformina",
            brand: "Glucophage",
            category: "Antidiabéticos",
            description: "Medicamento antidiabético oral utilizado para controlar los niveles de azúcar en sangre en pacientes con diabetes tipo 2.",
            availability: "Disponibilidad media",
            dosageForm: "Tabletas",
            strength: "850 mg",
            price: "19.900",
            prescription: true,
            image: medicamento8,
            stock: true,
            indications: "Control de la glucemia en pacientes con diabetes mellitus tipo 2.",
            contraindications: "Insuficiencia renal o hepática, enfermedad cardíaca o pulmonar grave, alcoholismo.",
            location: "Sección F - Medicamentos endocrinológicos"
          },
          {
            id: "9",
            name: "Diazepam",
            brand: "Valium",
            category: "Ansiolíticos",
            description: "Benzodiazepina utilizada para tratar la ansiedad, espasmos musculares y convulsiones.",
            availability: "Disponibilidad limitada",
            dosageForm: "Tabletas",
            strength: "5 mg",
            price: "16.800",
            prescription: true,
            image: medicamento9,
            stock: false,
            indications: "Tratamiento de la ansiedad, espasmos musculares, convulsiones y síndrome de abstinencia alcohólica.",
            contraindications: "Insuficiencia respiratoria severa, apnea del sueño, insuficiencia hepática grave.",
            location: "Sección G - Medicamentos neurológicos"
          },
          {
            id: "10",
            name: "Levotiroxina",
            brand: "Synthroid",
            category: "Hormonales",
            description: "Hormona tiroidea sintética utilizada para tratar el hipotiroidismo y prevenir ciertos tipos de bocio.",
            availability: "Disponibilidad media",
            dosageForm: "Tabletas",
            strength: "50 mcg",
            price: "21.700",
            prescription: true,
            image: medicamento10,
            stock: true,
            indications: "Tratamiento del hipotiroidismo y prevención de bocio.",
            contraindications: "Tirotoxicosis no tratada, infarto agudo de miocardio.",
            location: "Sección F - Medicamentos endocrinológicos"
          },
          
          // Nuevos medicamentos
          {
            id: "11",
            name: "Ciprofloxacino",
            brand: "Cipro",
            category: "Antibióticos",
            description: "Antibiótico de amplio espectro del grupo de las fluoroquinolonas, utilizado para tratar diversas infecciones bacterianas.",
            availability: "Disponibilidad media",
            dosageForm: "Tabletas",
            strength: "500 mg",
            price: "26.500",
            prescription: true,
            image: medicamento11,
            stock: true,
            indications: "Tratamiento de infecciones del tracto urinario, respiratorio, piel, sistema gastrointestinal y articulaciones.",
            contraindications: "Hipersensibilidad a las quinolonas, miastenia gravis, embarazo y lactancia.",
            location: "Sección B - Antibióticos"
          },
          {
            id: "12",
            name: "Losartán",
            brand: "Cozaar",
            category: "Cardiovasculares",
            description: "Antagonista de los receptores de angiotensina II utilizado para tratar la hipertensión arterial y proteger los riñones en personas con diabetes tipo 2.",
            availability: "Disponibilidad alta",
            dosageForm: "Tabletas",
            strength: "50 mg",
            price: "28.700",
            prescription: true,
            image: medicamento12,
            stock: true,
            indications: "Tratamiento de la hipertensión arterial, insuficiencia cardíaca y protección renal en pacientes con diabetes tipo 2.",
            contraindications: "Hipersensibilidad al losartán, embarazo, lactancia.",
            location: "Sección D - Medicamentos cardiovasculares"
          },
          {
            id: "13",
            name: "Fluoxetina",
            brand: "Prozac",
            category: "Antidepresivos",
            description: "Inhibidor selectivo de la recaptación de serotonina (ISRS) utilizado para tratar la depresión, trastornos de pánico, TOC y bulimia nerviosa.",
            availability: "Disponibilidad media",
            dosageForm: "Cápsulas",
            strength: "20 mg",
            price: "24.100",
            prescription: true,
            image: medicamento13,
            stock: true,
            indications: "Tratamiento de la depresión, trastorno obsesivo-compulsivo, bulimia nerviosa y trastorno de pánico.",
            contraindications: "Uso concomitante con inhibidores de la MAO, hipersensibilidad a la fluoxetina.",
            location: "Sección G - Medicamentos neurológicos"
          },
          {
            id: "14",
            name: "Cetirizina",
            brand: "Zyrtec",
            category: "Antialérgicos",
            description: "Antihistamínico de segunda generación que alivia los síntomas de la rinitis alérgica estacional o perenne y la urticaria crónica idiopática.",
            availability: "Disponibilidad alta",
            dosageForm: "Tabletas",
            strength: "10 mg",
            price: "18.900",
            prescription: false,
            image: medicamento14,
            stock: true,
            indications: "Alivio de los síntomas de rinitis alérgica estacional y perenne, y urticaria crónica idiopática.",
            contraindications: "Hipersensibilidad a la cetirizina, enfermedad renal terminal.",
            location: "Sección A - Medicamentos generales"
          },
          {
            id: "15",
            name: "Esomeprazol",
            brand: "Nexium",
            category: "Gastrointestinales",
            description: "Inhibidor de la bomba de protones utilizado para tratar la enfermedad por reflujo gastroesofágico (ERGE) y la úlcera péptica.",
            availability: "Disponibilidad alta",
            dosageForm: "Cápsulas",
            strength: "40 mg",
            price: "31.200",
            prescription: true,
            image: medicamento15,
            stock: true,
            indications: "Tratamiento de la enfermedad por reflujo gastroesofágico, esofagitis erosiva, úlcera péptica y prevención de úlceras por AINE.",
            contraindications: "Hipersensibilidad al esomeprazol u otros inhibidores de la bomba de protones.",
            location: "Sección C - Medicamentos digestivos"
          },
          {
            id: "16",
            name: "Simvastatina",
            brand: "Zocor",
            category: "Cardiovasculares",
            description: "Estatina que reduce los niveles de colesterol LDL y triglicéridos en la sangre y aumenta el colesterol HDL.",
            availability: "Disponibilidad media",
            dosageForm: "Tabletas",
            strength: "20 mg",
            price: "26.800",
            prescription: true,
            image: medicamento16,
            stock: true,
            indications: "Reducción del colesterol LDL y prevención primaria y secundaria de eventos cardiovasculares.",
            contraindications: "Embarazo, lactancia, enfermedad hepática activa.",
            location: "Sección D - Medicamentos cardiovasculares"
          },
          {
            id: "17",
            name: "Montelukast",
            brand: "Singulair",
            category: "Respiratorios",
            description: "Antagonista del receptor de leucotrienos utilizado para el tratamiento del asma y alivio de síntomas de la rinitis alérgica.",
            availability: "Disponibilidad limitada",
            dosageForm: "Tabletas",
            strength: "10 mg",
            price: "36.900",
            prescription: true,
            image: medicamento17,
            stock: false,
            indications: "Tratamiento del asma y alivio de los síntomas de la rinitis alérgica.",
            contraindications: "Hipersensibilidad al montelukast.",
            location: "Sección E - Medicamentos respiratorios"
          },
          {
            id: "18",
            name: "Insulina Glargina",
            brand: "Lantus",
            category: "Antidiabéticos",
            description: "Análogo de la insulina humana de acción prolongada utilizado para el tratamiento de la diabetes mellitus.",
            availability: "Disponibilidad limitada",
            dosageForm: "Solución inyectable",
            strength: "100 UI/ml",
            price: "87.500",
            prescription: true,
            image: medicamento18,
            stock: true,
            indications: "Control de la glucemia en pacientes con diabetes mellitus que requieren tratamiento con insulina de acción prolongada.",
            contraindications: "Hipersensibilidad a la insulina glargina, hipoglucemia.",
            location: "Sección F - Medicamentos endocrinológicos"
          },
          {
            id: "19",
            name: "Alprazolam",
            brand: "Xanax",
            category: "Ansiolíticos",
            description: "Benzodiazepina utilizada para el tratamiento de los trastornos de ansiedad y ataques de pánico.",
            availability: "Disponibilidad limitada",
            dosageForm: "Tabletas",
            strength: "0.5 mg",
            price: "22.300",
            prescription: true,
            image: medicamento19,
            stock: true,
            indications: "Tratamiento de los trastornos de ansiedad y ataques de pánico con o sin agorafobia.",
            contraindications: "Miastenia gravis, insuficiencia respiratoria severa, síndrome de apnea del sueño, insuficiencia hepática grave.",
            location: "Sección G - Medicamentos neurológicos"
          },
          {
            id: "20",
            name: "Prednisona",
            brand: "Deltasone",
            category: "Antiinflamatorios",
            description: "Corticosteroide utilizado para reducir la inflamación y suprimir la respuesta del sistema inmunitario.",
            availability: "Disponibilidad media",
            dosageForm: "Tabletas",
            strength: "5 mg",
            price: "14.600",
            prescription: true,
            image: medicamento20,
            stock: true,
            indications: "Tratamiento de enfermedades inflamatorias, alérgicas, dermatológicas, reumáticas, pulmonares y hematológicas.",
            contraindications: "Infecciones sistémicas por hongos, hipersensibilidad a la prednisona.",
            location: "Sección A - Medicamentos generales"
          }
        ];
        
        setMedications(mockMedications);
        
        // Extraer categorías únicas
        const uniqueCategories = [...new Set(mockMedications.map(med => med.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      }, 1000);
    };
    
    fetchMedications();
  }, []);

  // Filtrar medicamentos según búsqueda y categoría
  const filteredMedications = medications.filter(med => {
    const nameMatch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === "" || med.category === selectedCategory;
    return nameMatch && categoryMatch;
  });

  // Ver detalles de un medicamento
  const viewMedicationDetails = (medication) => {
    setSelectedMedication(medication);
    window.scrollTo(0, 0);
  };

  // Cerrar detalles del medicamento
  const closeMedicationDetails = () => {
    setSelectedMedication(null);
  };

  // Obtener color según disponibilidad
  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Disponibilidad alta":
        return "#10B981"; // verde
      case "Disponibilidad media":
        return "#FBBF24"; // amarillo
      case "Disponibilidad limitada":
        return "#F87171"; // rojo
      default:
        return "#9CA3AF"; // gris
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        navigate={navigate}
      />
      
      <div className="medicamentosContainer">
        <div className="medicamentosHeader">
          <h1>Directorio de Medicamentos</h1>
          <p>Información sobre medicamentos disponibles en nuestro consultorio</p>
        </div>
        
        {/* Filtros y Búsqueda */}
        <div className="medicamentosFilters">
          <div className="searchBar">
            <input
              type="text"
              placeholder="Buscar medicamento por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <div className="categoryFilter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vista detallada de un medicamento */}
        {selectedMedication && (
          <div className="medicationDetailCard">
            <button className="closeDetailBtn" onClick={closeMedicationDetails}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="medicationDetailHeader">
              <div className="medicationImageContainer">
                <div className="medicationPlaceholder">
                  {selectedMedication.image ? (
                    <img src={selectedMedication.image} alt={selectedMedication.name} className="medicationDetailImage" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <path d="M8 12h8"></path>
                      <path d="M12 8v8"></path>
                    </svg>
                  )}
                </div>
              </div>
              <div className="medicationDetailInfo">
                <div className="medicationTitleRow">
                  <h2>{selectedMedication.name}</h2>
                  <span className="medicationCategory">{selectedMedication.category}</span>
                </div>
                <p className="medicationBrand">{selectedMedication.brand}</p>
                <div className="medicationProperties">
                  <span className="medicationProperty">
                    <strong>Forma:</strong> {selectedMedication.dosageForm}
                  </span>
                  <span className="medicationProperty">
                    <strong>Concentración:</strong> {selectedMedication.strength}
                  </span>
                  <span className="medicationProperty">
                    <strong>Precio:</strong> ${selectedMedication.price} COP
                  </span>
                </div>
                <div className="medicationAvailability">
                  <span className="availabilityLabel">Estado de existencias:</span>
                  <span 
                    className="availabilityStatus" 
                    style={{color: getAvailabilityColor(selectedMedication.availability)}}
                  >
                    {selectedMedication.availability}
                  </span>
                </div>
                <div className="medicationLocation">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{selectedMedication.location}</span>
                </div>
                <div className="medicationStatus">
                  {selectedMedication.prescription ? (
                    <span className="prescriptionRequired">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
                        <path d="M9 15V9h3l3 3-3 3H9z"></path>
                        <path d="M16 5h5v5"></path>
                        <path d="M21 5l-7 7"></path>
                      </svg>
                      Requiere receta médica
                    </span>
                  ) : (
                    <span className="noPreRequisites">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      Venta libre
                    </span>
                  )}
                  <span className={selectedMedication.stock ? "inStock" : "outOfStock"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      {selectedMedication.stock ? 
                        <path d="M8 12l2 2 6-6"></path> : 
                        <path d="M15 9l-6 6M9 9l6 6"></path>}
                    </svg>
                    {selectedMedication.stock ? "En existencia" : "Agotado"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="medicationDetailBody">
              <div className="detailSection">
                <h3>Descripción</h3>
                <p>{selectedMedication.description}</p>
              </div>
              
              <div className="detailSection">
                <h3>Indicaciones</h3>
                <p>{selectedMedication.indications}</p>
              </div>
              
              <div className="detailSection">
                <h3>Contraindicaciones</h3>
                <p>{selectedMedication.contraindications}</p>
              </div>
              
              <div className="infoNote">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p>Los medicamentos solo pueden ser adquiridos de manera presencial en nuestro consultorio médico. 
                   Recuerde que algunos medicamentos requieren prescripción médica actualizada.</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de medicamentos */}
        <div className="medicationsList">
          {loading ? (
            <div className="loadingContainer">
              <div className="loadingSpinner"></div>
              <p>Cargando directorio de medicamentos...</p>
            </div>
          ) : (
            <>
              {filteredMedications.length > 0 ? (
                filteredMedications.map(medication => (
                  <div className="medicationCard" key={medication.id}>
                    <div className="medicationCardHeader">
                      <div className="medicationCardImage">
                        <div className="medicationImagePlaceholder">
                          {medication.image ? (
                            <img src={medication.image} alt={medication.name} className="medicationImage" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <path d="M8 12h8"></path>
                              <path d="M12 8v8"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="medicationCardBadges">
                        {medication.prescription && (
                          <span className="prescriptionBadge" title="Requiere receta médica">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 15c0 3 2 3 8 3s8 0 8-3-2-3-8-3-8 0-8 3z"></path>
                              <path d="M3 9v6"></path>
                              <path d="M21 9v6"></path>
                              <path d="M8 12h8"></path>
                              <path d="M12 9v6"></path>
                            </svg>
                          </span>
                        )}
                        {!medication.stock && (
                          <span className="outOfStockBadge" title="Agotado">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x="8" y="12" x2="16" y2="12"></line>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="medicationCardBody">
                      <span className="medicationCardCategory">{medication.category}</span>
                      <h3 className="medicationCardName">{medication.name}</h3>
                      <p className="medicationCardBrand">{medication.brand}</p>
                      <div className="medicationCardInfo">
                        <span className="medicationDosage">{medication.dosageForm}, {medication.strength}</span>
                      </div>
                      <div className="medicationCardAvailability" 
                           style={{color: getAvailabilityColor(medication.availability)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                        <span>{medication.availability}</span>
                      </div>
                    </div>
                    
                    <div className="medicationCardFooter">
                      <button className="viewDetailBtn" onClick={() => viewMedicationDetails(medication)}>
                        Ver detalles
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
                  <h3>No se encontraron medicamentos</h3>
                  <p>Intente con otros criterios de búsqueda</p>
                  <button onClick={() => {setSearchTerm(""); setSelectedCategory("");}}>
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

export default Medicamentos;