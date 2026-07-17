import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import earthModelUrl from '../../assets/3d/earth_converted.glb?url';

const CITIES_DATA = [
  { name: 'Pune', lat: 18.5204, lon: 73.8567, description: 'Pune Real Estate Hub — Premium properties across all major localities' },
];

export default function InteractiveGlobe({ onSelectCity, activeCity }) {
  const containerRef = useRef(null);
  const loadingRef = useRef(null);
  const activeCityRef = useRef(activeCity);
  const targetRotationRef = useRef({ x: Math.PI / 8, y: -Math.PI / 2.3 });

  // Keep refs up to date to prevent destroying scene on changes
  useEffect(() => {
    activeCityRef.current = activeCity;
    if (activeCity) {
      let city = CITIES_DATA.find(c => c.name === activeCity);
      if (!city) {
        // If it is a Pune locality, fallback to Pune coordinates
        const puneLocalities = ['Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner', 'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road', 'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate', 'Katraj', 'Prabhat Road'];
        if (puneLocalities.some(loc => loc.toLowerCase() === activeCity.toLowerCase())) {
          city = CITIES_DATA.find(c => c.name === 'Pune');
        }
      }
      if (city) {
        // Compute target rotation angles to align selected city with camera
        const phi = (90 - city.lat) * (Math.PI / 180);
        const theta = (city.lon + 180) * (Math.PI / 180);
        
        targetRotationRef.current.x = phi - Math.PI / 2;
        targetRotationRef.current.y = -theta + Math.PI / 2.35;
      }
    }
  }, [activeCity]);


  useEffect(() => {
    if (!containerRef.current) return;

    // Direct DOM cleanup to prevent double-render HMR duplication issues
    containerRef.current.innerHTML = '';
    if (loadingRef.current) {
      loadingRef.current.style.display = 'flex';
    }

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 450;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.z = 190;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(120, 150, 80);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xD4AF37, 1.2);
    dirLight2.position.set(-120, -100, -50);
    scene.add(dirLight2);

    // Headlight point light moving with the camera for glossy details
    const headlight = new THREE.PointLight(0xffffff, 1.8, 500);
    camera.add(headlight);
    scene.add(camera);

    // --- Globe and Model Groups ---
    const globeRadius = 55;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);


    // Load Converted Earth 3D model (Standard metallic-roughness materials)
    const loader = new GLTFLoader();
    let earthModel = null;

    loader.load(
      earthModelUrl + '?v=2', // Force browser cache-busting
      (gltf) => {
        earthModel = gltf.scene;

        // Auto-scale the GLB model using bounding box to match exactly our globeRadius (55)
        const box = new THREE.Box3().setFromObject(earthModel);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Scale safety fallback to prevent Infinity / NaN scaling crashes
        const scale = (maxDim > 0.0001 && isFinite(maxDim)) ? (globeRadius * 2) / maxDim : 0.85;
        earthModel.scale.set(scale, scale, scale);

        // Center pivot offset safety check
        if (maxDim > 0.0001 && isFinite(maxDim)) {
          const center = box.getCenter(new THREE.Vector3());
          earthModel.position.sub(center.multiplyScalar(scale));
        }

        // Adjust materials for high-contrast luxury look with multi-material safety
        earthModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                // Let the model's realistic textures load and look gorgeous
                mat.roughness = Math.min(mat.roughness || 0.5, 0.6);
                if (mat.map) {
                  mat.map.anisotropy = 4;
                }
              });
            }
          }
        });

        globeGroup.add(earthModel);
        if (loadingRef.current) {
          loadingRef.current.style.display = 'none';
        }
      },
      undefined,
      (error) => {
        console.error('Error loading earth_converted.glb model:', error);
        // Fallback procedural sphere if load fails
        const fallbackGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: 0xD4AF37, // Golden wireframe
          roughness: 0.7,
          wireframe: true,
          transparent: true,
          opacity: 0.15
        });
        const fallbackSphere = new THREE.Mesh(fallbackGeo, fallbackMat);
        globeGroup.add(fallbackSphere);
        
        if (loadingRef.current) {
          loadingRef.current.style.display = 'none';
        }
      }
    );

    // Atmosphere grid
    const gridGeometry = new THREE.SphereGeometry(globeRadius + 0.5, 24, 24);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0xD4AF37,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const globeGrid = new THREE.Mesh(gridGeometry, gridMaterial);
    globeGroup.add(globeGrid);



    // --- Interactive Drag Controls ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const dragVelocity = { x: 0, y: 0 };

    const handlePointerDown = (event) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handlePointerMove = (event) => {
      document.body.style.cursor = isDragging ? 'grabbing' : 'default';

      // Perform rotation update on drag
      if (!isDragging) return;
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      // Speed scale factor
      const dragFactor = 0.007;
      targetRotationRef.current.y += deltaMove.x * dragFactor;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, targetRotationRef.current.x + deltaMove.y * dragFactor)
      );

      dragVelocity.x = deltaMove.x * dragFactor;
      dragVelocity.y = deltaMove.y * dragFactor;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Initial positioning facing activeCity
    if (activeCityRef.current) {
      let city = CITIES_DATA.find(c => c.name === activeCityRef.current);
      if (!city) {
        const puneLocalities = ['Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner', 'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road', 'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate', 'Katraj', 'Prabhat Road'];
        if (puneLocalities.some(loc => loc.toLowerCase() === activeCityRef.current.toLowerCase())) {
          city = CITIES_DATA.find(c => c.name === 'Pune');
        }
      }
      if (city) {
        const phi = (90 - city.lat) * (Math.PI / 180);
        const theta = (city.lon + 180) * (Math.PI / 180);
        targetRotationRef.current.x = phi - Math.PI / 2;
        targetRotationRef.current.y = -theta + Math.PI / 2.35;
        globeGroup.rotation.x = targetRotationRef.current.x;
        globeGroup.rotation.y = targetRotationRef.current.y;
      }
    }

    // --- Viewport Visibility Observer ---
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // --- Animation loop ---
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return; // Skip CPU/GPU calculation and frame renders when not visible!

      // Lerp smooth rotations
      globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.05;
      globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.05;

      // Slow drift rotation when idle
      if (!isDragging) {
        targetRotationRef.current.y += 0.0012;
      }

      // Drag inertia decay
      if (!isDragging) {
        targetRotationRef.current.y += dragVelocity.x;
        targetRotationRef.current.x = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, targetRotationRef.current.x + dragVelocity.y)
        );
        dragVelocity.x *= 0.92;
        dragVelocity.y *= 0.92;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (containerRef.current && renderer.domElement) {
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectCity]);

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center overflow-visible">
      {/* Background radial gold glow */}
      <div 
        className="absolute w-[260px] h-[260px] rounded-full pointer-events-none z-0 blur-[70px] opacity-35"
        style={{
          background: 'radial-gradient(circle, #D4AF37 0%, #0A2B4E 75%, transparent 100%)',
        }}
      />
      
      {/* ThreeJS Container */}
      <div ref={containerRef} className="w-full h-full three-container relative z-10" />

      {/* Loading state indicator */}
      <div ref={loadingRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-transparent gap-3">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold tracking-widest uppercase text-gold">Loading 3D Earth...</p>
      </div>
    </div>
  );
}
