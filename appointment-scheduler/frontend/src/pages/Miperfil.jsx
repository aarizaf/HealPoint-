import React, { useState, useEffect } from "react";
import "./Miperfil.css";
import Navbar from "./Navbar";

const MiPerfil = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    documento: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    ciudad: "",
    imgUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Verificar si el usuario está logueado
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("login");
      return;
    }

    // Cargar datos del usuario desde localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("login");
      return;
    }

    // Simulamos la carga de datos (en una app real, esto vendría de una API)
    setTimeout(() => {
      const storedUserData = JSON.parse(localStorage.getItem(`userData_${userEmail}`) || "{}");
      
      // Si no hay datos específicos, usar un perfil predeterminado con el email
      if (Object.keys(storedUserData).length === 0) {
        const defaultData = {
          nombre: userEmail.split("@")[0],
          apellido: "",
          email: userEmail,
          telefono: "",
          documento: "",
          fechaNacimiento: "",
          genero: "",
          direccion: "",
          ciudad: "",
          imgUrl: `https://ui-avatars.com/api/?name=${userEmail.charAt(0)}&background=10B981&color=fff&size=200`
        };
        setUserData(defaultData);
        // Guardar perfil predeterminado para futuras visitas
        localStorage.setItem(`userData_${userEmail}`, JSON.stringify(defaultData));
      } else {
        setUserData(storedUserData);
      }
      
      setLoading(false);
    }, 800);
  }, [isLoggedIn, navigate]);

  // Iniciar edición con los datos actuales
  const handleEdit = () => {
    setEditedData({...userData});
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  // Cancelar edición
  const handleCancel = () => {
    setIsEditing(false);
    setChangePassword(false);
    setError("");
  };

  // Actualizar campo en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };

  // Actualizar campo en el formulario de cambio de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Guardar cambios del perfil
  const handleSaveChanges = () => {
    // Validar datos (puedes agregar más validaciones)
    if (!editedData.nombre || !editedData.email) {
      setError("Nombre y Email son campos obligatorios");
      return;
    }
    
    // En una app real, enviarías estos datos a una API
    setLoading(true);
    
    setTimeout(() => {
      const userEmail = localStorage.getItem("userEmail");
      // Actualizar datos en localStorage
      localStorage.setItem(`userData_${userEmail}`, JSON.stringify(editedData));
      
      // Si el email cambió, actualizar también la clave de sesión
      if (editedData.email !== userData.email) {
        localStorage.setItem("userEmail", editedData.email);
      }
      
      setUserData(editedData);
      setIsEditing(false);
      setSuccess("Perfil actualizado correctamente");
      setLoading(false);
    }, 1000);
  };

  // Cambiar contraseña
  const handleChangePassword = () => {
    // Validar contraseñas
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }
    
    // En una app real verificarías la contraseña actual contra la BD
    setLoading(true);
    
    setTimeout(() => {
      // Simulamos un cambio exitoso
      setChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setSuccess("Contraseña actualizada correctamente");
      setLoading(false);
    }, 1000);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Construir nombre completo
  const fullName = `${userData.nombre || ""} ${userData.apellido || ""}`.trim() || "Usuario";

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} navigate={navigate} />
      
      <div className="profileContainer">
        <div className="profileCard">
          {loading ? (
            <div className="loadingProfile">
              <div className="loadingSpinner"></div>
              <p>Cargando información del perfil...</p>
            </div>
          ) : (
            <>
              {!isEditing ? (
                // Vista de perfil
                <div className="profileView">
                  <div className="profileHeader">
                    <div className="profileImage">
                      <img 
                        src={userData.imgUrl || `https://ui-avatars.com/api/?name=${userData.nombre?.charAt(0)}&background=10B981&color=fff&size=200`}
                        alt={fullName}
                      />
                    </div>
                    <div className="profileInfo">
                      <h1 className="profileName">{fullName}</h1>
                      <p className="profileEmail">{userData.email}</p>
                      {userData.documento && (
                        <p className="profileDocument">DNI: {userData.documento}</p>
                      )}
                    </div>
                    <button className="editButton" onClick={handleEdit}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Editar Perfil
                    </button>
                  </div>
                  
                  {success && (
                    <div className="successMessage">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      {success}
                    </div>
                  )}
                  
                  <div className="profileDetailsSection">
                    <h2 className="sectionTitle">Información Personal</h2>
                    
                    <div className="detailsGrid">
                      <div className="detailItem">
                        <h3>Fecha de Nacimiento</h3>
                        <p>{userData.fechaNacimiento ? formatDate(userData.fechaNacimiento) : "No especificado"}</p>
                      </div>
                      
                      <div className="detailItem">
                        <h3>Género</h3>
                        <p>{userData.genero || "No especificado"}</p>
                      </div>
                      
                      <div className="detailItem">
                        <h3>Teléfono</h3>
                        <p>{userData.telefono || "No especificado"}</p>
                      </div>
                      
                      <div className="detailItem">
                        <h3>Dirección</h3>
                        <p>{userData.direccion || "No especificado"}</p>
                      </div>
                      
                      <div className="detailItem">
                        <h3>Ciudad</h3>
                        <p>{userData.ciudad || "No especificado"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profileActions">
                    <button className="passwordButton" onClick={() => {
                      setChangePassword(true);
                      setIsEditing(true);
                      setError("");
                      setSuccess("");
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Cambiar Contraseña
                    </button>
                    
                    <button className="appointmentsButton" onClick={() => navigate("mis-citas")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Mis Citas
                    </button>
                  </div>
                </div>
              ) : (
                // Formulario de edición
                <div className="profileEditForm">
                  <h2 className="formTitle">
                    {changePassword ? "Cambiar Contraseña" : "Editar Información Personal"}
                  </h2>
                  
                  {error && (
                    <div className="errorMessage">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {error}
                    </div>
                  )}
                  
                  {!changePassword ? (
                    // Formulario de datos personales
                    <div className="formGrid">
                      <div className="formGroup">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={editedData.nombre || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="apellido">Apellido</label>
                        <input
                          type="text"
                          id="apellido"
                          name="apellido"
                          value={editedData.apellido || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editedData.email || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={editedData.telefono || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="documento">Documento de Identidad</label>
                        <input
                          type="text"
                          id="documento"
                          name="documento"
                          value={editedData.documento || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          id="fechaNacimiento"
                          name="fechaNacimiento"
                          value={editedData.fechaNacimiento || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="genero">Género</label>
                        <select
                          id="genero"
                          name="genero"
                          value={editedData.genero || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Seleccionar</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Femenino">Femenino</option>
                          <option value="No binario">No binario</option>
                          <option value="Prefiero no decir">Prefiero no decir</option>
                        </select>
                      </div>
                      
                      <div className="formGroup fullWidth">
                        <label htmlFor="direccion">Dirección</label>
                        <input
                          type="text"
                          id="direccion"
                          name="direccion"
                          value={editedData.direccion || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="ciudad">Ciudad</label>
                        <input
                          type="text"
                          id="ciudad"
                          name="ciudad"
                          value={editedData.ciudad || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="imgUrl">URL de Imagen de Perfil</label>
                        <input
                          type="text"
                          id="imgUrl"
                          name="imgUrl"
                          value={editedData.imgUrl || ""}
                          onChange={handleInputChange}
                          placeholder="Dejar vacío para usar imagen por defecto"
                        />
                      </div>
                    </div>
                  ) : (
                    // Formulario de cambio de contraseña
                    <div className="formGrid">
                      <div className="formGroup fullWidth">
                        <label htmlFor="currentPassword">Contraseña Actual</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="formActions">
                    <button 
                      type="button" 
                      className="cancelButton" 
                      onClick={handleCancel}
                    >
                      Cancelar
                    </button>
                    
                    <button 
                      type="button" 
                      className="saveButton" 
                      onClick={changePassword ? handleChangePassword : handleSaveChanges}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="buttonLoading">
                          <svg className="spinner" viewBox="0 0 24 24">
                            <circle className="spinnerPath" cx="12" cy="12" r="10" fill="none" strokeWidth="3"></circle>
                          </svg>
                          <span>Guardando...</span>
                        </div>
                      ) : (
                        "Guardar Cambios"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MiPerfil;