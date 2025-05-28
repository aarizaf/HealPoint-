import React, { useState, useEffect } from "react";
import axios from "axios";
import medicoImage from "../imgs/medicos.jpg";
import "./AuthPages.css";

const API_URL = "http://localhost:8080"; 

const RegisterPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    cedula: "",
    password: "",
    confirmPassword: "",
    genero: "", 
    telefono: "", 
    fecha_nacimiento: "",
    aceptaTerminos: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isMounted = React.useRef(true);

  // Limpiar la referencia cuando el componente se desmonte
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Limpiar mensajes de error cuando el usuario modifica un campo
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Validaciones del lado del cliente
    if (formData.nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      setLoading(false);
      return;
    }

    if (formData.cedula.trim().length < 5) {
      setError("La cédula debe tener al menos 5 caracteres");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      // Formatear fecha si existe
      let fechaNacimiento = null;
      if (formData.fecha_nacimiento) {
        fechaNacimiento = new Date(formData.fecha_nacimiento).toISOString().split('T')[0];
      }

      // Preparar los datos para la API según la estructura esperada
      const pacienteData = {
        nombre: formData.nombre,
        correo: formData.email,                // Corresponde a 'correo' en el backend
        cedula: formData.cedula,               // Campo obligatorio
        contraseña: formData.password,         // Corresponde a 'contraseña' en el backend
        telefono: formData.telefono || null,
        genero: formData.genero || "no especificado",
        fecha_nacimiento: fechaNacimiento,
      };

      console.log("Enviando datos al servidor:", pacienteData);

      // Llamada a la API
      const response = await axios.post(`${API_URL}/pacientes/`, pacienteData);

      console.log("Registro exitoso:", response.data);

      // Mostrar mensaje de éxito y redirigir
      setSuccessMessage("¡Registro exitoso! Redirigiendo...");
      
      // Limpiar formulario
      setFormData({
        nombre: "",
        email: "",
        cedula: "",
        password: "",
        confirmPassword: "",
        genero: "",
        telefono: "",
        fecha_nacimiento: "",
        aceptaTerminos: false,
      });
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        if (isMounted.current) {
          navigate("registro-exitoso");
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error en el registro:", error);

      if (isMounted.current) {
        if (error.response && error.response.data) {
          setError(
            error.response.data.detail ||
              "Error al registrar. Por favor, intenta de nuevo."
          );
        } else {
          setError(
            "No se pudo completar el registro. Por favor, intenta de nuevo."
          );
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleReturnHome = () => {
    navigate("home");
  };

  return (
    <div className="authContainer">
      <div className="authBanner">
        <img src={medicoImage} alt="Médicos" />
      </div>

      <div className="authCard registerCard">
        <div className="returnHomeLink" onClick={handleReturnHome}>
          <span>Volver al inicio</span>
        </div>

        <div className="authHeader">
          <div className="logoContainer">
            <div className="logoBox">H</div>
            <span className="logoText">HealPoint</span>
          </div>
          <h1 className="authTitle">Crea tu cuenta</h1>
          <p className="authSubtitle">
            Únete a HealPoint y comienza a gestionar tus citas y pacientes de
            forma eficiente
          </p>
        </div>

        {error && (
          <div className="errorAlert">
            <span>{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="successAlert">
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="authForm">
          <div className="formGroup">
            <label htmlFor="nombre" className="formLabel">
              Nombre completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="formInput"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="cedula" className="formLabel">
              Cédula
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              className="formInput"
              placeholder="1043662497"
              value={formData.cedula}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="telefono" className="formLabel">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              className="formInput"
              placeholder="555-123-4567"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="email" className="formLabel">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="formInput"
              placeholder="tu@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password" className="formLabel">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="formInput"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              autoComplete="new-password"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="confirmPassword" className="formLabel">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="formInput"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="fecha_nacimiento" className="formLabel">
              Fecha de nacimiento (opcional)
            </label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              className="formInput"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="genero" className="formLabel">
              Género (opcional)
            </label>
            <select
              id="genero"
              name="genero"
              className="formInput"
              value={formData.genero}
              onChange={handleChange}
            >
              <option value="">Seleccione una opción</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="no especificado">Prefiero no decirlo</option>
            </select>
          </div>

          <div className="formGroup termsCheck">
            <input
              type="checkbox"
              id="aceptaTerminos"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
              required
            />
            <label htmlFor="aceptaTerminos">
              Acepto los{" "}
              <span className="termsLink" onClick={() => navigate("terminos")}>
                Términos de servicio
              </span>{" "}
              y la{" "}
              <span
                className="termsLink"
                onClick={() => navigate("privacidad")}
              >
                Política de privacidad
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="authButton"
            disabled={loading || !formData.aceptaTerminos}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="authPrompt">
          <span>¿Ya tienes una cuenta?</span>
          <span className="authLink" onClick={() => navigate("login")}>
            Iniciar sesión
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;