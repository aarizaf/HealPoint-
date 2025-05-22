import React, { useState, useEffect, useRef } from "react";
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
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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
    if (userData.imgUrl) {
      setImagePreview(userData.imgUrl);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setIsEditing(false);
    setChangePassword(false);
    setError("");
    setImagePreview(null);
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

  // Manejar cambio de imagen de perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // En una app real, aquí subirías la imagen a un servidor
      // y obtendrías una URL. Para este ejemplo, usamos FileReader
      // para una vista previa local.
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setEditedData({
          ...editedData,
          imgUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen de perfil
  const handleRemoveImage = () => {
    setImagePreview(null);
    setEditedData({
      ...editedData,
      imgUrl: ""
    });
  };

  // Guardar cambios del perfil
  const handleSaveChanges = () => {
    // Validar datos (puedes agregar más validaciones)
    if (!editedData.nombre || !editedData.email) {
      setError("Nombre y Email son campos obligatorios");
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedData.email)) {
      setError("Por favor, ingresa un email válido");
      return;
    }
    
    // Validar formato de teléfono (si se proporciona)
    if (editedData.telefono && !/^\d{7,15}$/.test(editedData.telefono.replace(/\s/g, ""))) {
      setError("Por favor, ingresa un número de teléfono válido");
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
      setImagePreview(null);
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
    
    // Validar requisitos de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial");
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

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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

  // Calcular edad a partir de fecha de nacimiento
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const userAge = calculateAge(userData.fechaNacimiento);

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
                      <p className="profileEmail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        {userData.email}
                      </p>
                      {userData.documento && (
                        <p className="profileDocument">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                          </svg>
                          DNI: {userData.documento}
                        </p>
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
                    <h2 className="sectionTitle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Información Personal
                    </h2>
                    
                    <div className="detailsGrid">
                      <div className="detailItem">
                        <h3>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Fecha de Nacimiento
                        </h3>
                        <p>
                          {userData.fechaNacimiento ? formatDate(userData.fechaNacimiento) : "No especificado"}
                          {userAge && <span> ({userAge} años)</span>}
                        </p>
                      </div>
                      
                      <div className="detailItem">
                        <h3>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          Género
                        </h3>
                        <p>{userData.genero || "No especificado"}</p>
                      </div>
                      
                      <div className="detailItem">
                        <h3>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          Teléfono
                        </h3>
                        <p>{userData.telefono || "No especificado"}</p>
                      </div>
                      
                      <div className="detailItem">
                        <h3>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          Dirección
                        </h3>
                        <p>{userData.direccion || "No especificado"}</p>
                      </div>
                      
                      <div className="detailItem">
                        <h3>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                          </svg>
                          Ciudad
                        </h3>
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
                      Ver Mis Citas
                    </button>
                  </div>
                </div>
              ) : (
                // Formulario de edición
                <div className="profileEditForm">
                  <h2 className="formTitle">
                    {changePassword ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Cambiar Contraseña
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Editar Información Personal
                      </>
                    )}
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
                    <>
                      {/* Imagen de perfil */}
                      <div className="formGroup fullWidth">
                        <label htmlFor="imgUrl">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                          Imagen de Perfil
                        </label>
                        
                        <div 
                          className="imagePreview"
                          style={{
                            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                            backgroundColor: imagePreview ? 'transparent' : '#f3f4f6'
                          }}
                        >
                          {!imagePreview ? (
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                              color: '#9CA3AF' 
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                              <p style={{ marginTop: '8px' }}>Haga clic para subir una imagen</p>
                            </div>
                          ) : null}
                          
                          <div className="imageOverlay">
                            <div className="imageActions">
                              <button 
                                type="button"
                                className="imageAction"
                                onClick={() => fileInputRef.current.click()}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="17 8 12 3 7 8"></polyline>
                                  <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                              </button>
                              
                              {imagePreview && (
                                <button 
                                  type="button"
                                  className="imageAction"
                                  onClick={handleRemoveImage}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                      
                      <div className="formGrid">
                        <div className="formGroup">
                          <label htmlFor="nombre">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Nombre
                          </label>
                          <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={editedData.nombre || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingresa tu nombre"
                          />
                        </div>
                        
                        <div className="formGroup">
                          <label htmlFor="apellido">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Apellido
                          </label>
                          <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            value={editedData.apellido || ""}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu apellido"
                          />
                        </div>
                        
                        <div className="formGroup">
                          <label htmlFor="email">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Correo Electrónico
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={editedData.email || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="tu@email.com"
                          />
                        </div>
                        
                        <div className="formGroup">
                          <label htmlFor="telefono">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={editedData.telefono || ""}
                            onChange={handleInputChange}
                            placeholder="Ej: 3123456789"
                          />
                        </div>
                        
                        <div className="formGroup">
                          <label htmlFor="documento">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                            </svg>
                            Documento de Identidad
                          </label>
                          <input
                            type="text"
                            id="documento"
                            name="documento"
                            value={editedData.documento || ""}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu número de documento"
                          />
                        </div>
                        
                        <div className="formGroup">
                          <label htmlFor="fechaNacimiento">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Fecha de Nacimiento
                          </label>
                          <input
                            type="date"
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            value={editedData.fechaNacimiento || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="formGroup">
                          <label htmlFor="genero">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            Género
                          </label>
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
                          <label htmlFor="direccion">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            Dirección
                          </label>
                          <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={editedData.direccion || ""}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu dirección completa"
                          />
                        </div>
                        
                        <div className="formGroup">
                          <label htmlFor="ciudad">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="8" y1="6" x2="21" y2="6"></line>
                              <line x1="8" y1="12" x2="21" y2="12"></line>
                              <line x1="8" y1="18" x2="21" y2="18"></line>
                              <line x1="3" y1="6" x2="3.01" y2="6"></line>
                              <line x1="3" y1="12" x2="3.01" y2="12"></line>
                              <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                            Ciudad
                          </label>
                          <input
                            type="text"
                            id="ciudad"
                            name="ciudad"
                            value={editedData.ciudad || ""}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu ciudad"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    // Formulario de cambio de contraseña
                    <div className="formGrid">
                      <div className="formGroup fullWidth">
                        <label htmlFor="currentPassword">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          Contraseña Actual
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword.current ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="Ingresa tu contraseña actual"
                          />
                          <span 
                            className="inputIcon" 
                            onClick={() => togglePasswordVisibility('current')}
                            style={{ cursor: 'pointer' }}
                          >
                            {showPassword.current ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="newPassword">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          Nueva Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword.new ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="Ingresa tu nueva contraseña"
                          />
                          <span 
                            className="inputIcon" 
                            onClick={() => togglePasswordVisibility('new')}
                            style={{ cursor: 'pointer' }}
                          >
                            {showPassword.new ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="formGroup">
                        <label htmlFor="confirmPassword">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          Confirmar Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="Confirma tu nueva contraseña"
                          />
                          <span 
                            className="inputIcon" 
                            onClick={() => togglePasswordVisibility('confirm')}
                            style={{ cursor: 'pointer' }}
                          >
                            {showPassword.confirm ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                              </svg>
                            )}
                          </span>
                        </div>
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