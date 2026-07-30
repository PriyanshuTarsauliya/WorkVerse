import React, { useEffect, useCallback, useRef } from 'react';

// Lightweight confetti burst — no dependencies needed
export function useConfetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    return () => {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#10b981', '#6366f1', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];
    const shapes = ['rect', 'circle'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 1) * 20 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 6 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.3 + Math.random() * 0.2,
        drag: 0.97,
        opacity: 1,
        fadeSpeed: 0.008 + Math.random() * 0.008,
      });
    }

    let animId;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      for (const p of particles) {
        if (p.opacity <= 0) continue;
        alive++;

        p.vy += p.gravity;
        p.vx *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.fadeSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive > 0) {
        animId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animate();

    return () => cancelAnimationFrame(animId);
  }, []);

  return fire;
}

// Sparkle burst effect (smaller, subtler)
export function useSparkle() {
  const fire = useCallback((originX, originY) => {
    const container = document.createElement('div');
    container.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999`;
    document.body.appendChild(container);

    const sparkleCount = 12;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      const angle = (i / sparkleCount) * 360;
      const distance = 30 + Math.random() * 50;
      const size = 4 + Math.random() * 4;
      const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      sparkle.style.cssText = `
        position: absolute;
        left: ${originX}px;
        top: ${originY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: sparkle-fly 0.8s ease-out forwards;
        --dx: ${Math.cos(angle * Math.PI / 180) * distance}px;
        --dy: ${Math.sin(angle * Math.PI / 180) * distance}px;
      `;
      container.appendChild(sparkle);
    }

    setTimeout(() => {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 1000);
  }, []);

  return fire;
}
