import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances, Float, Outlines } from '@react-three/drei';
import * as THREE from 'three';

// --- Constants & Materials ---

// Arix Signature Emerald
const EMERALD_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#013A20",
  roughness: 0.35,
  metalness: 0.1,
  emissive: "#001a0d",
  emissiveIntensity: 0.2,
});

// Arix Signature Gold (High Polish)
const GOLD_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#FFD700",
  roughness: 0.15,
  metalness: 1.0,
  envMapIntensity: 1.5,
});

// Glowing Light Material
const LIGHT_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#fffae3",
  emissive: "#ffdf80",
  emissiveIntensity: 4, // Higher than 1 triggers Bloom
  toneMapped: false,
});

const RED_ORNAMENT_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#8a0303",
  roughness: 0.1,
  metalness: 0.6,
});

// --- Helper Components ---

const TreeLayer = ({ position, scale, rotation }: { position: [number, number, number], scale: number, rotation: number }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh receiveShadow castShadow material={EMERALD_MATERIAL}>
        <coneGeometry args={[1.8 * scale, 2 * scale, 8, 1]} />
      </mesh>
      {/* Add gold trim to the bottom of the layer */}
      <mesh position={[0, -1 * scale + 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
         <torusGeometry args={[1.75 * scale, 0.04 * scale, 16, 32]} />
         <primitive object={GOLD_MATERIAL} attach="material" />
      </mesh>
    </group>
  );
};

const Garland = ({ radius, height, turns, layers }: { radius: number, height: number, turns: number, layers: number }) => {
  const points = useMemo(() => {
    const pts = [];
    const count = 100;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const angle = t * turns * Math.PI * 2;
      const y = (1 - t) * height;
      const r = (t * radius * 0.2) + ((1-t) * radius); // Tapering
      pts.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, [radius, height, turns]);

  return (
    <mesh position={[0, 0.5, 0]}>
      <tubeGeometry args={[points, 128, 0.08, 8, false]} />
      <primitive object={GOLD_MATERIAL} attach="material" />
    </mesh>
  );
};

const Ornaments = ({ count, radius, height, lightsOn }: { count: number, radius: number, height: number, lightsOn: boolean }) => {
  const { positions, colors, sizes, types } = useMemo(() => {
    const pos = [];
    const col = [];
    const sz = [];
    const typ = []; // 0 = gold, 1 = red, 2 = light
    
    for (let i = 0; i < count; i++) {
      const y = Math.random() * height;
      const t = 1 - (y / height); // 1 at bottom, 0 at top
      const r = (t * radius) + 0.2; // Cone shape approximation offset
      
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      // Push partially "in" the tree so they nestle
      pos.push(x * 0.85, y + 0.5, z * 0.85); 
      
      const typeRoll = Math.random();
      if (typeRoll > 0.7) {
        // Light
        typ.push(2);
        sz.push(0.08);
      } else if (typeRoll > 0.4) {
         // Gold
         typ.push(0);
         sz.push(0.15 + Math.random() * 0.1);
      } else {
         // Red
         typ.push(1);
         sz.push(0.15 + Math.random() * 0.1);
      }
    }
    return { positions: new Float32Array(pos), colors: new Float32Array(col), sizes: new Float32Array(sz), types: typ };
  }, [count, radius, height]);

  return (
    <group>
        {/* We use Instances for performance, split by material */}
        <Instances range={1000} material={GOLD_MATERIAL} geometry={new THREE.SphereGeometry(1, 16, 16)}>
            {types.map((type, i) => (
                type === 0 && (
                    <Instance 
                        key={i} 
                        position={[positions[i*3], positions[i*3+1], positions[i*3+2]]} 
                        scale={sizes[i]} 
                    />
                )
            ))}
        </Instances>

        <Instances range={1000} material={RED_ORNAMENT_MATERIAL} geometry={new THREE.SphereGeometry(1, 16, 16)}>
             {types.map((type, i) => (
                type === 1 && (
                    <Instance 
                        key={i} 
                        position={[positions[i*3], positions[i*3+1], positions[i*3+2]]} 
                        scale={sizes[i]} 
                    />
                )
            ))}
        </Instances>

        {/* Lights - Dynamic Intensity */}
        <Instances range={1000} geometry={new THREE.SphereGeometry(1, 8, 8)}>
             <meshStandardMaterial 
                color="#fffae3" 
                emissive="#ffdf80" 
                emissiveIntensity={lightsOn ? 5 : 0} 
                toneMapped={false} 
             />
             {types.map((type, i) => (
                type === 2 && (
                    <TwinklingLight 
                        key={i} 
                        position={[positions[i*3], positions[i*3+1], positions[i*3+2]]} 
                        scale={sizes[i]} 
                        lightsOn={lightsOn}
                    />
                )
            ))}
        </Instances>
    </group>
  );
};

const TwinklingLight: React.FC<{position: [number, number, number], scale: number, lightsOn: boolean}> = ({ position, scale, lightsOn }) => {
    const ref = useRef<any>();
    const speed = useMemo(() => 0.5 + Math.random(), []);
    const offset = useMemo(() => Math.random() * 100, []);

    useFrame((state) => {
        if(ref.current && lightsOn) {
            const t = state.clock.elapsedTime;
            // Scale pulse for twinkle effect
            const s = scale * (0.8 + Math.sin(t * speed + offset) * 0.4);
            ref.current.scale.set(s, s, s);
        } else if (ref.current && !lightsOn) {
             ref.current.scale.set(scale, scale, scale);
        }
    });

    return <Instance ref={ref} position={position} scale={scale} />;
}

// --- Main Tree Component ---

const ChristmasTree: React.FC<{ lightsOn: boolean }> = ({ lightsOn }) => {
  const treeHeight = 7;
  const bottomRadius = 2.5;

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
        <group>
            {/* Tree Base / Layers */}
            <TreeLayer position={[0, 1, 0]} scale={1.4} rotation={0} />
            <TreeLayer position={[0, 2.5, 0]} scale={1.1} rotation={Math.PI / 4} />
            <TreeLayer position={[0, 3.8, 0]} scale={0.8} rotation={0} />
            <TreeLayer position={[0, 4.8, 0]} scale={0.5} rotation={Math.PI / 4} />
            
            {/* Ornaments & Lights */}
            <Ornaments count={120} radius={bottomRadius} height={treeHeight} lightsOn={lightsOn} />

            {/* Garland - Procedural Spiral */}
            <Garland radius={3} height={6} turns={3.5} layers={5} />

            {/* The Star */}
            <mesh position={[0, 5.8, 0]} castShadow>
                <dodecahedronGeometry args={[0.4, 0]} />
                <primitive object={GOLD_MATERIAL} attach="material" />
                 {/* Star Glow */}
                <meshBasicMaterial color="#FFD700" /> 
            </mesh>
            <mesh position={[0, 5.8, 0]}>
                <dodecahedronGeometry args={[0.45, 0]} />
                <meshBasicMaterial color="#FFD700" transparent opacity={0.2} wireframe />
            </mesh>
             {/* Strong Light inside Star */}
             {lightsOn && <pointLight position={[0, 5.8, 0]} intensity={10} distance={5} color="#ffaa00" />}

             {/* Trunk */}
             <mesh position={[0, 0, 0]} receiveShadow>
                <cylinderGeometry args={[0.4, 0.6, 2, 8]} />
                <meshStandardMaterial color="#3d2817" roughness={0.8} />
             </mesh>
        </group>
    </Float>
  );
};

export default ChristmasTree;