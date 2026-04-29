import React, { useEffect, useRef, useState } from 'react';

const CONSTANTS = ['π', 'e', 'φ', 'γ', '0x1A', '0xFF', '∑', '∫', '∞', '0b1010'];
const PARTICLE_COUNT = 80;

export default function NexusBackground({ children }) {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isOrganized, setIsOrganized] = useState(false);
  const requestRef = useRef();

  useEffect(() => {
    // Initialize random particles
    const initParticles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      char: CONSTANTS[Math.floor(Math.random() * CONSTANTS.length)],
      x: Math.random() * 100, // vw
      y: Math.random() * 100, // vh
      z: (Math.random() * 1000) - 500, // random depth from -500 to 500
      speedX: (Math.random() - 0.5) * 0.05,
      speedY: (Math.random() - 0.5) * 0.05,
      speedZ: (Math.random() - 0.5) * 0.5
    }));
    setParticles(initParticles);
  }, []);

  useEffect(() => {
    // Float animation using requestAnimationFrame
    const updateParticles = () => {
      if (!isOrganized) {
        setParticles(prev => prev.map(p => ({
          ...p,
          x: (p.x + p.speedX + 100) % 100,
          y: (p.y + p.speedY + 100) % 100,
          z: p.z > 500 ? -500 : p.z < -500 ? 500 : p.z + p.speedZ
        })));
      }
      requestRef.current = requestAnimationFrame(updateParticles);
    };
    requestRef.current = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isOrganized]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize mouse pos from -1 to 1
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;

    // Apply tilt to all 3D cards
    const cards = containerRef.current.querySelectorAll('.nexus-card-3d');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;
      
      const angleX = (clientY - cardY) / 20; // Reverse rotation for Y
      const angleY = -(clientX - cardX) / 20;
      
      // Limit angles
      const rotX = Math.max(-15, Math.min(15, angleX));
      const rotY = Math.max(-15, Math.min(15, angleY));
      
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
  };

  const handleClick = () => {
    setIsOrganized(true);
    // Organize into a grid
    setParticles(prev => prev.map((p, i) => ({
      ...p,
      x: 10 + (i % 10) * 8, // Grid layout
      y: 10 + Math.floor(i / 10) * 10,
      z: 0 // Flat plane
    })));

    // Resume chaos after ripple effect ends
    setTimeout(() => {
      setIsOrganized(false);
      setParticles(prev => prev.map(p => ({
        ...p,
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        speedZ: (Math.random() - 0.5) * 0.5
      })));
    }, 2000);
  };

  const handleMouseLeave = () => {
    const cards = containerRef.current.querySelectorAll('.nexus-card-3d');
    cards.forEach(card => {
      card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
  };

  return (
    <div 
      className="nexus-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gravity field background particles */}
      {particles.map(p => (
        <span 
          key={p.id}
          className="nexus-particle"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            transform: `translateZ(${p.z}px)`,
            filter: `blur(${Math.max(0, p.z / 100)}px)` // Bokeh effect
          }}
        >
          {p.char}
        </span>
      ))}

      {/* Children context with z-index to stay above particles */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
