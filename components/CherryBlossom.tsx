"use client";

import { useEffect, useRef } from 'react';

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export default function CherryBlossom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petals = useRef<Petal[]>([]);
  const animationFrameId = useRef<number>();
  const lastTime = useRef<number>(0);

  // Initialize petals
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Create initial petals
    const createPetals = () => {
      const newPetals: Petal[] = [];
      const petalCount = Math.floor(window.innerWidth / 20); // Adjust density based on screen size
      
      for (let i = 0; i < petalCount; i++) {
        newPetals.push(createPetal(true));
      }
      
      return newPetals;
    };

    // Create a single petal
    const createPetal = (randomY: boolean = false): Petal => ({
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : -20,
      size: 10 + Math.random() * 15,
      speed: 0.5 + Math.random() * 2,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.5 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      opacity: 0.1 + Math.random() * 0.3, // Reduced opacity to make it less distracting
    });

    // Draw a single petal
    const drawPetal = (petal: Petal) => {
      if (!ctx) return;
      
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      
      // Draw petal shape (simple oval)
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size / 2);
      gradient.addColorStop(0, `hsla(350, 100%, 88%, ${petal.opacity * 0.7})`);
      gradient.addColorStop(1, `hsla(350, 100%, 78%, ${petal.opacity * 0.3})`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, petal.size * 0.6, petal.size, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add subtle highlight
      ctx.fillStyle = `hsla(0, 0%, 100%, ${petal.opacity * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(-petal.size * 0.2, -petal.size * 0.3, petal.size * 0.2, petal.size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    // Update petal positions
    const updatePetals = (deltaTime: number) => {
      const newPetals = [...petals.current];
      
      // Update existing petals
      for (let i = 0; i < newPetals.length; i++) {
        const petal = newPetals[i];
        
        // Move down
        petal.y += petal.speed * (deltaTime / 16);
        
        // Sway side to side
        petal.sway += petal.swaySpeed * 0.01;
        petal.x += Math.sin(petal.sway) * 0.5;
        
        // Rotate
        petal.rotation += petal.rotationSpeed;
        
        // Reset if off screen
        if (petal.y > canvas.height + 20) {
          newPetals[i] = createPetal();
        }
      }
      
      // Add new petals occasionally
      if (Math.random() < 0.02) {
        newPetals.push(createPetal());
      }
      
      // Remove excess petals
      while (newPetals.length > 100) {
        newPetals.shift();
      }
      
      petals.current = newPetals;
    };

    // Animation loop
    const animate = (timestamp: number) => {
      if (!lastTime.current) lastTime.current = timestamp;
      const deltaTime = timestamp - lastTime.current;
      lastTime.current = timestamp;
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw petals
      updatePetals(deltaTime);
      petals.current.forEach(drawPetal);
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Initial setup
    resizeCanvas();
    petals.current = createPetals();
    animationFrameId.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('resize', resizeCanvas);

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}
