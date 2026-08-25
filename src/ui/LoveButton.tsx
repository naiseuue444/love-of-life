import { useState } from 'react';
import { createPortal } from 'react-dom';
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

  // Calculate base URL cleanly for localhost & GitHub Pages
  const metaEnv = (import.meta as unknown as { env?: { BASE_URL?: string } }).env;
  const rawBase = metaEnv?.BASE_URL || './';
  const baseUrl = rawBase.endsWith('/') ? rawBase : rawBase + '/';
  const loveProjectUrl = `${baseUrl}loveproject/index.html`;

  const handleOpen = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return createPortal(
    <>
      {/* Heart Peach Button - Bottom Center on Mobile, Bottom Left on Desktop */}
      <div
        style={{
          position: 'fixed',
          bottom: isMobile ? '25px' : '30px',
          left: isMobile ? '50%' : '85px',
          transform: isMobile ? 'translateX(-50%)' : 'none',
          zIndex: 999999,
          pointerEvents: 'auto',
        }}
      >
        <button
          type="button"
          onClick={handleOpen}
          onTouchEnd={handleOpen}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: isMobile ? '12px 22px' : '14px 26px',
            fontSize: isMobile ? '15px' : '17px',
            fontWeight: 700,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(255, 117, 140, 0.7), 0 0 14px rgba(255, 126, 179, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            pointerEvents: 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = isMobile ? 'scale(1.05)' : 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 117, 140, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 117, 140, 0.7)';
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000000,
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
          }}
        >
          {/* Embedded LoveProject Webpage - full screen, no extra close button */}
          <iframe
            src={loveProjectUrl}
            title="Love Project"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </div>
      )}
    </>,
    document.body
  );
}
