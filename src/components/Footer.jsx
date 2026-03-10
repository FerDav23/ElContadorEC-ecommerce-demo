import React from 'react';
import logoSmall from '../assets/logo-small.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaAngleRight } from 'react-icons/fa';
import { IS_DEMO_MODE } from '../config/demo.js';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top-wave"></div>
      <div className="footer-content">
        <div className="footer-column footer-about">
          <div className="footer-logo">
            <img src={logoSmall} alt="El Contador EC Logo" className="logo-small" />
          </div>
          <p className="footer-description">
            We provide professional, tailored accounting services for businesses and individuals. Our mission is to simplify accounting with efficient, reliable solutions.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        
        <div className="footer-column footer-links">
          <h3 className="footer-title">Quick Links</h3>
          <ul>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/">Home</a>
            </li>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/nosotros">About Us</a>
            </li>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/servicios">Services</a>
            </li>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/blog">Blog</a>
            </li>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/contacto">Contact</a>
            </li>
          </ul>
        </div>
        
        <div className="footer-column footer-services">
          <h3 className="footer-title">Our Services</h3>
          <ul>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/servicios/contabilidad">Contabilidad Empresarial</a>
            </li>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/servicios/declaraciones">Declaraciones Tributarias</a>
            </li>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/servicios/asesoria">Asesoría Fiscal</a>
            </li>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/servicios/nomina">Gestión de Nómina</a>
            </li>
            <li>
              <FaAngleRight className="footer-icon" />
              <a href="/servicios/consultoria">Consultoría Financiera</a>
            </li>
          </ul>
        </div>
        
        <div className="footer-column footer-contact">
          <h3 className="footer-title">Contact Us</h3>
          <div className="contact-item">
            <FaMapMarkerAlt className="footer-icon" />
            <p>Av. Francisco de Orellana y Juan Tanca Marengo, Guayaquil, Ecuador</p>
          </div>
          <div className="contact-item">
            <FaPhone className="footer-icon" />
            <p>+593 98 765 4321</p>
          </div>
          <div className="contact-item">
            <FaEnvelope className="footer-icon" />
            <p>info@elcontadorec.com</p>
          </div>
          <div className="contact-item">
            <FaClock className="footer-icon" />
            <p>Lunes - Viernes: 8:30 AM - 5:30 PM</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        {IS_DEMO_MODE && <p className="footer-demo-notice">Demo version – for presentation only.</p>}
        <p>&copy; {currentYear} El Contador EC. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="/terminos">Terms and Conditions</a>
          <a href="/privacidad">Privacy Policy</a>
          <a href="/cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 