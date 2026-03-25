import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../StoreContext';

interface ParticlesProps {
  position: [number, number, number];
  count?: number;
  spread?: number;
}

export function Particles({ position, count = 100, spread = 20 }: ParticlesProps) {
  const { isAntimatter } = useStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particlesInfo = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
      z: (Math.random() - 0.5) * spread,
      speed: Math.random() * 0.5 + 0.25,
      factor: Math.random() * 120,
      wobble: Math.random() * 0.9 + 0.2,
    }));
  }, [count, spread]);

  useFrame((state) => {
    if (!meshRef.current) return;
    particlesInfo.forEach((p, i) => {
      const t = state.clock.elapsedTime * p.speed;
      dummy.position.set(
        p.x + Math.sin(t + p.factor) * 2.4 * p.wobble,
        p.y + Math.cos(t * 1.2 + p.factor) * 2 * p.wobble,
        p.z + Math.sin(t * 0.8 + p.factor) * 1.8 * p.wobble
      );
      dummy.rotation.set(t * 0.4, t * 0.65, t * 0.3);
      const s = Math.max(0.07, Math.sin(t + p.factor) * 0.5 + 0.45);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const color = isAntimatter ? '#ff6600' : '#3a7bd5';

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={position}>
      <icosahedronGeometry args={[0.24, 0]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={isAntimatter ? 2.6 : 1.5}
        transparent
        opacity={0.74}
        wireframe
      />
    </instancedMesh>
  );
}
