import React, { useState } from "react";
import "./PaymentGateway.css";




const PaymentGateway = ({ appointmentData, onPaymentSuccess, onCancel }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("creditCard"); // creditCard, debit, paypal

  // Calcular precio basado en el tipo de cita
  const calculatePrice = () => {
    const prices = {
      general: 50000, // 50.000 COP
      specialist: 120000, // 120.000 COP
      followup: 30000, // 30.000 COP
      emergency: 150000, // 150.000 COP
    };
    
    return prices[appointmentData.typeId] || 50000;
  };

  // Formatear número de tarjeta mientras el usuario escribe
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Añadir espacios cada 4 dígitos
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Formatear fecha de expiración
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    // Formato MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setExpiryDate(value);
  };

  // Manejar cambios en CVV
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
  };

  // Validar formulario
  const isFormValid = () => {
    if (paymentMethod === "creditCard" || paymentMethod === "debit") {
      return (
        cardNumber.replace(/\s/g, '').length === 16 &&
        cardName.trim().length > 3 &&
        expiryDate.length === 5 &&
        cvv.length >= 3
      );
    }
    return true; // Para PayPal u otros métodos
  };

  // Procesar pago
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simular llamada a API de pago
      const paymentData = {
        amount: calculatePrice(),
        currency: "COP",
        paymentMethod,
        appointmentId: appointmentData.id || Date.now().toString(),
        // Para tarjetas
        ...(paymentMethod !== "paypal" && {
          cardDetails: {
            number: cardNumber.replace(/\s/g, ''),
            name: cardName,
            expiry: expiryDate,
            cvv: cvv
          }
        })
      };

      // En un entorno real, enviarías los datos a tu servidor para procesarlos de forma segura
      // o utilizarías una biblioteca como Stripe.js
      console.log("Enviando datos de pago:", paymentData);
      
      // Simular retraso de procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de respuesta exitosa
      const paymentResponse = {
        success: true,
        transactionId: `TX-${Date.now()}`,
        amount: calculatePrice(),
        currency: "COP",
        date: new Date().toISOString()
      };

      // Aquí podrías hacer una llamada real a la API de pago
      // const response = await axios.post(`${API_URL}/procesar-pago/`, paymentData);
      // const paymentResponse = response.data;
      
      setLoading(false);
      
      // Notificar al componente padre sobre el pago exitoso
      onPaymentSuccess(paymentResponse);
      
    } catch (error) {
      console.error("Error en el procesamiento del pago:", error);
      setLoading(false);
      setError("Ha ocurrido un error al procesar el pago. Por favor, inténtelo nuevamente.");
    }
  };

  // Formatear precio para mostrar
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="paymentGatewayContainer">
      <div className="paymentCard">
        <div className="paymentHeader">
          <h1>Pago de Cita Médica</h1>
          <p className="paymentSubtitle">Complete el pago para confirmar su cita</p>
        </div>

        <div className="appointmentSummary">
          <h2>Resumen de la cita</h2>
          <div className="summaryDetails">
            <div className="summaryItem">
              <span className="summaryLabel">Tipo de cita:</span>
              <span className="summaryValue">{appointmentData.typeName}</span>
            </div>
            <div className="summaryItem">
              <span className="summaryLabel">Fecha:</span>
              <span className="summaryValue">{appointmentData.formattedDate}</span>
            </div>
            <div className="summaryItem">
              <span className="summaryLabel">Hora:</span>
              <span className="summaryValue">{appointmentData.time}</span>
            </div>
            <div className="summaryItem totalPrice">
              <span className="summaryLabel">Costo total:</span>
              <span className="summaryValue price">{formatPrice(calculatePrice())}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="paymentError">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="paymentMethodSelector">
          <h2>Método de pago</h2>
          <div className="paymentMethods">
            <div 
              className={`paymentMethod ${paymentMethod === 'creditCard' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('creditCard')}
            >
              <div className="methodIcon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span>Tarjeta de Crédito</span>
            </div>
            <div 
              className={`paymentMethod ${paymentMethod === 'debit' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('debit')}
            >
              <div className="methodIcon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="15" r="1" fill="currentColor"/>
                </svg>
              </div>
              <span>Tarjeta Débito</span>
            </div>
            <div 
              className={`paymentMethod ${paymentMethod === 'paypal' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className="methodIcon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10C7 6.13401 10.134 3 14 3C17.866 3 21 6.13401 21 10C21 13.866 17.866 17 14 17H7L7 10Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 14C3 10.134 6.13401 7 10 7H17V14C17 17.866 13.866 21 10 21C6.13401 21 3 17.866 3 14Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span>PayPal</span>
            </div>
          </div>
        </div>

        {(paymentMethod === 'creditCard' || paymentMethod === 'debit') && (
          <form onSubmit={handlePayment} className="paymentForm">
            <div className="formGroup">
              <label htmlFor="cardNumber" className="formLabel">Número de tarjeta</label>
              <input
                type="text"
                id="cardNumber"
                className="formInput"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="cardName" className="formLabel">Nombre en la tarjeta</label>
              <input
                type="text"
                id="cardName"
                className="formInput"
                placeholder="NOMBRE COMPLETO"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="expiryDate" className="formLabel">Fecha de expiración</label>
                <input
                  type="text"
                  id="expiryDate"
                  className="formInput"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="cvv" className="formLabel">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  className="formInput"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  required
                />
              </div>
            </div>

            <div className="paymentActions">
              <button type="button" className="cancelPaymentButton" onClick={onCancel}>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="confirmPaymentButton" 
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <div className="buttonLoading">
                    <div className="loadingSpinner"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <span>Pagar {formatPrice(calculatePrice())}</span>
                )}
              </button>
            </div>
          </form>
        )}

        {paymentMethod === 'paypal' && (
          <div className="paypalPayment">
            <div className="paypalLogo">
              <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12C20 17.5228 15.5228 22 10 22C4.47715 22 0 17.5228 0 12C0 6.47715 4.47715 2 10 2C15.5228 2 20 6.47715 20 12Z" fill="#0070E0"/>
                <path d="M40 12C40 17.5228 35.5228 22 30 22C24.4772 22 20 17.5228 20 12C20 6.47715 24.4772 2 30 2C35.5228 2 40 6.47715 40 12Z" fill="#003087"/>
                <rect x="40" y="2" width="60" height="20" rx="10" fill="#009CDE"/>
              </svg>
            </div>
            <p className="paypalText">Serás redirigido a PayPal para completar el pago de manera segura.</p>
            <div className="paymentActions">
              <button type="button" className="cancelPaymentButton" onClick={onCancel}>
                Cancelar
              </button>
              <button 
                type="button" 
                className="confirmPaymentButton paypalButton" 
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <div className="buttonLoading">
                    <div className="loadingSpinner"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <span>Continuar a PayPal</span>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="securityInfo">
          <div className="securityIcon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1L2 3V7.09C2 10.14 4.41 13.23 8 14C11.59 13.23 14 10.14 14 7.09V3L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 7.5L7.5 9L10 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p>Todos los pagos son procesados de forma segura y encriptada.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
