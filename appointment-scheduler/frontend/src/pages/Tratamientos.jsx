import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Tratamientos.css";

// Importar imágenes para tratamientos (reemplazar con tus propias imágenes)
import tratamiento1 from "../imgs/tratamiento1.jpg";
import tratamiento2 from "../imgs/tratamiento2.jpeg";
import tratamiento3 from "../imgs/tratamiento3.jpeg";
import tratamiento4 from "../imgs/tratamiento4.jpeg";
import tratamiento5 from "../imgs/tratamiento5.jpeg";
import tratamiento6 from "../imgs/tratamiento6.jpeg";
import tratamiento7 from "../imgs/tratamiento7.png";
import tratamiento8 from "../imgs/tratamiento8.jpeg";
import tratamiento9 from "../imgs/tratamiento9.jpeg";
import tratamiento10 from "../imgs/tratamiento10.jpeg";
import tratamiento11 from "../imgs/tratamiento11.jpeg";
import tratamiento12 from "../imgs/tratamiento12.jpeg";
import tratamiento13 from "../imgs/tratamiento13.jpeg";
import tratamiento14 from "../imgs/tratamiento14.jpeg";




const Tratamientos = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("todos");
  const [treatments, setTreatments] = useState([]);
  const [showTreatmentDetails, setShowTreatmentDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de tratamientos
  useEffect(() => {
    // Simulación de carga de datos
    setLoading(true);
    setTimeout(() => {
      const mockTreatments = [
        // CARDIOLOGÍA
        {
          id: 1,
          nombre: "Monitorización Holter 24h",
          categoria: "cardiologia",
          descripcion: "Registro continuo del ritmo cardíaco durante 24-48 horas para detectar arritmias y evaluar la función cardíaca durante las actividades diarias.",
          duracion: "24-48 horas de monitorización",
          imagen: tratamiento1,
          especialista: "Cardiólogo",
          beneficios: [
            "Detección de arritmias cardíacas intermitentes",
            "Evaluación de síntomas como palpitaciones, mareos o síncopes",
            "Monitorización de la eficacia de medicamentos antiarrítmicos",
            "Análisis de la variabilidad de la frecuencia cardíaca",
            "Evaluación post-infarto o post-cirugía cardíaca"
          ],
          paraQuien: "Pacientes con síntomas como palpitaciones, mareos, fatiga inexplicada, dolor torácico o síncope. También para seguimiento de pacientes con arritmias conocidas o con factores de riesgo cardiovascular.",
          preparacion: "No requiere preparación especial, aunque se debe mantener un registro detallado de actividades y síntomas durante el periodo de monitorización. Evitar duchas durante el uso del dispositivo.",
          contraindicaciones: "No presenta contraindicaciones significativas al tratarse de un método diagnóstico no invasivo."
        },
        {
          id: 2,
          nombre: "Rehabilitación Cardíaca",
          categoria: "cardiologia",
          descripcion: "Programa estructurado de ejercicio físico, educación y apoyo psicológico para mejorar la salud cardiovascular tras eventos cardíacos o en pacientes con enfermedades cardíacas crónicas.",
          duracion: "8-12 semanas (2-3 sesiones semanales)",
          imagen: tratamiento2,
          especialista: "Cardiólogo y Fisioterapeuta especializado",
          beneficios: [
            "Mejora de la capacidad funcional y resistencia física",
            "Reducción de la mortalidad cardiovascular",
            "Control de factores de riesgo cardiovascular",
            "Mejora de la calidad de vida",
            "Apoyo en el manejo del estrés y la ansiedad"
          ],
          paraQuien: "Pacientes recuperándose de un infarto, cirugía cardíaca, angioplastia, o con insuficiencia cardíaca estable, cardiopatía isquémica crónica y otras enfermedades cardiovasculares.",
          preparacion: "Evaluación médica previa completa que incluye prueba de esfuerzo. Uso de ropa cómoda y calzado adecuado para ejercicio.",
          contraindicaciones: "Arritmias graves no controladas, estenosis aórtica severa, insuficiencia cardíaca descompensada, angina inestable o hipertensión severa no controlada."
        },

        // DERMATOLOGÍA
        {
          id: 3,
          nombre: "Crioterapia para Lesiones Cutáneas",
          categoria: "dermatologia",
          descripcion: "Tratamiento médico que utiliza temperaturas extremadamente frías (generalmente nitrógeno líquido) para destruir tejido anormal como verrugas, queratosis o pequeños tumores cutáneos benignos.",
          duracion: "5-10 minutos por sesión",
          imagen: tratamiento3,
          especialista: "Dermatólogo",
          beneficios: [
            "Eliminación eficaz de lesiones cutáneas benignas",
            "Procedimiento ambulatorio rápido y sin anestesia",
            "Mínimo riesgo de infección",
            "Recuperación rápida",
            "No requiere incisiones ni suturas"
          ],
          paraQuien: "Pacientes con verrugas vulgares, verrugas plantares, queratosis actínica, queratosis seborreica, molusco contagioso o pequeñas lesiones cutáneas benignas.",
          preparacion: "No requiere preparación especial. Se recomienda informar al médico sobre medicamentos para el adelgazamiento de la sangre.",
          contraindicaciones: "Pacientes con crioglobulinemia, urticaria al frío, enfermedad de Raynaud severa o intolerancia al frío. Precaución en zonas con mala circulación."
        },
        {
          id: 4,
          nombre: "Terapia Fotodinámica (TFD)",
          categoria: "dermatologia",
          descripcion: "Tratamiento que combina el uso de medicamentos fotosensibilizantes y luz específica para tratar lesiones premalignas, cáncer de piel superficial y acné inflamatorio.",
          duracion: "1-2 horas (incluyendo tiempo de preparación)",
          imagen: tratamiento4,
          especialista: "Dermatólogo",
          beneficios: [
            "Tratamiento selectivo que respeta el tejido sano circundante",
            "Excelentes resultados estéticos sin cicatrices",
            "Posibilidad de tratar áreas extensas en una sola sesión",
            "Menor dolor y tiempo de recuperación que otros tratamientos",
            "Eficaz para lesiones premalignas múltiples"
          ],
          paraQuien: "Pacientes con queratosis actínica, enfermedad de Bowen, carcinoma basocelular superficial, acné inflamatorio moderado-severo o fotoenvejecimiento cutáneo.",
          preparacion: "Limpieza de la piel y exfoliación previa de la zona a tratar. Evitar el uso de retinoides tópicos una semana antes.",
          contraindicaciones: "Porfiria, fotosensibilidad, alergia a los fotosensibilizantes, embarazo. Los pacientes deben evitar la exposición solar durante 48h después del tratamiento."
        },

        // GINECOLOGÍA
        {
          id: 5,
          nombre: "Colposcopia Diagnóstica",
          categoria: "ginecologia",
          descripcion: "Procedimiento diagnóstico que permite visualizar detalladamente el cuello uterino, la vagina y la vulva mediante un colposcopio (microscopio binocular con fuente de luz) para identificar lesiones anormales.",
          duracion: "15-20 minutos",
          imagen: tratamiento5,
          especialista: "Ginecólogo",
          beneficios: [
            "Detección temprana de lesiones precancerosas",
            "Visualización amplificada del cuello uterino",
            "Guía precisa para biopsias dirigidas",
            "Evaluación de resultados anormales en citologías",
            "Seguimiento de tratamientos previos"
          ],
          paraQuien: "Mujeres con citología cervical anormal, VPH positivo de alto riesgo, lesiones sospechosas visibles en el cuello uterino, o seguimiento tras tratamiento de lesiones precancerosas.",
          preparacion: "Programar la cita fuera del periodo menstrual. Evitar relaciones sexuales, duchas vaginales o uso de tampones durante 48h antes.",
          contraindicaciones: "No existen contraindicaciones absolutas. Se puede realizar en embarazadas si es necesario. Puede resultar incómodo durante la menstruación."
        },
        {
          id: 6,
          nombre: "Terapia Hormonal Bioidentica",
          categoria: "ginecologia",
          descripcion: "Tratamiento personalizado con hormonas estructuralmente idénticas a las producidas por el cuerpo humano para aliviar síntomas de la menopausia y mejorar el bienestar general.",
          duracion: "Tratamiento continuo con revisiones trimestrales",
          imagen: tratamiento6,
          especialista: "Ginecólogo especializado en endocrinología ginecológica",
          beneficios: [
            "Alivio de sofocos y sudores nocturnos",
            "Mejora de la sequedad vaginal y la función sexual",
            "Prevención de la pérdida ósea",
            "Estabilización del estado de ánimo",
            "Mejora de la calidad del sueño y la energía"
          ],
          paraQuien: "Mujeres con síntomas moderados a severos de la menopausia, menopausia prematura o quirúrgica, o con riesgo elevado de osteoporosis.",
          preparacion: "Evaluación hormonal completa mediante análisis de sangre o saliva para personalizar el tratamiento.",
          contraindicaciones: "Cáncer de mama o endometrio activo, antecedentes de tromboembolismo, enfermedad hepática activa, sangrado vaginal anormal no diagnosticado."
        },

        // PEDIATRÍA
        {
          id: 7,
          nombre: "Terapia Respiratoria Pediátrica",
          categoria: "pediatria",
          descripcion: "Conjunto de técnicas y procedimientos para mejorar la función respiratoria en niños con trastornos respiratorios agudos o crónicos mediante fisioterapia torácica, nebulizaciones y educación.",
          duracion: "30-45 minutos por sesión",
          imagen: tratamiento7,
          especialista: "Pediatra neumólogo y Fisioterapeuta respiratorio",
          beneficios: [
            "Eliminación eficaz de secreciones bronquiales",
            "Mejora de la expansión pulmonar y capacidad respiratoria",
            "Prevención de complicaciones respiratorias",
            "Reducción de recaídas en enfermedades crónicas",
            "Educación a padres sobre manejo domiciliario"
          ],
          paraQuien: "Niños con asma, bronquiolitis, fibrosis quística, bronquitis recurrente, neumonía, atelectasias o después de cirugías torácicas.",
          preparacion: "Acudir con ropa cómoda. Realizar el tratamiento preferiblemente antes de las comidas o 2 horas después.",
          contraindicaciones: "Neumotórax no drenado, hemoptisis severa, estado asmático agudo, inestabilidad hemodinámica o traumatismo torácico reciente."
        },
        {
          id: 8,
          nombre: "Evaluación del Desarrollo Infantil",
          categoria: "pediatria",
          descripcion: "Valoración integral y sistemática del desarrollo psicomotor, cognitivo, del lenguaje y socioemocional del niño para detectar posibles alteraciones o retrasos en el desarrollo normal.",
          duracion: "60-90 minutos",
          imagen: tratamiento8,
          especialista: "Pediatra del desarrollo y Psicólogo infantil",
          beneficios: [
            "Detección temprana de retrasos o alteraciones del desarrollo",
            "Intervención precoz en problemas del neurodesarrollo",
            "Orientación personalizada a padres",
            "Planificación de intervenciones específicas si son necesarias",
            "Seguimiento del progreso individual"
          ],
          paraQuien: "Niños con sospecha de retraso del desarrollo, prematuros, con factores de riesgo perinatal, antecedentes familiares de trastornos del desarrollo, o como control rutinario del desarrollo normal.",
          preparacion: "Llevar informes previos relevantes. El niño debe estar descansado y en su mejor momento del día.",
          contraindicaciones: "No existen contraindicaciones para esta evaluación no invasiva."
        },

        // NEUROLOGÍA
        {
          id: 9,
          nombre: "Estimulación Magnética Transcraneal (EMT)",
          categoria: "neurologia",
          descripcion: "Procedimiento no invasivo que utiliza campos magnéticos para estimular áreas específicas del cerebro, con aplicaciones terapéuticas en diversos trastornos neurológicos y psiquiátricos.",
          duracion: "20-40 minutos por sesión (tratamientos de 2-6 semanas)",
          imagen: tratamiento9,
          especialista: "Neurólogo o Psiquiatra especializado",
          beneficios: [
            "Tratamiento no farmacológico para depresión resistente",
            "Alivio de migrañas crónicas",
            "Mejoría en pacientes con dolor neuropático",
            "Recuperación funcional post-ictus",
            "Tratamiento complementario en trastornos del movimiento"
          ],
          paraQuien: "Pacientes con depresión resistente a medicamentos, migraña crónica, dolor neuropático, recuperación post-ictus, o enfermedad de Parkinson.",
          preparacion: "Informar sobre implantes metálicos o dispositivos electrónicos. Retirar objetos metálicos. Se puede comer normalmente antes.",
          contraindicaciones: "Implantes metálicos en cabeza (excepto dentales), marcapasos, desfibriladores implantados, historia de epilepsia, embarazo o hipertensión intracraneal."
        },
        {
          id: 10,
          nombre: "Terapia de Rehabilitación Cognitiva",
          categoria: "neurologia",
          descripcion: "Programa estructurado de ejercicios y actividades diseñados para mejorar funciones cognitivas como memoria, atención, velocidad de procesamiento, funciones ejecutivas y habilidades visuoespaciales.",
          duracion: "45-60 minutos por sesión (2-3 veces por semana)",
          imagen: tratamiento10,
          especialista: "Neuropsicólogo y Terapeuta ocupacional",
          beneficios: [
            "Mejora de funciones cognitivas deterioradas",
            "Desarrollo de estrategias compensatorias",
            "Mayor independencia en actividades cotidianas",
            "Reincorporación laboral o académica más exitosa",
            "Mejora de la calidad de vida y autoestima"
          ],
          paraQuien: "Pacientes con daño cerebral adquirido (ictus, traumatismo craneoencefálico), deterioro cognitivo leve, demencia en fases iniciales, esclerosis múltiple o trastornos del neurodesarrollo.",
          preparacion: "Evaluación neuropsicológica previa. Acudir descansado y, si es posible, en el momento del día con mejor rendimiento cognitivo.",
          contraindicaciones: "No existen contraindicaciones específicas. Se adapta a las capacidades individuales del paciente."
        },

        // ODONTOLOGÍA
        {
          id: 11,
          nombre: "Blanqueamiento Dental Profesional",
          categoria: "odontologia",
          descripcion: "Procedimiento estético que utiliza agentes blanqueadores de alta concentración activados con luz para aclarar el color de los dientes de manera segura y controlada.",
          duracion: "60-90 minutos",
          imagen: tratamiento11,
          especialista: "Odontólogo especialista en estética dental",
          beneficios: [
            "Mejora notable del color dental en una sola sesión",
            "Resultados uniformes y naturales",
            "Técnica segura realizada por profesionales",
            "Aumento de la autoestima y confianza",
            "Efectos duraderos con mantenimiento adecuado"
          ],
          paraQuien: "Adultos con dientes sanos pero con decoloración o amarilleamiento por edad, consumo de café, té, vino tinto, tabaco o ciertos medicamentos.",
          preparacion: "Limpieza dental profesional previa. Evitar alimentos y bebidas muy pigmentadas 48h antes. Tratamiento de caries o problemas gingivales previo al blanqueamiento.",
          contraindicaciones: "Embarazo y lactancia, menores de 18 años, hipersensibilidad dental severa, erosión del esmalte, caries activas o enfermedad periodontal no tratada, restauraciones extensas en dientes anteriores."
        },
        {
          id: 12,
          nombre: "Tratamiento de Conductos (Endodoncia)",
          categoria: "odontologia",
          descripcion: "Procedimiento que elimina la pulpa dental infectada o dañada, limpia y desinfecta el interior del diente y sella los conductos radiculares para preservar el diente natural.",
          duracion: "60-120 minutos (puede requerir varias sesiones)",
          imagen: tratamiento12,
          especialista: "Endodoncista u Odontólogo general",
          beneficios: [
            "Eliminación del dolor dental agudo",
            "Preservación del diente natural",
            "Prevención de la propagación de infección",
            "Restauración de la función masticatoria",
            "Alta tasa de éxito a largo plazo"
          ],
          paraQuien: "Pacientes con pulpitis irreversible, necrosis pulpar, abscesos dentales, traumatismos dentales o dientes con necesidad de tratamiento previo a rehabilitación protésica.",
          preparacion: "Tomar analgésicos prescritos antes si hay dolor. Comer antes del procedimiento, ya que después la anestesia dificulta la alimentación.",
          contraindicaciones: "Dientes con fracturas verticales no restaurables, enfermedad periodontal severa con movilidad excesiva o pacientes con condiciones médicas no controladas que impidan procedimientos odontológicos."
        },

        // OFTALMOLOGÍA
        {
          id: 13,
          nombre: "Cirugía Refractiva Láser",
          categoria: "oftalmologia",
          descripcion: "Intervención quirúrgica que utiliza tecnología láser para remodelar la córnea y corregir errores refractivos como miopía, hipermetropía y astigmatismo, reduciendo o eliminando la dependencia de gafas o lentillas.",
          duracion: "15-30 minutos (ambos ojos)",
          imagen: tratamiento13,
          especialista: "Oftalmólogo especialista en cirugía refractiva",
          beneficios: [
            "Corrección permanente de errores refractivos",
            "Independencia de gafas y lentillas en la mayoría de casos",
            "Recuperación rápida de la visión",
            "Mínimas molestias postoperatorias",
            "Alta tasa de satisfacción del paciente"
          ],
          paraQuien: "Adultos mayores de 18 años con graduación estable al menos un año, con miopía, hipermetropía o astigmatismo dentro de los rangos tratables.",
          preparacion: "Suspender el uso de lentes de contacto 2 semanas antes para lentes blandas y 4 semanas para rígidas. No usar maquillaje ocular el día de la cirugía.",
          contraindicaciones: "Queratocono, enfermedades autoinmunes, diabetes no controlada, glaucoma avanzado, cataratas significativas, embarazo, lactancia o córnea muy fina."
        },
        {
          id: 14,
          nombre: "Tratamiento con Inyecciones Intravítreas",
          categoria: "oftalmologia",
          descripcion: "Administración de medicamentos directamente en el humor vítreo del ojo para tratar diversas enfermedades de la retina como degeneración macular húmeda, edema macular diabético o trombosis venosa retiniana.",
          duracion: "15-20 minutos",
          imagen: tratamiento14,
          especialista: "Oftalmólogo especialista en retina",
          beneficios: [
            "Administración directa del fármaco en el lugar afectado",
            "Control eficaz de la progresión de enfermedades retinianas",
            "Potencial mejora de la visión o estabilización del deterioro",
            "Procedimiento ambulatorio de corta duración",
            "Opción terapéutica para enfermedades antes intratables"
          ],
          paraQuien: "Pacientes con degeneración macular asociada a la edad (DMAE) húmeda, edema macular diabético, oclusiones venosas retinianas, retinopatía diabética proliferativa o neovascularización coroidea miópica.",
          preparacion: "Aplicación de colirios antibióticos días antes según prescripción. No requiere ayuno. Se administra anestesia tópica ocular.",
          contraindicaciones: "Infección ocular activa, alergia conocida al medicamento a inyectar. Precaución en pacientes anticoagulados."
        },
      ];

      setTreatments(mockTreatments);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar tratamientos por categoría y término de búsqueda
  const filteredTreatments = treatments.filter(treatment => {
    const matchesCategory = activeCategory === "todos" || treatment.categoria === activeCategory;
    const matchesSearch = treatment.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         treatment.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Función para mostrar detalles del tratamiento
  const showDetails = (id) => {
    setShowTreatmentDetails(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para cerrar detalles
  const closeDetails = () => {
    setShowTreatmentDetails(null);
  };

  // Obtener tratamiento seleccionado
  const selectedTreatment = treatments.find(t => t.id === showTreatmentDetails);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} navigate={navigate} />
      
      <div className="tratamientos-container">
        <div className="tratamientos-header">
          <h1>Tratamientos y Procedimientos Médicos</h1>
          <p>Conozca nuestra amplia gama de tratamientos especializados diseñados para diagnosticar, tratar y mejorar su salud</p>
        </div>

        {/* Mostrar detalles del tratamiento seleccionado */}
        {selectedTreatment && (
          <div className="tratamiento-detalle">
            <button className="cerrar-detalle-btn" onClick={closeDetails}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="detalle-header">
              <div className="detalle-imagen-container">
                {selectedTreatment.imagen ? (
                  <img src={selectedTreatment.imagen} alt={selectedTreatment.nombre} className="detalle-imagen" />
                ) : (
                  <div className="detalle-imagen-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="detalle-info-principal">
                <div className="detalle-categoria-badge">{selectedTreatment.categoria.charAt(0).toUpperCase() + selectedTreatment.categoria.slice(1)}</div>
                <h2>{selectedTreatment.nombre}</h2>
                <p className="detalle-descripcion">{selectedTreatment.descripcion}</p>
                
                <div className="detalle-meta-info">
                  <div className="detalle-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span><strong>Duración:</strong> {selectedTreatment.duracion}</span>
                  </div>
                  
                  <div className="detalle-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span><strong>Especialista:</strong> {selectedTreatment.especialista}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="detalle-contenido">
              <div className="detalle-seccion">
                <h3>Beneficios</h3>
                <ul className="beneficios-lista">
                  {selectedTreatment.beneficios.map((beneficio, index) => (
                    <li key={index}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      {beneficio}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="detalle-seccion">
                <h3>¿Para quién está indicado?</h3>
                <p>{selectedTreatment.paraQuien}</p>
              </div>
              
              <div className="detalle-seccion">
                <h3>Preparación para el tratamiento</h3>
                <p>{selectedTreatment.preparacion}</p>
              </div>
              
              <div className="detalle-seccion">
                <h3>Contraindicaciones</h3>
                <p>{selectedTreatment.contraindicaciones}</p>
              </div>
              
              <div className="detalle-nota">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>La información proporcionada es general. Para determinar si este tratamiento es adecuado para su caso específico, consulte con nuestros especialistas durante su cita médica.</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="tratamientos-filtros">
          <div className="categorias-tabs">
            <button 
              className={activeCategory === "todos" ? "categoria-tab active" : "categoria-tab"} 
              onClick={() => setActiveCategory("todos")}>
              Todos
            </button>
            <button 
              className={activeCategory === "cardiologia" ? "categoria-tab active" : "categoria-tab"} 
              onClick={() => setActiveCategory("cardiologia")}>
              Cardiología
            </button>
            <button 
              className={activeCategory === "dermatologia" ? "categoria-tab active" : "categoria-tab"} 
              onClick={() => setActiveCategory("dermatologia")}>
              Dermatología
            </button>
            <button 
              className={activeCategory === "ginecologia" ? "categoria-tab active" : "categoria-tab"} 
              onClick={() => setActiveCategory("ginecologia")}>
              Ginecología
            </button>
            <button 
              className={activeCategory === "pediatria" ? "categoria-tab active" : "categoria-tab"} 
              onClick={() => setActiveCategory("pediatria")}>
              Pediatría
            </button>
            <button 
              className={activeCategory === "neurologia" ? "categoria-tab active" : "categoria-tab"} 
              onClick={() => setActiveCategory("neurologia")}>
              Neurología
            </button>
            <button 
              className={activeCategory === "odontologia" ? "categoria-tab active" : "categoria-tab"} 
              onClick={() => setActiveCategory("odontologia")}>
              Odontología
            </button>
            <button 
              className={activeCategory === "oftalmologia" ? "categoria-tab active" : "categoria-tab"} 
              onClick={() => setActiveCategory("oftalmologia")}>
              Oftalmología
            </button>
          </div>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar tratamientos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Listado de tratamientos */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando tratamientos...</p>
          </div>
        ) : (
          <>
            {filteredTreatments.length > 0 ? (
              <div className="tratamientos-grid">
                {filteredTreatments.map((tratamiento) => (
                  <div className="tratamiento-card" key={tratamiento.id}>
                    <div className="tratamiento-imagen">
                      {tratamiento.imagen ? (
                        <img src={tratamiento.imagen} alt={tratamiento.nombre} />
                      ) : (
                        <div className="imagen-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="tratamiento-content">
                      <div className="categoria-badge">{tratamiento.categoria.charAt(0).toUpperCase() + tratamiento.categoria.slice(1)}</div>
                      <h3>{tratamiento.nombre}</h3>
                      <p className="tratamiento-descripcion">{tratamiento.descripcion}</p>
                      
                      <div className="tratamiento-meta">
                        <div className="meta-item">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>{tratamiento.duracion}</span>
                        </div>
                        
                        <div className="meta-item">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span>{tratamiento.especialista}</span>
                        </div>
                      </div>
                      
                      <button 
                        className="ver-detalles-btn" 
                        onClick={() => showDetails(tratamiento.id)}>
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-resultados">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                <h3>No se encontraron tratamientos</h3>
                <p>Prueba con diferentes criterios de búsqueda o categoría</p>
                <button onClick={() => {setSearchTerm(""); setActiveCategory("todos");}}>
                  Borrar filtros
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Sección de información complementaria */}
        <div className="info-complementaria">
          <h2>Nuestro compromiso con su salud</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3>Tecnología de vanguardia</h3>
              <p>Contamos con equipamiento médico de última generación para diagnósticos precisos y tratamientos efectivos en todas nuestras especialidades.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Médicos especialistas</h3>
              <p>Nuestro equipo está formado por especialistas de amplia experiencia y formación continua en cada una de las áreas médicas que ofrecemos.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </div>
              <h3>Atención personalizada</h3>
              <p>Adaptamos los tratamientos a las necesidades específicas de cada paciente, siguiendo protocolos médicos reconocidos internacionalmente.</p>
            </div>
          </div>
          
          <div className="tratamientos-cta">
            <h3>¿Necesita una consulta especializada?</h3>
            <p>Nuestros profesionales están listos para atenderle y ofrecerle el tratamiento más adecuado para su situación específica.</p>
            <button onClick={() => navigate("cita-medica")} className="contacto-btn">
              Solicitar cita médica
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tratamientos;