import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Sparkles, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import ChristmasTree from './ChristmasTree';

interface SceneProps {
  lightsOn: boolean;
  rotateSpeed: number;
}

const Scene: React.FC<SceneProps> = ({ lightsOn, rotateSpeed }) => {
  const controlsRef = useRef<any>(null);

  // Slow rotation logic handled by OrbitControls autoRotate, but we update speed prop
  useFrame((state) => {
    if (controlsRef.current) {
        controlsRef.current.autoRotateSpeed = rotateSpeed;
    }
    // Subtle camera breathing
    const t = state.clock.getElapsedTime();
    state.camera.position.y = 2 + Math.sin(t * 0.1) * 0.5;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 10]} fov={45} />
      
      <OrbitControls 
        ref={controlsRef}
        autoRotate 
        autoRotateSpeed={rotateSpeed}
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={5}
        maxDistance={15}
        target={[0, 1.5, 0]}
      />

      {/* Lighting Setup for "Luxury" Feel */}
      <ambientLight intensity={0.1} color="#001a0f" />
      
      {/* Key Light - Warm Gold */}
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.25} 
        penumbra={1} 
        intensity={lightsOn ? 200 : 50} 
        color="#fff0d6" 
        castShadow 
        shadow-bias={-0.0001}
      />
      
      {/* Fill Light - Cool Emerald */}
      <spotLight 
        position={[-10, 5, -10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={100} 
        color="#004225" 
      />

      {/* Rim Light - Sharp White/Blue for metal edges */}
      <pointLight position={[0, -2, 5]} intensity={10} color="#bce6eb" />

      {/* Environment for reflections (Gold needs this to look like metal) */}
      <Environment preset="city" environmentIntensity={0.5} />

      <group position={[0, -2, 0]}>
        <ChristmasTree lightsOn={lightsOn} />
        <ContactShadows opacity={0.7} scale={10} blur={2} far={4} color="#000000" />
      </group>

      {/* Magical Particles */}
      <Sparkles 
        count={200} 
        scale={12} 
        size={4} 
        speed={0.4} 
        opacity={0.5} 
        color="#D4AF37" 
        position={[0, 2, 0]}
      />

      {/* Cinematic Post Processing */}
      <EffectComposer disableNormalPass>
        {/* Bloom for the glowing lights and gold highlights */}
        <Bloom 
          luminanceThreshold={1.1} // Only very bright things glow
          mipmapBlur 
          intensity={0.8} 
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} /> 
      </EffectComposer>
    </>
  );
};

export default Scene;