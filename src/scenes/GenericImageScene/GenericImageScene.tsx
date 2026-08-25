import { useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { IMAGE_SCENE, GLOBAL, SCENE_MANAGER } from "../../config/config";
import { gsap } from "gsap";
import { useSceneStore } from "../../core/SceneManager";
import { createNavigationAnimation } from "../../utils/navigationAnimation";
import { useNavigation } from "../../hooks/useNavigation";
import { useMotionBlurComposer } from "../../hooks/usePostProcessing";
import { setupZoomCamera } from "../../utils/setupZoomCamera";
import { useMobile } from "../../contexts/MobileContext";
import { Mesh, MeshBasicMaterial, PerspectiveCamera, TextureLoader, SRGBColorSpace } from "three";

interface GenericImageSceneProps {
  sceneKey: string;
}

export function GenericImageScene({ sceneKey }: GenericImageSceneProps) {
  const { viewport, camera } = useThree() as { viewport: any, camera: PerspectiveCamera };

  const {
    currentScene,
    zoomDirection,
    getZoomOutCameraData, setZoomOutCameraData,
    endTransition
  } = useSceneStore();

  const sceneVisible = currentScene === sceneKey;
  const { isMobile } = useMobile();

  const imagePlaneRef = useRef<Mesh>(null!);
  const texturesObj = SCENE_MANAGER.SCENE_ASSETS.textures as Record<string, Record<string, string>>;
  const texturePath = texturesObj[sceneKey]?.[sceneKey] || SCENE_MANAGER.SCENE_ASSETS.textures.district.district;
  const imageTexture = useLoader(TextureLoader, texturePath);
  imageTexture.colorSpace = SRGBColorSpace;

  const imagePlanePosition = IMAGE_SCENE.IMAGE_PLANE_POSITION.clone();

  function zoomInFunction(backwards: boolean = false) {
    setupZoomCamera(camera, sceneKey, backwards, {
      getZoomOutCameraData,
      setZoomOutCameraData,
      endTransition
    });

    if (backwards) {
      imageTexture.offset.set(0, 0);
      imageTexture.repeat.set(1, 1);
    }

    const imagesDataObj = IMAGE_SCENE.IMAGES_DATA as Record<string, { width: number; height: number; targetRepeat: { x: number; y: number }; targetCoords: { x: number; y: number } }>;
    const imageData = imagesDataObj[sceneKey] || IMAGE_SCENE.IMAGES_DATA.district;

    const targetNormX = imageData.targetCoords.x / imageData.width;
    const targetNormY = imageData.targetCoords.y / imageData.height;
    const repeatX = imageData.targetRepeat.x;
    const repeatY = imageData.targetRepeat.y;

    const targetOffsetX = Math.max(0, Math.min(1 - repeatX, targetNormX - repeatX / 2));
    const targetOffsetY = Math.max(0, Math.min(1 - repeatY, (1 - targetNormY) - repeatY / 2));

    const tl = gsap.timeline({
      onStart: () => {
        camera.position.set(imagePlanePosition.x, imagePlanePosition.y, imagePlanePosition.z + 10);
        camera.lookAt(imagePlanePosition.x, imagePlanePosition.y, imagePlanePosition.z);

        const targetFov = isMobile ? GLOBAL.INITIAL_CAMERA_MOBILE_FOV : GLOBAL.INITIAL_CAMERA_DESKTOP_FOV;
        camera.fov = targetFov;

        if (imagePlaneRef.current) {
          const material = imagePlaneRef.current.material as MeshBasicMaterial;
          material.map = imageTexture;
          material.needsUpdate = true;
        }

        camera.updateProjectionMatrix();
      }
    });

    const isGirlScene = sceneKey === 'girl';
    const finalTargetOffsetX = isGirlScene ? 0 : targetOffsetX;
    const finalTargetOffsetY = isGirlScene ? 0 : targetOffsetY;
    const finalRepeatX = isGirlScene ? 1 : repeatX;
    const finalRepeatY = isGirlScene ? 1 : repeatY;

    tl.to(imageTexture.offset, {
      duration: 1,
      x: finalTargetOffsetX,
      y: finalTargetOffsetY
    }).to(imageTexture.repeat, {
      duration: 1,
      x: finalRepeatX,
      y: finalRepeatY
    }, "<");

    const animation = createNavigationAnimation({
      sceneKey: sceneKey,
      timeline: tl,
      onComplete: endTransition,
      backwards: backwards,
    });

    return () => {
      animation.cleanup();
    };
  }

  useNavigation({
    sceneKey: sceneKey,
    zoomFunction: zoomInFunction,
    isVisible: sceneVisible,
    zoomDirection: zoomDirection,
    getZoomOutCameraData: getZoomOutCameraData
  });

  const getImagePlaneSize = () => {
    const imagesDataObj = IMAGE_SCENE.IMAGES_DATA as Record<string, { width: number; height: number }>;
    const imageData = imagesDataObj[sceneKey] || IMAGE_SCENE.IMAGES_DATA.district;
    const imageAspect = imageData.width / imageData.height;

    if (isMobile) {
      return {
        width: window.innerWidth * camera.aspect * imageAspect / 10,
        height: window.innerHeight * camera.aspect / 15,
      };
    }

    return {
      width: viewport.width,
      height: viewport.height,
    };
  };

  const planeSize = getImagePlaneSize();

  return (
    <group>
      <mesh ref={imagePlaneRef} position={imagePlanePosition}>
        <planeGeometry args={[planeSize.width, planeSize.height]} />
        <meshBasicMaterial map={imageTexture} />
      </mesh>
    </group>
  );
}

export default GenericImageScene;
