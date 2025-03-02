import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2rem;
`;

const ErrorOverlay = styled(LoadingOverlay)`
  background: rgba(220, 53, 69, 0.9);
`;

const ControlsInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.3s;
  display: flex;
  flex-direction: column;

  &:hover {
    opacity: 1;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  line-height: 0.5;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

interface ImageViewer360Props {
  objPath: string;
}

const ImageViewer360: React.FC<ImageViewer360Props> = ({ objPath }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isMouseDown = useRef(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const lonLatRef = useRef({ lon: 0, lat: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Initializing viewer with path:', objPath);

      // Setup scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Setup camera
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 0);
      cameraRef.current = camera;

      // Setup renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create skybox geometry
      const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);

      // Define the file names for each face of the skybox
      const fileNames = [
        'posx.jpg',  // positive x
        'negx.jpg',  // negative x
        'posy.jpg',  // positive y
        'negy.jpg',  // negative y
        'posz.jpg',  // positive z
        'negz.jpg'   // negative z
      ];

      // Create materials array for the skybox
      const materialArray = fileNames.map(fileName => {
        const texture = new THREE.TextureLoader().load(
          `${objPath}${fileName}`,
          () => {
            console.log(`Loaded texture: ${fileName}`);
          },
          undefined,
          (err) => {
            console.error(`Error loading texture ${fileName}:`, err);
            setError(`Failed to load texture: ${fileName}`);
          }
        );
        texture.colorSpace = THREE.SRGBColorSpace;
        return new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide
        });
      });

      const skybox = new THREE.Mesh(skyboxGeo, materialArray);
      scene.add(skybox);

      // Set initial camera rotation to 180 degrees to fix orientation
      camera.rotation.y = Math.PI;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      animate();

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
        
        const camera = cameraRef.current;
        const renderer = rendererRef.current;
        
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      // Mouse controls for looking around
      const handleMouseMove = (e: MouseEvent) => {
        if (!isMouseDown.current || !cameraRef.current) return;

        const camera = cameraRef.current;
        const deltaX = e.clientX - mousePosition.current.x;
        const deltaY = e.clientY - mousePosition.current.y;

        // Update rotation with improved sensitivity
        lonLatRef.current.lon -= deltaX * 0.3; // Reverted back to original
        lonLatRef.current.lat = Math.max(-89, Math.min(89, lonLatRef.current.lat + deltaY * 0.3));

        const phi = THREE.MathUtils.degToRad(90 - lonLatRef.current.lat);
        const theta = THREE.MathUtils.degToRad(lonLatRef.current.lon);

        const x = Math.sin(phi) * Math.cos(theta); // Reverted back to original
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta); // Reverted back to original

        camera.lookAt(new THREE.Vector3(x, y, z));

        mousePosition.current = { x: e.clientX, y: e.clientY };
      };

      const handleMouseDown = (e: MouseEvent) => {
        isMouseDown.current = true;
        mousePosition.current = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        isMouseDown.current = false;
      };

      // Touch controls
      const handleTouchMove = (e: TouchEvent) => {
        if (!isMouseDown.current || !cameraRef.current) return;
        
        // Prevent default behavior to stop page scrolling
        e.preventDefault();

        const camera = cameraRef.current;
        const deltaX = e.touches[0].clientX - mousePosition.current.x;
        const deltaY = e.touches[0].clientY - mousePosition.current.y;

        // Update rotation with improved sensitivity
        lonLatRef.current.lon -= deltaX * 0.3; 
        lonLatRef.current.lat = Math.max(-89, Math.min(89, lonLatRef.current.lat + deltaY * 0.3));

        const phi = THREE.MathUtils.degToRad(90 - lonLatRef.current.lat);
        const theta = THREE.MathUtils.degToRad(lonLatRef.current.lon);

        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        camera.lookAt(new THREE.Vector3(x, y, z));

        mousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };

      const handleTouchStart = (e: TouchEvent) => {
        // Prevent default to stop unwanted behaviors
        e.preventDefault();
        
        isMouseDown.current = true;
        mousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };

      const handleTouchEnd = () => {
        isMouseDown.current = false;
      };

      // Add event listeners
      containerRef.current.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchmove', handleTouchMove);

      // Set loading to false after a short delay to ensure textures are loaded
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        containerRef.current?.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
        containerRef.current?.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        
        if (rendererRef.current?.domElement) {
          rendererRef.current.domElement.remove();
        }
      };
    } catch (err) {
      console.error('Error setting up ImageViewer360:', err);
      setError(typeof err === 'string' ? err : 'Failed to initialize viewer');
      setIsLoading(false);
    }
  }, [objPath]);

  return (
    <ViewerContainer ref={containerRef}>
      {isLoading && (
        <LoadingOverlay>
          <div>Loading 360° View...</div>
        </LoadingOverlay>
      )}
      
      {error && (
        <ErrorOverlay>
          <div>Error: {error}</div>
        </ErrorOverlay>
      )}
      
      {!isLoading && !error && showControls && (
        <ControlsInfo>
          <CloseButton onClick={() => setShowControls(false)}>×</CloseButton>
          <p>Click and drag to look around</p>
          <p>Use the map below to place your guess</p>
        </ControlsInfo>
      )}
    </ViewerContainer>
  );
};

export default ImageViewer360; 