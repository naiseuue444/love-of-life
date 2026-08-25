import { useEffect, useState } from 'react';
import { useSceneStore } from '../core/SceneManager';
import styles from './ZoomProgressIndicator.module.css';
import { SCENE_MANAGER } from '../config/config';
import { useMobile } from '../contexts/MobileContext';

const SCENE_EMOJIS: Record<string, string> = {
  continent: '🇮🇳',
  city: '🏙️',
  district: '🏫',
  college: '🏛️',
  class: '🚪',
  bench: '🪑',
  girl: '👸',
  end: '👸',
};

const ZoomProgressIndicator = () => {
  const { zoomDirection, currentScene } = useSceneStore();

  const [zoomProgress, setZoomProgress] = useState(0);
  const [lastScene, setLastScene] = useState(currentScene);

  const { isMobile } = useMobile();

  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent<{ progress: number }>) => {
      if (event.detail && typeof event.detail.progress === 'number') {
        setZoomProgress(event.detail.progress);
      }
    };

    window.addEventListener('zoom-progress-update', handleProgressUpdate as EventListener);
    return () => window.removeEventListener('zoom-progress-update', handleProgressUpdate as EventListener);
  }, []);

  useEffect(() => {
    setZoomProgress(['in', null].includes(zoomDirection) ? 0 : 1);
  }, [currentScene]);

  const sceneOrder = SCENE_MANAGER.SCENE_ORDER.concat(['end']);

  const calculateOverallProgress = () => {
    const sceneIndex = sceneOrder.indexOf(currentScene);
    if (sceneIndex === -1) return 0;

    const segmentSize = 100 / (sceneOrder.length - 1);
    const baseProgress = sceneIndex * segmentSize;

    let currentSceneProgress = 0;

    if (lastScene !== currentScene) {
      setLastScene(currentScene);
      currentSceneProgress = ['in', null].includes(zoomDirection) ? 0 : 1;
      setZoomProgress(currentSceneProgress);
    } else {
      currentSceneProgress = zoomProgress * segmentSize;
    }

    return baseProgress + currentSceneProgress;
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className={`${styles['zoom-progress-container']} ${isMobile ? styles['mobile'] : ''}`}>
      <div className={styles['zoom-progress-line']}></div>

      {sceneOrder.map((scene, index) => {
        const position = (index / (sceneOrder.length - 1)) * 100;
        const isActive = sceneOrder.indexOf(currentScene) >= index;
        const iconPath = SCENE_MANAGER.SCENE_ASSETS.icons.zoomProgressIndicator[scene as keyof typeof SCENE_MANAGER.SCENE_ASSETS.icons.zoomProgressIndicator];
        const emoji = SCENE_EMOJIS[scene];
        const isEmojiStage = index >= 5;

        return (
          <div
            key={scene}
            className={`${styles['scene-marker']} ${isActive ? styles['active'] : ''}`}
            style={{ 'top': `${position}%` }}
          >
            {isEmojiStage && emoji ? (
              <span style={{ fontSize: '15px' }}>{emoji}</span>
            ) : iconPath ? (
              <div
                className={styles['marker-icon']}
                style={{ backgroundImage: `url(${iconPath})` }}
              />
            ) : (
              <span style={{ fontSize: '15px' }}>{emoji || '📌'}</span>
            )}
          </div>
        );
      })}

      {/* Travelling Astronaut Indicator */}
      <div
        className={styles['zoom-progress-indicator']}
        style={{ 'top': `${overallProgress}%` }}
      >
        <img
          src={SCENE_MANAGER.SCENE_ASSETS.icons.zoomProgressIndicator.astronaut}
          alt="Current progress"
          className={styles['indicator-icon']}
        />
      </div>
    </div>
  );
};

export default ZoomProgressIndicator;