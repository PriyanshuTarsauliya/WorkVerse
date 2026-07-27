'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, TorusKnot, Sphere, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Inner Interactive Glass Mesh with Mouse Parallax
function InteractiveGlassShape() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Access current mouse coordinates from R3F state
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth rotation
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.4;

    // Mouse Parallax Lerp math
    const targetX = (state.pointer.x * Math.PI) / 6;
    const targetY = (state.pointer.y * Math.PI) / 6;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX + state.clock.elapsedTime * 0.2, 0.08);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.08);
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <group>
        {/* Core Glowing Torus Knot Shape */}
        <TorusKnot
          ref={meshRef}
          args={[1.2, 0.38, 128, 32]}
          scale={hovered ? 1.12 : 1.0}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Glassmorphism Physical Shader Material */}
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={0.92}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
            ior={1.4}
            chromaticAberration={0.08}
            anisotropy={0.2}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color={hovered ? '#38BDF8' : '#6366F1'}
          />
        </TorusKnot>

        {/* Inner Emissive Tech Core */}
        <Sphere args={[0.5, 32, 32]}>
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#38BDF8"
            emissiveIntensity={hovered ? 3.0 : 1.5}
            roughness={0.1}
          />
        </Sphere>
      </group>
    </Float>
  );
}

// Background Floating Particle Field
function ParticleField() {
  return (
    <>
      <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />
      <Sparkles count={80} scale={10} size={3} speed={0.4} opacity={0.6} color="#38BDF8" />
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-[580px] md:h-[680px] bg-slate-950 overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />

      {/* Hero HTML Content Overlay (Non-blocking with pointer-events-none) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-16 max-w-3xl pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider w-fit backdrop-blur-md mb-6 shadow-lg shadow-cyan-500/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Next-Gen Tech Jobs Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Discover High-Impact <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
            3D & Engineering Roles
          </span>
        </h1>

        <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed max-w-xl">
          Explore roles at world-class robotics, WebGL, AI, and full-stack engineering labs with real-time 3D visual hub tracking.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 pointer-events-auto">
          <a
            href="#jobs-section"
            className="px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-400/20 transition duration-200 active:scale-95 flex items-center gap-2"
          >
            Explore Tech Jobs ↓
          </a>
          <a
            href="#post-job"
            className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-extrabold text-sm transition duration-200 backdrop-blur-md active:scale-95"
          >
            Post a Role +
          </a>
        </div>
      </div>

      {/* R3F WebGL 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#38BDF8" />
        <pointLight position={[5, -5, 5]} intensity={0.8} color="#6366F1" />

        <ParticleField />
        <InteractiveGlassShape />
      </Canvas>
    </div>
  );
}
