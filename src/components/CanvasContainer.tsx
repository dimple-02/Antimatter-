import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Float, Sparkles, Stars, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../StoreContext';
import { CoreAtom } from './models/CoreAtom';
import { Particles } from './models/Particles';

const SceneEffects = lazy(() => import('./SceneEffects'));

const STORY_SECTIONS = 7;
const TRANSITION_WEIGHTS = [1, 0.78, 0.48, 0.94, 0.78, 0.5];

function getCinematicSectionFloat(rawOffset: number) {
  const clamped = THREE.MathUtils.clamp(rawOffset, 0, 1);
  const transitionCount = STORY_SECTIONS - 1;
  const rawPosition = clamped * transitionCount;
  const index = Math.min(transitionCount - 1, Math.floor(rawPosition));
  const local = rawPosition - index;

  const totalWeight = TRANSITION_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  let weightedSoFar = 0;
  for (let i = 0; i < index; i += 1) {
    weightedSoFar += TRANSITION_WEIGHTS[i];
  }

  const weightedPosition = weightedSoFar + local * TRANSITION_WEIGHTS[index];
  return (weightedPosition / totalWeight) * transitionCount;
}

const CAMERA_POINTS = [
  new THREE.Vector3(0, 0.25, 11),
  new THREE.Vector3(0, -1.25, 8.5),
  new THREE.Vector3(0.2, -2.8, 7.9),
  new THREE.Vector3(1.4, -4.8, 6.5),
  new THREE.Vector3(-1.5, -8.1, 7.8),
  new THREE.Vector3(-0.4, -9.9, 10.1),
  new THREE.Vector3(0, -12.8, 14.4),
];

const LOOK_AT_POINTS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, -1.5, 2),
  new THREE.Vector3(0.25, -3.2, 5),
  new THREE.Vector3(0.6, -4.8, 8),
  new THREE.Vector3(0, -8.8, 12),
  new THREE.Vector3(-0.25, -10.3, 15),
  new THREE.Vector3(0, -12.5, 20),
];

function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();
  const { setActiveSection } = useStore();
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const sectionFloat = getCinematicSectionFloat(scroll.offset);
    const index = Math.floor(sectionFloat);
    const localProgress = THREE.MathUtils.clamp(sectionFloat - index, 0, 1);

    const from = CAMERA_POINTS[index] ?? CAMERA_POINTS[0];
    const to = CAMERA_POINTS[index + 1] ?? CAMERA_POINTS[CAMERA_POINTS.length - 1];

    const lookFrom = LOOK_AT_POINTS[index] ?? LOOK_AT_POINTS[0];
    const lookTo = LOOK_AT_POINTS[index + 1] ?? LOOK_AT_POINTS[LOOK_AT_POINTS.length - 1];

    const current = from.clone().lerp(to, localProgress);
    const target = lookFrom.clone().lerp(lookTo, localProgress);

    const interludeAInfluence = 1 - THREE.MathUtils.smoothstep(Math.abs(sectionFloat - 2), 0.2, 0.9);
    const interludeBInfluence = 1 - THREE.MathUtils.smoothstep(Math.abs(sectionFloat - 5), 0.2, 0.9);
    const interludeInfluence = Math.max(interludeAInfluence, interludeBInfluence);

    const perspectiveCamera = 'fov' in camera ? (camera as THREE.PerspectiveCamera) : null;

    if (interludeInfluence > 0) {
      const breath = Math.sin(state.clock.elapsedTime * 0.55) * 0.08 * interludeInfluence;
      current.z += breath;
      current.y += Math.cos(state.clock.elapsedTime * 0.4) * 0.04 * interludeInfluence;
      if (perspectiveCamera) {
        perspectiveCamera.fov = THREE.MathUtils.lerp(
          perspectiveCamera.fov,
          45.8 - interludeInfluence * 0.5,
          0.06,
        );
        perspectiveCamera.updateProjectionMatrix();
      }
    } else {
      if (perspectiveCamera) {
        perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, 45, 0.08);
        perspectiveCamera.updateProjectionMatrix();
      }
    }

    camera.position.lerp(current, 0.08);
    lookAtTarget.lerp(target, 0.08);
    camera.lookAt(lookAtTarget);

    const section = Math.min(STORY_SECTIONS - 1, Math.floor(sectionFloat + 0.001));
    setActiveSection(section);
  });

  return null;
}

function SpaceTunnel({ mobile }: { mobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: mobile ? 11 : 18 }, (_, idx) => ({
        z: idx * 2.2,
        y: -2.3 - idx * 0.75,
        radius: 1.5 + ((idx % 5) * 0.25),
      })),
    [mobile],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((ring, i) => {
      ring.rotation.z = state.clock.elapsedTime * 0.17 + i * 0.19;
      ring.position.x = Math.sin(state.clock.elapsedTime * 0.35 + i) * 0.35;
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={`ring-${ring.z}`} position={[0, ring.y, ring.z]}>
          <torusGeometry args={[ring.radius, 0.028, 12, mobile ? 42 : 86]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#44d5ff' : '#ff72cb'}
            emissive={i % 2 === 0 ? '#44d5ff' : '#ff72cb'}
            emissiveIntensity={1.4}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function EnergyWave({ isAntimatter }: { isAntimatter: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.8) * 0.18;
    meshRef.current.scale.set(pulse, pulse, 1);
    meshRef.current.rotation.z += 0.003;
  });

  return (
    <mesh ref={meshRef} position={[0, -8.4, 11.5]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.85, 2.8, 80]} />
      <meshStandardMaterial
        color={isAntimatter ? '#f15fff' : '#48d6ff'}
        emissive={isAntimatter ? '#f15fff' : '#48d6ff'}
        emissiveIntensity={2.2}
        transparent
        opacity={0.45}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function HologramPanels({ isAntimatter }: { isAntimatter: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, camera }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      child.lookAt(camera.position);
      child.position.y += Math.sin(clock.elapsedTime * 0.9 + idx * 0.7) * 0.0009;
    });
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-2.7, -4.1, 9.6]}>
        <planeGeometry args={[1.8, 1.1]} />
        <meshStandardMaterial
          color={isAntimatter ? '#ff6bdb' : '#57dbff'}
          emissive={isAntimatter ? '#ff6bdb' : '#57dbff'}
          emissiveIntensity={1.8}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[2.45, -5.7, 12.2]}>
        <planeGeometry args={[1.5, 0.9]} />
        <meshStandardMaterial
          color={isAntimatter ? '#ff9b7b' : '#6f9dff'}
          emissive={isAntimatter ? '#ff9b7b' : '#6f9dff'}
          emissiveIntensity={1.7}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function CollisionBurst({ trigger }: { trigger: string | null }) {
  const burstRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0.001;
  }, [trigger]);

  useFrame(() => {
    if (!burstRef.current) return;

    if (progressRef.current <= 0) {
      burstRef.current.visible = false;
      return;
    }

    burstRef.current.visible = true;
    progressRef.current += 0.055;
    const p = progressRef.current;
    const scale = 0.7 + p * 7.2;
    burstRef.current.scale.set(scale, scale, 1);

    const material = burstRef.current.material as THREE.MeshStandardMaterial;
    material.opacity = Math.max(0, 0.85 - p * 1.35);

    if (p >= 1.1) {
      progressRef.current = 0;
    }
  });

  return (
    <mesh ref={burstRef} position={[0, -7.5, 11]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.7, 1.05, 70]} />
      <meshStandardMaterial color="#fef7ff" emissive="#f06bff" emissiveIntensity={2.8} transparent opacity={0} />
    </mesh>
  );
}

type HotspotId = 'energy' | 'science' | 'applications';

function HotspotNodes() {
  const { selectedHotspot, setSelectedHotspot, setFoundEasterEgg } = useStore();
  const [hovered, setHovered] = useState<HotspotId | null>(null);

  const hotspots: Array<{ id: HotspotId; position: [number, number, number] }> = [
    { id: 'energy', position: [-1.8, -7.8, 10.8] },
    { id: 'science', position: [0, -7.1, 11.2] },
    { id: 'applications', position: [1.9, -7.9, 10.7] },
  ];

  return (
    <group>
      {hotspots.map((spot) => {
        const active = selectedHotspot === spot.id;
        const over = hovered === spot.id;
        return (
          <Float key={spot.id} speed={2.5} floatIntensity={0.35} rotationIntensity={0.55}>
            <mesh
              position={spot.position}
              scale={active || over ? 1.25 : 1}
              onPointerOver={() => setHovered(spot.id)}
              onPointerOut={() => setHovered(null)}
              onClick={() => setSelectedHotspot(spot.id)}
            >
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshStandardMaterial
                color={active ? '#f661ff' : '#53d7ff'}
                emissive={active ? '#f661ff' : '#53d7ff'}
                emissiveIntensity={active || over ? 2.8 : 1.6}
                transparent
                opacity={0.95}
              />
            </mesh>
          </Float>
        );
      })}

      <mesh
        position={[2.8, -6.5, 12.4]}
        onClick={() => setFoundEasterEgg(true)}
        onPointerOver={() => setHovered('science')}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial transparent opacity={0.05} color="#ffffff" />
      </mesh>
    </group>
  );
}

function CosmicSignature() {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const generated: Array<[number, number, number]> = [];
    for (let i = 0; i < 110; i += 1) {
      const t = (i / 110) * Math.PI * 2;
      const x = Math.cos(t) * 1.8;
      const y = Math.sin(t) * 0.8;
      const z = Math.sin(t * 2) * 0.3;
      generated.push([x, y, z]);
    }
    return generated;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, -11.4, 19]}>
      {points.map((p, i) => (
        <mesh key={`symbol-${i}`} position={p}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#71dbff" emissive="#71dbff" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

export default function CanvasContainer() {
  const { isAntimatter, selectedHotspot } = useStore();
  const { size } = useThree();
  const [effectsReady, setEffectsReady] = useState(false);

  const mobile = size.width < 820;
  const starsCount = mobile ? 1700 : 4300;
  const sparklesCount = mobile ? 90 : 240;

  useEffect(() => {
    if (mobile) {
      setEffectsReady(false);
      return;
    }

    const timeout = window.setTimeout(() => setEffectsReady(true), 600);
    return () => window.clearTimeout(timeout);
  }, [mobile]);

  return (
    <>
      <color attach="background" args={[isAntimatter ? '#13071a' : '#04060a']} />

      <fog attach="fog" args={[isAntimatter ? '#13071a' : '#04060a', 18, 52]} />
      <ambientLight intensity={0.4} color={isAntimatter ? '#ff7ce8' : '#8ab9ff'} />
      <directionalLight
        position={[8, 5, 6]}
        intensity={isAntimatter ? 2.8 : 2}
        color={isAntimatter ? '#ff74df' : '#58dbff'}
      />
      <pointLight position={[-7, -5, 10]} intensity={2.2} color={isAntimatter ? '#ff9f68' : '#6f8fff'} />

      <CameraRig />

      <Stars
        radius={100}
        depth={70}
        count={starsCount}
        factor={5.6}
        saturation={isAntimatter ? 1 : 0.4}
        fade
        speed={isAntimatter ? 1.6 : 1.1}
      />
      <Sparkles
        count={sparklesCount}
        scale={mobile ? 24 : 35}
        size={isAntimatter ? 4.4 : 3.1}
        speed={0.55}
        color={isAntimatter ? '#f76ce0' : '#63d9ff'}
        opacity={0.8}
      />

      <CoreAtom position={[0, 0, 0]} />
      <CoreAtom position={[-2.2, -1.35, 2]} />
      <CoreAtom position={[2.2, -1.35, 2]} />

      <SpaceTunnel mobile={mobile} />

      <Particles position={[0, -1.8, 6]} count={mobile ? 60 : 120} spread={18} />
      <Particles position={[0, -4.8, 10]} count={mobile ? 50 : 110} spread={15} />
      <Particles position={[0, -8.7, 12.8]} count={mobile ? 45 : 95} spread={13} />

      <EnergyWave isAntimatter={isAntimatter} />
      <HologramPanels isAntimatter={isAntimatter} />
      <CollisionBurst trigger={selectedHotspot} />
      <HotspotNodes />
      <CosmicSignature />
      {effectsReady ? (
        <Suspense fallback={null}>
          <SceneEffects />
        </Suspense>
      ) : null}
    </>
  );
}
