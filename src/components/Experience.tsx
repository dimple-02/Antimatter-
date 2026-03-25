import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';

const CanvasContainer = lazy(() => import('./CanvasContainer'));
const UIContainer = lazy(() => import('./UIContainer'));

export default function Experience() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
    >
      <Suspense fallback={null}>
        <ScrollControls pages={10} damping={0.14} distance={1.15}>
          <CanvasContainer />
          <UIContainer />
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}
