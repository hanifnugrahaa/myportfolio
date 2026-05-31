import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeBackground.css';

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#070707', 3, 10);
    
    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 5. Icosahedron (Floating Mesh)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    // 6. Particles
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particleCount * 3);
    for(let i=0; i < particleCount * 3; i++) {
      particlesPositions[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true
    });
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 7. Mouse tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 8. Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;

    const animate = () => {
      const t = clock.getElapsedTime();

      // Icosahedron continuous rotation (faster)
      icosahedron.rotation.x = t * 0.2;
      icosahedron.rotation.y = t * 0.3;

      // Icosahedron Parallax and Floating effect
      targetX = mouseX * 2;
      targetY = mouseY * 2;
      
      // Interpolate towards target X
      icosahedron.position.x += (targetX - icosahedron.position.x) * 0.05;
      
      // Interpolate towards target Y + floating offset
      const floatingY = targetY + Math.sin(t * 2) * 0.3;
      icosahedron.position.y += (floatingY - icosahedron.position.y) * 0.05;

      // Particles continuous rotation (faster)
      particleSystem.rotation.y = t * 0.15;
      particleSystem.rotation.x = t * 0.1;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 10. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="three-background-container" />;
};

export default ThreeBackground;
