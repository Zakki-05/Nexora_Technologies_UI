'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { GraphicsQuality } from '@/components/three/quality/useGraphicsQuality';

interface CoreSceneProps {
  quality: Exclude<GraphicsQuality, 'static'>;
  paused: boolean;
}

function IntelligenceCoreMesh({ quality, paused }: CoreSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  const nodeCount = quality === 'high' ? 42 : quality === 'balanced' ? 24 : 12;

  const nodePositions = useMemo(() => {
    const arr: Array<[number, number, number]> = [];
    for (let i = 0; i < nodeCount; i += 1) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.05 + (i % 3) * 0.25;
      arr.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return arr;
  }, [nodeCount]);

  useEffect(() => {
    if (!nodesRef.current) return;
    const dummy = new THREE.Object3D();
    nodePositions.forEach(([x, y, z], idx) => {
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(idx % 3 === 0 ? 1.25 : 0.85);
      dummy.updateMatrix();
      nodesRef.current?.setMatrixAt(idx, dummy.matrix);
    });
    nodesRef.current.instanceMatrix.needsUpdate = true;
  }, [nodePositions]);

  useFrame((state, delta) => {
    if (paused) return;
    const speed = quality === 'low' ? 0.35 : 0.65;
    const dt = Math.min(delta, 0.05) * speed;

    if (coreRef.current) {
      coreRef.current.rotation.y += dt * 0.8;
      coreRef.current.rotation.x += dt * 0.3;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += dt * 0.55;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= dt * 0.42;
    if (ring3Ref.current) ring3Ref.current.rotation.y += dt * 0.35;

    if (groupRef.current) {
      const targetX = state.pointer.y * 0.18;
      const targetY = state.pointer.x * 0.24;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.06);
    }
  });

  const torusSegments = quality === 'high' ? 96 : quality === 'balanced' ? 64 : 36;

  return (
    <group ref={groupRef}>
      {/* Central Metallic-Glass Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.92, quality === 'high' ? 2 : 1]} />
        <meshStandardMaterial
          color="#1E3A8A"
          emissive="#3B82F6"
          emissiveIntensity={0.45}
          metalness={0.85}
          roughness={0.18}
          wireframe={quality === 'low'}
        />
      </mesh>

      {/* Inner Glowing Wireframe Shell */}
      <mesh scale={1.14}>
        <icosahedronGeometry args={[0.92, 1]} />
        <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.28} />
      </mesh>

      {/* Orbital Ring 1 */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3.2, 0.35, 0]}>
        <torusGeometry args={[1.65, 0.018, 12, torusSegments]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#3B82F6"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Orbital Ring 2 */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3.6, -0.45, 0.3]}>
        <torusGeometry args={[2.0, 0.015, 12, torusSegments]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.55}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Orbital Ring 3 */}
      {quality !== 'low' && (
        <mesh ref={ring3Ref} rotation={[Math.PI / 2.2, 0.8, 0]}>
          <torusGeometry args={[2.32, 0.012, 10, torusSegments]} />
          <meshStandardMaterial
            color="#22D3EE"
            emissive="#22D3EE"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}

      {/* Instanced Workforce Nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[0.042, 10, 10]} />
        <meshStandardMaterial
          color="#22D3EE"
          emissive="#3B82F6"
          emissiveIntensity={0.85}
          roughness={0.2}
        />
      </instancedMesh>
    </group>
  );
}

export default function NexoraIntelligenceCore({ quality, paused }: CoreSceneProps) {
  const dpr: [number, number] =
    quality === 'high' ? [1, 2] : quality === 'balanced' ? [1, 1.5] : [0.75, 1];

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      gl={{ antialias: quality !== 'low', alpha: true, powerPreference: 'high-performance' }}
      frameloop={paused ? 'never' : 'always'}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 5]} intensity={1.4} color="#60A5FA" />
      <pointLight position={[-4, -3, 3]} intensity={1.1} color="#8B5CF6" />
      <pointLight position={[0, 4, -3]} intensity={0.9} color="#22D3EE" />
      <IntelligenceCoreMesh quality={quality} paused={paused} />
    </Canvas>
  );
}
