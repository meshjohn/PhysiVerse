"use client";

import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function AtomicModel(props: any) {
  const { scene } = useGLTF("/atomic_models.glb");
  return <primitive object={scene} {...props} />;
}

function ResponsiveModel() {
  const { size } = useThree();

  let scale: number;
  let position: [number, number, number];

  if (size.width < 480) {
    // Mobile
    scale = 0.13;
    position = [0, 0.5, 0];
  } else if (size.width < 768) {
    // Tablet
    scale = 0.15;
    position = [0, -0.4, 0];
  } else if (size.width < 1280) {
    // Laptop
    scale = 0.2;
    position = [0, -0.3, 0];
  } else {
    // Large screens
    scale = 0.25;
    position = [0, -0.2, 0];
  }

  return <AtomicModel scale={scale} position={position} />;
}

export default function AtomicViewer() {
  return (
    <div className="w-full h-screen model">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={3} />
        <ResponsiveModel />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
