/**
 * Verifica la autenticación del usuario con el backend
 * @returns {Promise<Object|null>} Los datos del usuario o null si no está autenticado
 */
export const checkAuthentication = async () => {
  const token = localStorage.getItem('healpoint_token');
  if (!token) return null;
  
  try {
    const response = await fetch('http://localhost:8000/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    const data = await response.json();
    
    if (data.valid && data.user_data) {
      return data.user_data;
    } else {
      // Si el token no es válido, limpiar el almacenamiento local
      localStorage.removeItem('healpoint_token');
      localStorage.removeItem('user_data');
      return null;
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return null;
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = () => {
  localStorage.removeItem('healpoint_token');
  localStorage.removeItem('user_data');
  // Opcional: redirigir al usuario a la página de inicio
  window.location.href = '/';
};