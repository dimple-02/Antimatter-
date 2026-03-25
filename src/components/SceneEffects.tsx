import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { useStore } from '../StoreContext';

export default function SceneEffects() {
  const { isAntimatter } = useStore();

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={isAntimatter ? 1.35 : 1.05}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.25}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(isAntimatter ? 0.00085 : 0.00045, isAntimatter ? 0.00085 : 0.00045)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={isAntimatter ? 0.18 : 0.12} />
      <Vignette eskil={false} offset={0.15} darkness={isAntimatter ? 0.78 : 0.65} />
    </EffectComposer>
  );
}
