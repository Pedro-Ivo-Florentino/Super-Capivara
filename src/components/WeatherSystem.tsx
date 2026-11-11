import { useEffect, useRef } from 'react';

export type WeatherType = 'rain' | 'dust' | 'mist' | 'embers' | 'snow' | 'none';
export type WeatherQuality = 'high' | 'low' | 'off';

interface WeatherSystemProps {
  weatherType: WeatherType;
  quality: WeatherQuality;
  cameraX: number;
  floorY?: number;
  isPaused?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxLife: number;
  life: number;
  depth: number; // For parallax effect: 0.2 (far) to 1.0 (near)
  color: string;
  glow?: boolean;
  type?: 'drop' | 'splash' | 'ember' | 'ash' | 'mist' | 'firefly' | 'flake' | 'dust';
  w?: number;
  h?: number;
  angle?: number;
  angularSpeed?: number;
}

export default function WeatherSystem({
  weatherType,
  quality,
  cameraX,
  floorY = 500,
  isPaused = false,
}: WeatherSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastCameraXRef = useRef(cameraX);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    lastCameraXRef.current = cameraX;
  }, [cameraX]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || quality === 'off' || weatherType === 'none') {
      particlesRef.current = [];
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1000;
    const height = 562;

    // Determine target particle counts based on quality
    let targetCount = 0;
    if (quality === 'high') {
      if (weatherType === 'rain') targetCount = 130;
      else if (weatherType === 'embers') targetCount = 85;
      else if (weatherType === 'snow') targetCount = 75;
      else if (weatherType === 'dust') targetCount = 70;
      else if (weatherType === 'mist') targetCount = 45;
    } else {
      // 'low' quality
      if (weatherType === 'rain') targetCount = 40;
      else if (weatherType === 'embers') targetCount = 28;
      else if (weatherType === 'snow') targetCount = 25;
      else if (weatherType === 'dust') targetCount = 25;
      else if (weatherType === 'mist') targetCount = 18;
    }

    // Helper to spawn/reset a particle
    const initParticle = (p: Particle, initialSpawn: boolean = false): void => {
      const depth = 0.3 + Math.random() * 0.7;
      p.depth = depth;

      if (weatherType === 'rain') {
        p.type = 'drop';
        p.x = Math.random() * (width + 200) - 100;
        p.y = initialSpawn ? Math.random() * height : -20;
        p.vx = -1.5 * depth;
        p.vy = (14 + Math.random() * 8) * depth;
        p.size = 1 + depth * 1.5;
        p.w = 1.5;
        p.h = (12 + Math.random() * 10) * depth;
        p.opacity = 0.35 + depth * 0.45;
        p.color = depth > 0.7 ? '#bae6fd' : '#7dd3fc';
        p.life = 0;
        p.maxLife = 200;
      } else if (weatherType === 'dust') {
        p.type = 'dust';
        p.x = initialSpawn ? Math.random() * width : width + 20;
        p.y = Math.random() * height;
        p.vx = (-1.8 - Math.random() * 2.2) * depth;
        p.vy = (Math.sin(Math.random() * Math.PI) - 0.2) * depth;
        p.size = (1.5 + Math.random() * 3) * depth;
        p.opacity = 0.25 + Math.random() * 0.5;
        p.color = Math.random() > 0.4 ? '#fef08a' : '#f59e0b';
        p.angle = Math.random() * Math.PI * 2;
        p.angularSpeed = (Math.random() - 0.5) * 0.05;
        p.life = 0;
        p.maxLife = 300 + Math.random() * 200;
      } else if (weatherType === 'mist') {
        const isFirefly = Math.random() < 0.25;
        if (isFirefly) {
          p.type = 'firefly';
          p.x = Math.random() * width;
          p.y = initialSpawn ? Math.random() * height : Math.random() * height;
          p.vx = (Math.random() - 0.5) * 0.8;
          p.vy = (Math.random() - 0.5) * 0.6;
          p.size = 2.5 + Math.random() * 2;
          p.opacity = 0.4 + Math.random() * 0.6;
          p.color = '#a3e635';
          p.glow = true;
          p.life = 0;
          p.maxLife = 200 + Math.random() * 200;
        } else {
          p.type = 'mist';
          p.x = initialSpawn ? Math.random() * width : (Math.random() > 0.5 ? -150 : width + 150);
          p.y = 80 + Math.random() * (height - 150);
          p.vx = (-0.4 - Math.random() * 0.4) * depth;
          p.vy = (Math.random() - 0.5) * 0.15;
          p.size = 80 + Math.random() * 120;
          p.opacity = 0.08 + Math.random() * 0.12;
          p.color = '#e2e8f0';
          p.life = 0;
          p.maxLife = 500 + Math.random() * 300;
        }
      } else if (weatherType === 'embers') {
        const isAsh = Math.random() < 0.35;
        if (isAsh) {
          p.type = 'ash';
          p.x = Math.random() * width;
          p.y = initialSpawn ? Math.random() * height : -20;
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = (0.8 + Math.random() * 1.2) * depth;
          p.size = 2 + Math.random() * 2.5;
          p.opacity = 0.3 + Math.random() * 0.4;
          p.color = '#71717a';
          p.life = 0;
          p.maxLife = 350;
        } else {
          p.type = 'ember';
          p.x = Math.random() * width;
          p.y = initialSpawn ? Math.random() * height : height + 20;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = (-2.5 - Math.random() * 3.5) * depth;
          p.size = (2 + Math.random() * 3) * depth;
          p.opacity = 0.5 + Math.random() * 0.5;
          p.color = Math.random() > 0.3 ? '#f97316' : '#ef4444';
          p.glow = true;
          p.life = 0;
          p.maxLife = 120 + Math.random() * 100;
        }
      } else if (weatherType === 'snow') {
        p.type = 'flake';
        p.x = Math.random() * (width + 100) - 50;
        p.y = initialSpawn ? Math.random() * height : -20;
        p.vx = (Math.random() - 0.6) * 1.5 * depth;
        p.vy = (1.2 + Math.random() * 2.0) * depth;
        p.size = (2 + Math.random() * 4) * depth;
        p.opacity = 0.35 + Math.random() * 0.5;
        p.color = Math.random() > 0.3 ? '#e0e7ff' : '#c7d2fe';
        p.angle = Math.random() * Math.PI * 2;
        p.angularSpeed = (Math.random() - 0.5) * 0.04;
        p.life = 0;
        p.maxLife = 400;
      }
    };

    // Populate initial particle pool
    particlesRef.current = [];
    for (let i = 0; i < targetCount; i++) {
      const p: Particle = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        opacity: 0,
        maxLife: 100,
        life: 0,
        depth: 1,
        color: '#fff',
      };
      initParticle(p, true);
      particlesRef.current.push(p);
    }

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      // Camera parallax delta
      const camDelta = lastCameraXRef.current - cameraX;
      lastCameraXRef.current = cameraX;

      const particles = particlesRef.current;
      const splashesToSpawn: Particle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isPaused) {
          // Apply camera parallax
          p.x += camDelta * (0.2 + p.depth * 0.4);

          // Update position
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          if (p.angle !== undefined && p.angularSpeed !== undefined) {
            p.angle += p.angularSpeed;
            p.x += Math.sin(p.angle) * 0.4;
          }

          // Special logic for splashes on rain
          if (p.type === 'drop') {
            if (p.y >= floorY && Math.random() < 0.25 && splashesToSpawn.length < 8) {
              splashesToSpawn.push({
                x: p.x,
                y: floorY - 2,
                vx: (Math.random() - 0.5) * 2,
                vy: -1.5 - Math.random() * 2,
                size: 1.5,
                opacity: 0.7,
                maxLife: 12,
                life: 0,
                depth: p.depth,
                color: '#bae6fd',
                type: 'splash',
              });
            }
          }
        }

        // Check bounds & reset particle if expired or out of frame
        let outOfBounds = false;
        if (p.type === 'drop') {
          if (p.y > height + 20 || p.x < -150 || p.x > width + 150) outOfBounds = true;
        } else if (p.type === 'ember') {
          if (p.y < -30 || p.x < -50 || p.x > width + 50 || p.life > p.maxLife) outOfBounds = true;
        } else if (p.type === 'splash') {
          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            i--;
            continue;
          }
        } else if (p.type === 'mist') {
          if (p.x < -200 || p.x > width + 200 || p.life > p.maxLife) outOfBounds = true;
        } else {
          if (p.y > height + 30 || p.y < -30 || p.x < -100 || p.x > width + 100 || p.life > p.maxLife) {
            outOfBounds = true;
          }
        }

        if (outOfBounds && p.type !== 'splash') {
          initParticle(p, false);
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === 'drop') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.4, p.y + (p.h || 14));
          ctx.stroke();
        } else if (p.type === 'splash') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'mist') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
          grad.addColorStop(0.5, 'rgba(241, 245, 249, 0.06)');
          grad.addColorStop(1, 'rgba(241, 245, 249, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'firefly') {
          // Soft glow ring
          ctx.fillStyle = 'rgba(190, 242, 100, 0.25)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Bright center
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ember') {
          // Glow halo
          ctx.fillStyle = p.color === '#ef4444' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(249, 115, 22, 0.35)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'flake') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Default circular particle (dust, ash)
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Add temporary splash particles if any
      if (splashesToSpawn.length > 0 && particles.length < targetCount + 15) {
        particles.push(...splashesToSpawn);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [weatherType, quality, floorY, isPaused]);

  if (quality === 'off' || weatherType === 'none') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={562}
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      style={{
        imageRendering: 'auto',
      }}
    />
  );
}
