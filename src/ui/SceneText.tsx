import { useEffect, useRef, useState } from 'react';
import { useMobile } from '../contexts/MobileContext';
import { useSceneStore } from '../core/SceneManager';
import { SCENE_MANAGER } from '../config/config';

export interface SceneText {
  header: string;
  sub: string;
  backgroundColor?: string; // background color for the text container
}

function SceneTextComponent() {
  const { currentScene, sceneZoomed } = useSceneStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobile();

  // calculate responsive font sizes
  const headerSize = isMobile ? '32px' : '48px';
  const subSize = isMobile ? '18px' : '24px';
  const topPosition = isMobile ? '20px' : '30px';

  // get scene text based on current scene
  const getSceneText = () => {
    switch (currentScene) {
      case 'galaxy':
        return { header: 'Milky Way', sub: '“Let’s start somewhere in the universe…”' };
      case 'solarSystemApproach':
        return { header: 'Interstellar Space', sub: '“Among billions of stars, countless worlds, and endless possibilities…”' };
      case 'solarSystemRotation':
        return { header: 'Orion Arm', sub: '“Somewhere in this little corner of the Milky Way…”' };
      case 'earthApproach':
        return { header: 'Solar System', sub: '“There are billions of places I could have ended up…”' };
      case 'earth':
        return { header: 'Earth — The Blue Planet', sub: '“But somehow I was meant to be here.”' };
      case 'continent':
        return { header: 'India', sub: '“A country of more than a billion people…”' };
      case 'city':
        return { header: 'Hyderabad, Telangana', sub: '“And somehow our paths narrowed down to this one city.”' };
      case 'district':
        return { header: 'Narayana Junior College', sub: '“And then… to this place.”' };
      case 'college':
        return { header: 'The College Building', sub: '“A completely ordinary building… that was about to become a very important part of my story.”' };
      case 'class':
        return { header: 'Co-Spark door', sub: 'Where I fell in love' };
      case 'bench':
        return { header: 'First Bench — Middle Row', sub: '“There you were.”' };
      case 'girl':
        return { header: 'The Golden Scarf girl', sub: '“And somehow you became the most beautiful person in the room.”' };
      default:
        return null;
    }
  };
  const [localText, setLocalText] = useState<SceneText | null>(getSceneText());

  useEffect(() => {
    // remove text when last scene zoomed in (cant properly see the device's content)
    if (SCENE_MANAGER.SCENE_ORDER.indexOf(currentScene) === SCENE_MANAGER.SCENE_ORDER.length - 1 && sceneZoomed === 'in') {
      setLocalText(null);
      return
    }

    const sceneText = getSceneText();
    if (sceneText?.header == localText?.header && sceneText?.sub == localText?.sub) return;

    if (sceneText) {
      setLocalText(sceneText);
    } else if (localText) { // when parent clears overlayText, clear localText.
      setLocalText(null)
    }
  }, [currentScene, sceneZoomed]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: topPosition,
        left: 0,
        right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 1,
        backgroundColor: localText?.backgroundColor,
        padding: isMobile ? '0 15px' : '0',
      }}
    >
      <div style={{ fontFamily: 'Tektur-Medium', fontSize: headerSize, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
        {localText?.header}
      </div>
      <div style={{ fontFamily: 'Tektur-Regular', fontSize: subSize, color: '#f3e5ab', marginTop: '6px', textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontStyle: 'italic' }}>
        {localText?.sub}
      </div>
    </div>
  );
}

export default SceneTextComponent;