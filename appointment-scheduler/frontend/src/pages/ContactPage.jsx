import React from "react";
import "./ContactPage.css";
import Navbar from "./Navbar";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Twitch,
} from "lucide-react";

const ContactPage = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      <Navbar
        navigate={navigate}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <div class="contactContainer">
        <div class="contactHeader">
          <h1>Contáctanos</h1>
          <p>
            Estamos aquí para ayudarte. Envíanos tu mensaje y te responderemos
            lo antes posible.
          </p>
        </div>

        <div class="contactGrid">
          <div class="contactInfo">
            <h2>Información de contacto</h2>

            <div class="contactInfoItem">
              <div class="contactInfoIcon">
                <MapPin size={20} color="#10b981" />
              </div>
              <div class="contactInfoContent">
                <div class="contactInfoTitle">Dirección</div>
                <div class="contactInfoText">
                  Av. Principal 123, Ciudad, País
                </div>
              </div>
            </div>

            <div class="contactInfoItem">
              <div class="contactInfoIcon">
                <Phone size={20} color="#10b981" />
              </div>
              <div class="contactInfoContent">
                <div class="contactInfoTitle">Teléfono</div>
                <div class="contactInfoText">+1 234 567 8900</div>
              </div>
            </div>

            <div class="contactInfoItem">
              <div class="contactInfoIcon">
                <Mail size={20} color="#10b981" />
              </div>
              <div class="contactInfoContent">
                <div class="contactInfoTitle">Email</div>
                <div class="contactInfoText">info@tuempresa.com</div>
              </div>
            </div>

            <div class="contactInfoItem">
              <div class="contactInfoIcon">
                <Clock size={20} color="#10b981" />
              </div>
              <div class="contactInfoContent">
                <div class="contactInfoTitle">Horario de atención</div>
                <div class="contactInfoText">Lunes a Viernes: 9AM - 6PM</div>
              </div>
            </div>

            <div class="socialLinks">
              <a href="#" class="socialLink">
                <Facebook size={20} color="#10b981" />
              </a>
              <a href="#" class="socialLink">
                <Twitter size={20} color="#10b981" />
              </a>
              <a href="#" class="socialLink">
                <Instagram size={20} color="#10b981" />
              </a>
              <a href="#" class="socialLink">
                <Linkedin size={20} color="#10b981" />
              </a>
            </div>
          </div>

          <div class="contactForm">
            <h2>Envíanos un mensaje</h2>

            <div class="formGrid">
              <div class="formField">
                <label for="name">Nombre</label>
                <input type="text" id="name" placeholder="Tu nombre" />
              </div>

              <div class="formField">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Tu email" />
              </div>

              <div class="formField">
                <label for="phone">Teléfono</label>
                <input type="tel" id="phone" placeholder="Tu teléfono" />
              </div>

              <div class="formField">
                <label for="subject">Asunto</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Asunto del mensaje"
                />
              </div>

              <div class="formField full">
                <label for="message">Mensaje</label>
                <textarea
                  id="message"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
            </div>

            <label class="checkbox">
              <input type="checkbox" id="privacy" />
              <span>He leído y acepto la política de privacidad</span>
            </label>

            <button type="submit">
              Enviar mensaje
              <span class="submitIcon">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
