import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, Trail, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../StoreContext';

export function CoreAtom({ position }: { position: [number, number, number] }) {
  const { isAntimatter } = useStore();
  const groupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = isHovered ? 1.12 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      groupRef.current.rotation.y += delta * (isHovered ? 0.65 : 0.28);
      groupRef.current.rotation.x += delta * 0.14;
    }

    if (nucleusRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * (isAntimatter ? 3.4 : 2.2)) * 0.12;
      nucleusRef.current.scale.setScalar(pulse);
    }
  });

  const coreColor = isAntimatter ? '#ff00cc' : '#00d2ff';
  const elecColor = isAntimatter ? '#8efff7' : '#ff79c8';

  return (
    <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.65}>
      <group
        position={position}
        ref={groupRef}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <Icosahedron ref={nucleusRef} args={[1.5, 2]}>
          <meshStandardMaterial 
            color={coreColor} 
            emissive={coreColor} 
            emissiveIntensity={isHovered ? 3 : isAntimatter ? 2.4 : 1.7}
            wireframe
          />
        </Icosahedron>

        <group rotation={[Math.PI / 4, 0, isAntimatter ? Math.PI / 6 : 0]}>
          <Electron color={elecColor} speed={1.5} radius={3.5} />
        </group>
        <group rotation={[-Math.PI / 4, Math.PI / 3, isAntimatter ? -Math.PI / 7 : 0]}>
          <Electron color={elecColor} speed={1.8} radius={4} />
        </group>
        <group rotation={[0, -Math.PI / 4, Math.PI / 4 + (isAntimatter ? Math.PI / 5 : 0)]}>
          <Electron color={elecColor} speed={2} radius={4.5} />
        </group>
      </group>
    </Float>
  );
}

function Electron({ color, speed, radius }: { color: string; speed: number; radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed;
    meshRef.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });

  return (
    <Trail width={0.4} length={6.5} color={new THREE.Color(color).clone()} attenuation={(t) => t * t}>
      <Sphere ref={meshRef} args={[0.2, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} />
      </Sphere>
    </Trail>
  );
}
