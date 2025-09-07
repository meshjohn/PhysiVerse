"use client";

import React, { Suspense } from "react";

import { Canvas } from "@react-three/fiber";

import { OrbitControls, useGLTF } from "@react-three/drei";

function NebulaSkybox(props: any) {
  const { scene } = useGLTF("/nebula_skybox_16k.glb"); // put your file in /public

  return <primitive object={scene} {...props} />;
}

export default function Supernova() {
  return (
    <div className="fixed inset-0 w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={<Html center>Loading Supernova</Html>}>
          <NebulaSkybox scale={1} />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          zoomSpeed={1.0}
          minDistance={1} // how close you can zoom in
          maxDistance={100}
        />
      </Canvas>
    </div>
  );
}
