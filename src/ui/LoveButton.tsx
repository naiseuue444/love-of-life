import { useState } from 'react';
import { useSceneStore } from '../core/SceneManager';
import { useMobile } from '../contexts/MobileContext';

export default function LoveButton() {
  const { currentScene, setFullscreenActive } = useSceneStore();
  const { isMobile } = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Show button when on the final "girl" scene (The Golden Scarf)
  if (currentScene !== 'girl') {
    return null;
  }

  const handleOpen = () => {
    setIsOpen(true);
    setFullscreenActive(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFullscreenActive(false);
  };

  return (
    <>
      {/* Heart Peach Button in Bottom Left */}
      <div
        style={{
          position: 'fixed',
          bottom: isMobile ? '20px' : '30px',
          left: isMobile ? '20px' : '35px',
          zIndex: 1000,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleOpen}
          style={{
            background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: isMobile ? '12px 20px' : '15px 28px',
            fontSize: isMobile ? '15px' : '18px',
            fontWeight: 700,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 6px 22px rgba(255, 117, 140, 0.7), 0 0 15px rgba(255, 126, 179, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(255, 117, 140, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(255, 117, 140, 0.7)';
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
          {/* Subtle back button to dismiss if needed */}
          <button
            onClick={handleClose}
            style={{
              position: 'fixed',
              top: '15px',
              right: '20px',
              zIndex: 10000,
              background: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 117, 140, 0.6)',
              opacity: 0.85,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          >
            ← Back
          </button>

          {/* Embedded LoveProject Webpage with Relative URL */}
          <iframe
            src="./loveproject/index.html"
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
