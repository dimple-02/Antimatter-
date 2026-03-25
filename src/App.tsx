import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useStore } from './StoreContext';
const Experience = lazy(() => import('./components/Experience'));

interface CursorRipple {
  id: number;
  x: number;
  y: number;
}

function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-atom">
        <span className="loading-core" />
        <span className="loading-ring loading-ring-a" />
        <span className="loading-ring loading-ring-b" />
        <span className="loading-ring loading-ring-c" />
      </div>
      <p className="loading-text">Calibrating the antimatter field...</p>
    </div>
  );
}

function CursorHalo({ isAntimatter }: { isAntimatter: boolean }) {
  const [position] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isActiveTarget, setIsActiveTarget] = useState(false);
  const [ripples, setRipples] = useState<CursorRipple[]>([]);
  const haloRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rippleTimeoutsRef = useRef<number[]>([]);
  const targetPos = useRef({ x: position.x, y: position.y });
  const haloPos = useRef({ x: position.x, y: position.y });
  const ringPos = useRef({ x: position.x, y: position.y });
  const dotPos = useRef({ x: position.x, y: position.y });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        setIsActiveTarget(false);
        targetPos.current = { x: event.clientX, y: event.clientY };
        return;
      }

      const interactive = target.closest('button, a, .glass-panel, [role="button"], [data-cursor="active"]');
      if (!interactive) {
        setIsActiveTarget(false);
        targetPos.current = { x: event.clientX, y: event.clientY };
        return;
      }

      setIsActiveTarget(true);

      const rect = interactive.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - event.clientX;
      const dy = centerY - event.clientY;
      const distance = Math.hypot(dx, dy);
      const magneticRadius = 220;
      const pullStrength = Math.min(1, Math.max(0, 1 - distance / magneticRadius)) * 0.24;

      targetPos.current = {
        x: event.clientX + dx * pullStrength,
        y: event.clientY + dy * pullStrength,
      };
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const isTouchLike = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchLike) {
      return undefined;
    }

    const handlePointerDown = () => {
      const id = Date.now() + Math.floor(Math.random() * 10000);
      const ripple = { id, x: targetPos.current.x, y: targetPos.current.y };
      setRipples((prev) => [...prev.slice(-4), ripple]);

      const timeout = window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== id));
        rippleTimeoutsRef.current = rippleTimeoutsRef.current.filter((item) => item !== timeout);
      }, 650);

      rippleTimeoutsRef.current.push(timeout);
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      rippleTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      rippleTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    let frameId = 0;

    const animate = () => {
      const target = targetPos.current;

      dotPos.current.x += (target.x - dotPos.current.x) * 0.42;
      dotPos.current.y += (target.y - dotPos.current.y) * 0.42;
      ringPos.current.x += (target.x - ringPos.current.x) * 0.24;
      ringPos.current.y += (target.y - ringPos.current.y) * 0.24;
      haloPos.current.x += (target.x - haloPos.current.x) * 0.12;
      haloPos.current.y += (target.y - haloPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 3}px, ${dotPos.current.y - 3}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 15}px, ${ringPos.current.y - 15}px, 0)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${haloPos.current.x - 120}px, ${haloPos.current.y - 120}px, 0)`;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <div
        ref={haloRef}
        className={`cursor-halo ${isActiveTarget ? 'cursor-halo-active' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${isActiveTarget ? 'cursor-ring-active' : ''} ${isAntimatter ? 'cursor-ring-antimatter' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={`cursor-dot ${isActiveTarget ? 'cursor-dot-active' : ''} ${isAntimatter ? 'cursor-dot-antimatter' : ''}`}
        aria-hidden="true"
      />
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`cursor-ripple ${isAntimatter ? 'cursor-ripple-antimatter' : ''}`}
          aria-hidden="true"
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
        />
      ))}
    </>
  );
}

function App() {
  const { isAntimatter } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 1800);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className={`app-shell ${isAntimatter ? 'app-shell-antimatter' : ''}`}>
      {loading && <LoadingScreen />}
      <CursorHalo isAntimatter={isAntimatter} />
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </div>
  );
}

export default App;
