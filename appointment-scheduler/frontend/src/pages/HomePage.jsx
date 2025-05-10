import React, { useState, useEffect } from 'react';
import medicoImage from '../imgs/medicos.jpg';
import './HomePage.css'; // Importa el CSS como un módulo

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // SVG Icons as components
  const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"></path>
      <path d="M12 5l7 7-7 7"></path>
    </svg>
  );
  
  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
  
  const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
  
  const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
  
  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
  
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  // Features data array for better scalability
  const features = [
    {
      icon: <CalendarIcon />,
      title: "Smart Scheduling",
      description: "Intelligent calendar system that optimizes your availability and prevents double-booking."
    },
    {
      icon: <ClockIcon />,
      title: "Time Management",
      description: "Reduce no-shows with automated reminders and follow-up notifications."
    },
    {
      icon: <UsersIcon />,
      title: "Client Management",
      description: "Store and access client information securely in one centralized location."
    }
  ];

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbarContent">
          <div className="logo">
            <div className="logoBox">H</div>
            <span className="logoText">HealPoint</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className={windowWidth > 768 ? "navLinks" : "navLinks d-none"}>
            <button className="navLink">Features</button>
            <button className="navLink">Pricing</button>
            <button className="navLink">About</button>
          </div>
          
          {/* Auth Buttons */}
          <div className={windowWidth > 768 ? "authButtons" : "authButtons d-none"}>
            <button className="signInButton">Login</button>
            <button 
              className="signUpButton"
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0ea271'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Sign Up
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={windowWidth <= 768 ? "mobileMenuButton" : "mobileMenuButton d-none"}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {menuOpen && windowWidth <= 768 && (
          <div className="mobileNavLinks">
            <button className="navLink mobileNavLink">Features</button>
            <button className="navLink mobileNavLink">Pricing</button>
            <button className="navLink mobileNavLink">About</button>
            <button className="signInButton mobileNavLink">Login</button>
            <button className="signUpButton mobileSignUpButton">
              Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1 className="heroTitle">Appointment Management, Simplified</h1>
        <p className="heroSubtitle">
          HealPoint streamlines your appointment workflow with a modern, intuitive platform 
          designed for healthcare professionals and service providers.
        </p>
        
        <div className={windowWidth > 640 ? "ctaButtons" : "ctaButtons column-mobile"}>
          <button 
            className={windowWidth > 640 ? "primaryButton" : "primaryButton full-width"}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0ea271';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get Started <ArrowRightIcon />
          </button>
          <button 
            className={windowWidth > 640 ? "secondaryButton" : "secondaryButton full-width"}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Watch Demo
          </button>
        </div>
        
        <img 
          src={medicoImage}
          alt="HealPoint dashboard preview" 
          className="dashboardPreview"
          onMouseOver={(e) => {
            if (windowWidth > 768) {
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseOut={(e) => {
            if (windowWidth > 768) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        />
      </div>

      {/* Features Section */}
      <div className="featuresSection">
        <div className="featuresContent">
          <h2 className="sectionTitle">Why Choose HealPoint</h2>
          <p className="sectionDescription">
            Designed with healthcare professionals in mind, our platform offers everything you need to streamline your appointment workflow.
          </p>
          
          <div className="featuresGrid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="featureCard"
                onMouseOver={(e) => {
                  if (windowWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (windowWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }
                }}
              >
                <div className="featureIcon">
                  {feature.icon}
                </div>
                <h3 className="featureTitle">{feature.title}</h3>
                <p className="featureDescription">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className={windowWidth > 640 ? "footerContent" : "footerContent column-mobile"}>
          <div className="footerLogo">
            <div className="footerLogoBox">H</div>
            <span className="footerLogoText">HealPoint</span>
          </div>
          <p className="copyright">© 2025 HealPoint. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;