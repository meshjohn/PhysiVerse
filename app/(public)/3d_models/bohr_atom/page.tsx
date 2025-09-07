"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import MobilePanel from "../_components/MobilePanel";
import DesktopPanel from "../_components/DesktopPanel";

export default function AtomicStructure3D() {
  const presets: Record<
    string,
    {
      protons: number;
      neutrons: number;
      electrons: number;
      symbol: string;
      name: string;
    }
  > = {
    Hydrogen: {
      protons: 1,
      neutrons: 0,
      electrons: 1,
      symbol: "H",
      name: "Hydrogen",
    },
    Helium: {
      protons: 2,
      neutrons: 2,
      electrons: 2,
      symbol: "He",
      name: "Helium",
    },
    Carbon: {
      protons: 6,
      neutrons: 6,
      electrons: 6,
      symbol: "C",
      name: "Carbon",
    },
    Oxygen: {
      protons: 8,
      neutrons: 8,
      electrons: 8,
      symbol: "O",
      name: "Oxygen",
    },
    Neon: {
      protons: 10,
      neutrons: 10,
      electrons: 10,
      symbol: "Ne",
      name: "Neon",
    },
    Sodium: {
      protons: 11,
      neutrons: 12,
      electrons: 11,
      symbol: "Na",
      name: "Sodium",
    },
  };

  const [presetKey, setPresetKey] = useState<keyof typeof presets>("Carbon");
  const [custom, setCustom] = useState(false);
  const [protons, setProtons] = useState(presets[presetKey].protons);
  const [neutrons, setNeutrons] = useState(presets[presetKey].neutrons);
  const [electrons, setElectrons] = useState(presets[presetKey].electrons);

  const onSelectPreset = (k: keyof typeof presets) => {
    setPresetKey(k);
    const p = presets[k];
    setProtons(p.protons);
    setNeutrons(p.neutrons);
    setElectrons(p.electrons);
  };
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 768) {
        setScale(0.7); // smaller on mobile
      } else {
        setScale(0.8);
      }
    };

    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen bg-black/95 overflow-hidden ">
      {/* Overlay UI */}
      <div className="absolute z-10 top-24 md:left-10 max-md:left-0 max-md:right-0 flex justify-center">
        {/* Panel wrapper */}
        <MobilePanel
          presets={presets}
          presetKey={presetKey}
          onSelectPreset={onSelectPreset}
          custom={custom}
          setCustom={setCustom}
          protons={protons}
          setProtons={setProtons}
          neutrons={neutrons}
          setNeutrons={setNeutrons}
          electrons={electrons}
          setElectrons={setElectrons}
        />
        <DesktopPanel
          presets={presets}
          presetKey={presetKey}
          onSelectPreset={onSelectPreset}
          custom={custom}
          setCustom={setCustom}
          protons={protons}
          setProtons={setProtons}
          neutrons={neutrons}
          setNeutrons={setNeutrons}
          electrons={electrons}
          setElectrons={setElectrons}
        />
      </div>

      <Canvas camera={{ position: [0, 3.5, 8], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={80} distance={50} />
        <Stars radius={80} depth={50} count={4000} factor={2} fade />

        <Html position={[0, 3.2, 0]} center wrapperClass="pointer-events-none ">
          <div className="px-3 py-1 text-center mt-44 max-md:mt-72 rounded-full bg-white/20 text-white text-xs border border-white/30">
            {custom
              ? `Custom Atom`
              : `${presets[presetKey].name} (${presets[presetKey].symbol})`}
          </div>
        </Html>
        <group position={[0, 0, 0]} scale={scale}>
          <Nucleus protons={protons} neutrons={neutrons} />
          <ElectronSystem electrons={electrons} />
        </group>

        <gridHelper args={[20, 20, "#222", "#111"]} position={[0, -3, 0]} />
        <OrbitControls enableDamping dampingFactor={0.08} />
      </Canvas>
    </div>
  );
}

// --- Nucleus ---
function Nucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const total = Math.max(1, protons + neutrons);
  const radius = Math.cbrt(total) * 0.25 + 0.6; // grows gently with nucleon count

  // Random but stable positions using a seeded PRNG (seed by counts)
  const seed = useMemo(() => `${protons}-${neutrons}`, [protons, neutrons]);
  const rng = useMemo(() => mulberry32(hashString(seed)), [seed]);

  const protonPositions = useMemo(
    () => packSpheres(protons, radius, rng),
    [protons, radius, rng]
  );
  const neutronPositions = useMemo(
    () => packSpheres(neutrons, radius, rng),
    [neutrons, radius, rng]
  );

  return (
    <group>
      {/* subtle glow */}
      <NucleusGlow radius={radius + 0.25} />

      {/* Protons */}
      {protonPositions.map((p, i) => (
        <mesh key={`p-${i}`} position={p} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            emissive={new THREE.Color("#ff3b30")}
            emissiveIntensity={0.6}
            color={"#b30000"}
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Neutrons */}
      {neutronPositions.map((p, i) => (
        <mesh key={`n-${i}`} position={p} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            emissive={new THREE.Color("#3b82f6")}
            emissiveIntensity={0.5}
            color={"#1e40af"}
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function NucleusGlow({ radius }: { radius: number }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mat.current) mat.current.opacity = 0.1 + 0.06 * Math.sin(t * 2);
  });
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        ref={mat}
        color="#ff5770"
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ElectronSystem({ electrons }: { electrons: number }) {
  // Orbital filling order with capacities
  const orbitalOrder = [
    { shell: 1, cap: 2 },  // 1s
    { shell: 2, cap: 2 },  // 2s
    { shell: 2, cap: 6 },  // 2p
    { shell: 3, cap: 2 },  // 3s
    { shell: 3, cap: 6 },  // 3p
    { shell: 4, cap: 2 },  // 4s
    { shell: 3, cap: 10 }, // 3d
    { shell: 4, cap: 6 },  // 4p
    { shell: 5, cap: 2 },  // 5s
    { shell: 4, cap: 10 }, // 4d
    { shell: 5, cap: 6 },  // 5p
  ];

  // Map shell → how many electrons assigned
  const shellCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let remaining = electrons;

  for (const orb of orbitalOrder) {
    if (remaining <= 0) break;
    const used = Math.min(orb.cap, remaining);
    shellCounts[orb.shell] += used;
    remaining -= used;
  }

  // 🔥 handle exceptions (Cr=24, Cu=29)
  if (electrons === 24) {
    // Chromium: 3d⁵ 4s¹ → 2,8,13,1
    shellCounts[3] = 13;
    shellCounts[4] = 1;
  }
  if (electrons === 29) {
    // Copper: 3d¹⁰ 4s¹ → 2,8,18,1
    shellCounts[3] = 18;
    shellCounts[4] = 1;
  }

  const distribution = [shellCounts[1], shellCounts[2], shellCounts[3], shellCounts[4], shellCounts[5]];
  const shellRadii = [2, 2.7, 3.1, 3.9, 4.5];

  return (
    <group>
      {distribution.map((count, idx) =>
        count > 0 ? (
          <ElectronShell
            key={idx}
            count={count}
            radius={shellRadii[idx]}
            speed={0.2 + idx * 0.12}
          />
        ) : null
      )}
    </group>
  );
}

function ElectronShell({
  count,
  radius,
  speed,
}: {
  count: number;
  radius: number;
  speed: number;
}) {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y = t * speed;
  });

  const electronAngles = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < count; i++) arr.push((i / count) * Math.PI * 2);
    return arr;
  }, [count]);

  // Slight tilt per shell for visual interest
  const tilt = (radius * 0.2) % 0.6;

  return (
    <group ref={group} rotation={[tilt, 0, 0]}>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.01, 16, 200]} />
        <meshBasicMaterial color="#6b7280" opacity={0.6} transparent />
      </mesh>

      {/* Electrons */}
      {electronAngles.map((angle, i) => (
        <Electron key={i} radius={radius} angle={angle} index={i} />
      ))}
    </group>
  );
}

function Electron({
  radius,
  angle,
  index,
}: {
  radius: number;
  angle: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const a = angle + t * (0.8 + (index % 3) * 0.15); // each electron slightly different speed
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;
    const y = Math.sin(a * 0.5) * 0.12; // tiny bobbing
    ref.current.position.set(x, y, z);
  });
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.5}
        metalness={0.1}
        roughness={0.3}
      />
    </mesh>
  );
}

// --- helpers ---
function packSpheres(count: number, radius: number, rng: () => number) {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    // random point inside a sphere using rejection sampling
    let x = 0,
      y = 0,
      z = 0;
    do {
      x = rng() * 2 - 1;
      y = rng() * 2 - 1;
      z = rng() * 2 - 1;
    } while (x * x + y * y + z * z > 1);
    const r = radius * Math.cbrt(rng());
    positions.push([x * r, y * r, z * r]);
  }
  return positions;
}

function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
