"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// ✅ Atomic Model Component
function AtomicModel({ scale }: { scale: number }) {
  const { scene } = useGLTF("/atomic_models.glb");
  return <primitive object={scene} scale={scale} />;
}

// ✅ Atomic Viewer Component
export default function AtomicViewer() {
  const [scale, setScale] = useState(0.3);
  const [position, setPosition] = useState<[number, number, number]>([0, 2, 6]);

  // 📱 Responsive scaling + camera
  const updateScale = useCallback(() => {
    const width = window.innerWidth;

    if (width < 480) {
      setScale(0.3); // small phones
      setPosition([0, 0, 12]); // zoomed out more
    } else if (width < 768) {
      setScale(0.4); // tablets
      setPosition([0, 1, 10]);
    } else if (width < 1200) {
      setScale(0.5); // laptops
      setPosition([0, 1.5, 8]);
    } else {
      setScale(0.4); // desktops
      setPosition([0, 2, 6]); // closer on large screens
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <Canvas camera={{ position, fov: 60 }} shadows>
        {/* 🌍 Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

        {/* 🔬 Atomic Model */}
        <AtomicModel scale={scale} />

        {/* 🎛 Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={20} // allow more zoom out
        />
      </Canvas>
    </div>
  );
}