import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);

  // Configurar el autoplay
  useEffect(() => {
    const play = () => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };
    
    autoPlayRef.current = play;
    
    const interval = setInterval(() => {
      autoPlayRef.current();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  // Manejar la transición
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };
  
  // Navegación manual
  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };
  
  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  
  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <div className="carousel-container">
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`carousel-slide ${index === currentIndex ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
            style={{transform: `translateX(${100 * (index - currentIndex)}%)`}}
            onTransitionEnd={handleTransitionEnd}
          >
            <img src={image.src} alt={image.alt || `Slide ${index + 1}`} />
            <div className="carousel-caption">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-control prev" onClick={prevSlide}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <button className="carousel-control next" onClick={nextSlide}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button 
            key={index} 
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`} 
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;