import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';

const App: React.FC = () => {
  const [lightsOn, setLightsOn] = useState(true);
  const [rotateSpeed, setRotateSpeed] = useState(0.5);

  return (
    <div className="relative w-full h-screen bg-neutral-900">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 2, 12], fov: 35 }}
        gl={{ antialias: false, stencil: false, depth: true }}
      >
        <Suspense fallback={null}>
          <Scene lightsOn={lightsOn} rotateSpeed={rotateSpeed} />
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ background: '#020403' }} 
        innerStyles={{ width: '200px', height: '2px', background: '#333' }} 
        barStyles={{ height: '2px', background: '#D4AF37' }} 
      />
      <UIOverlay 
        lightsOn={lightsOn} 
        setLightsOn={setLightsOn} 
        rotateSpeed={rotateSpeed}
        setRotateSpeed={setRotateSpeed}
      />
    </div>
  );
};

export default App;