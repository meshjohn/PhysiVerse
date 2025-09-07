"use client";

// SolarSystemR3F.tsx
import React, { useEffect, useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
  useAnimations,
  Loader,
} from "@react-three/drei";

// Responsive Solar System model
function SolarSystemModel({
  url = "/solar_system_animation.glb",
  position = [0, 0, 0] as [number, number, number],
}) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(url) as unknown as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };
  const { actions, mixer, names } = useAnimations(animations, group);

  // ✅ Responsive scale logic
  const { viewport } = useThree();
  const scale = React.useMemo(() => {
    if (viewport.width < 4) return 0.05; // small screens
    if (viewport.width < 8) return 0.07; // tablets
    return 0.09; // desktops
  }, [viewport.width]);

  useEffect(() => {
    if (!actions) return;
    names.forEach((name) => {
      const action = actions[name];
      if (action) {
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
      }
    });
    return () => {
      names.forEach((name) => actions[name]?.stop());
      mixer.stopAllAction();
    };
  }, [actions, mixer, names]);

  // Debug meshes if needed
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        console.log("Mesh name:", obj.name);
      }
    });
  }, [scene]);

  // Wireframe tweak for certain meshes
  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (
          [
            "Object_54",
            "Object_52",
            "Object_50",
            "Object_48",
            "Object_46",
            "Object_44",
            "Object_42",
            "Object_40",
            "Object_38",
            "Object_36",
          ].includes(mesh.name)
        ) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose && mat.dispose());
          } else if (mesh.material && (mesh.material as any).dispose) {
            mesh.material.dispose();
          }
          mesh.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#00ffff"),
            wireframe: true,
            toneMapped: false,
          });
          mesh.layers.enable(1);
        }
      }
    });
  }, [scene]);

  return (
    <primitive ref={group} object={scene} scale={scale} position={position} />
  );
}

export default function Page() {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4, 3, 6], fov: 45 }}
        onCreated={({ camera }) => {
          camera.layers.enable(0);
          camera.layers.enable(1);
        }}
      >
        <Suspense fallback={<Html center>Loading The Solar System</Html>}>
          <Environment preset="city" />
          <SolarSystemModel />
          <ContactShadows opacity={0.4} scale={20} blur={2.5} far={10} />
        </Suspense>

        {/* Lights */}
        <hemisphereLight
          intensity={0.6}
          groundColor={new THREE.Color("#444")}
        />
        <directionalLight
          castShadow
          position={[5, 8, 5]}
          intensity={1.2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={25}
        />

        <EffectComposer>
          <Bloom
            selectionLayer={1}
            intensity={0.1}
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
      <Loader />
    </div>
  );
}

useGLTF.preload("/solar_system_animation.glb");