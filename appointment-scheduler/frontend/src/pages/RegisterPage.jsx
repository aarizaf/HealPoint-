import React, { useState } from "react";
import axios from "axios"; // Asegúrate de tener axios instalado: npm install axios
import medicoImage from "../imgs/medicos.jpg";
import "./AuthPages.css";

const API_URL = "http://localhost:8000"; // Ajusta esto a la URL de tu API

const RegisterPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    cedula: "",
    password: "",
    confirmPassword: "",
    genero: "", // Añadido para el backend
    telefono: "", // Añadido para el backend
    fecha_nacimiento: "", // Añadido para el backend
    aceptaTerminos: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isMounted = React.useRef(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      // Preparar los datos para la API según la estructura esperada
      const pacienteData = {
        nombre: formData.nombre,
        correo: formData.email, // Nota: correo en backend, email en frontend
        contraseña: formData.password, // Nota: contraseña en backend, password en frontend
        telefono: formData.telefono || formData.cedula, // Usar cédula como teléfono si no se proporciona
        genero: formData.genero || "no especificado", // Valor por defecto
        fecha_nacimiento: formData.fecha_nacimiento || null, // Opcional
      };

      console.log("Enviando datos al servidor:", pacienteData);

      // Llamada a la API
      const response = await axios.post(`${API_URL}/pacientes/`, pacienteData);

      console.log("Registro exitoso:", response.data);

      // Redirigir o mostrar mensaje de éxito
      navigate("registro-exitoso");
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
