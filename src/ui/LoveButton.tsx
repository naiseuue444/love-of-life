import { useState } from 'react';
import { useSceneStore } from '../core/SceneManager';
import { useMobile } from '../contexts/MobileContext';

export default function LoveButton() {
  const { currentScene } = useSceneStore();
  const { isMobile } = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Show button when on the final "girl" scene (The Golden Scarf)
  if (currentScene !== 'girl') {
    return null;
  }

  return (
    <>
      {/* Heart Peach Button in Upper Left */}
      <div
        style={{
          position: 'fixed',
          top: isMobile ? '15px' : '25px',
          left: isMobile ? '15px' : '25px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: isMobile ? '10px 18px' : '14px 26px',
            fontSize: isMobile ? '14px' : '17px',
            fontWeight: 700,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(255, 117, 140, 0.6), 0 0 12px rgba(255, 126, 179, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 117, 140, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 117, 140, 0.6)';
          }}
        >
          <span style={{ fontSize: '1.2em' }}>❤️</span>
          <span>click this my love</span>
        </button>
      </div>

      {/* Full-screen Romantic Modal when button clicked */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#ffe',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Embedded LoveProject Webpage */}
          <iframe
            src="/loveproject/index.html"
            title="Love Project"
            style={{
              width: '100vw',
              height: '100vh',
              border: 'none',
            }}
          />
        </div>
      )}
    </>
  );
}
