"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, MeshReflectorMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const START_X = -6;
const SPOT_X = 1.2;
const CAR_Y = 0.32;

const BRAND = "#6d5cff";
const BRAND_2 = "#00d1b2";

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 3.5, 8], fov: 38 }}
      shadows
      className="!block"
    >
      <color attach="background" args={["#05060c"]} />
      <fog attach="fog" args={["#05060c", 12, 24]} />

      <ambientLight intensity={0.25} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={0.5}
        color="#e9ecff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 2.5, 3]} intensity={20} color={BRAND} distance={14} decay={2} />
      <pointLight position={[5, 2.5, 3]} intensity={20} color={BRAND_2} distance={14} decay={2} />

      <Floor />
      <ParkingSpot />
      <Car />
    </Canvas>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        mirror={0.4}
        blur={[320, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={1.3}
        roughness={0.85}
        color="#070a14"
        metalness={0.4}
      />
    </mesh>
  );
}

function ParkingSpot() {
  const outlinePoints = useMemo(() => {
    const w = 0.95;
    const h = 1.55;
    return new Float32Array([
      -w, 0.015, -h,
      w, 0.015, -h,
      w, 0.015, h,
      -w, 0.015, h,
      -w, 0.015, -h,
    ]);
  }, []);

  return (
    <group position={[SPOT_X, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <planeGeometry args={[1.9, 3.1]} />
        <meshStandardMaterial
          color="#0a1026"
          emissive={BRAND_2}
          emissiveIntensity={0.18}
          roughness={0.7}
        />
      </mesh>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[outlinePoints, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={BRAND_2} transparent opacity={0.9} />
      </line>
    </group>
  );
}

function Car() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const CYCLE = 5.2;
    const t = (clock.elapsedTime % CYCLE) / CYCLE;

    let x: number;
    let scale: number;

    if (t < 0.06) {
      x = START_X;
      scale = t / 0.06;
    } else if (t < 0.62) {
      const p = (t - 0.06) / 0.56;
      x = START_X + (SPOT_X - START_X) * easeInOut(p);
      scale = 1;
    } else if (t < 0.9) {
      x = SPOT_X;
      scale = 1;
    } else {
      x = SPOT_X;
      scale = 1 - (t - 0.9) / 0.1;
    }

    ref.current.position.set(x, CAR_Y, 0);
    ref.current.scale.setScalar(Math.max(0, scale));
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[1.15, 0.3, 0.52]} />
        <meshPhysicalMaterial
          color="#eef1ff"
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive={BRAND}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh castShadow position={[0.5, 0, 0]}>
        <boxGeometry args={[0.18, 0.26, 0.48]} />
        <meshPhysicalMaterial
          color="#dfe4ff"
          metalness={0.9}
          roughness={0.15}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[-0.08, 0.26, 0]}>
        <boxGeometry args={[0.62, 0.22, 0.44]} />
        <meshPhysicalMaterial
          color="#0a0f22"
          metalness={0.6}
          roughness={0.08}
          transmission={0.35}
          clearcoat={1}
        />
      </mesh>
      {[0.22, -0.22].map((z, i) => (
        <mesh key={i} position={[0.6, 0.04, z]}>
          <sphereGeometry args={[0.06, 14, 14]} />
          <meshBasicMaterial color="#fff6c8" />
        </mesh>
      ))}
      <pointLight position={[0.78, 0.1, 0]} intensity={6} color="#fef3c7" distance={3.5} decay={2} />
      {[0.2, -0.2].map((z, i) => (
        <mesh key={i} position={[-0.58, 0.02, z]}>
          <boxGeometry args={[0.04, 0.08, 0.08]} />
          <meshBasicMaterial color="#ff3855" />
        </mesh>
      ))}
      {[
        [0.36, -0.17, 0.27],
        [-0.36, -0.17, 0.27],
        [0.36, -0.17, -0.27],
        [-0.36, -0.17, -0.27],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.11, 0.11, 0.1, 18]} />
          <meshStandardMaterial color="#0a0d16" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <ContactShadows
        position={[0, -0.18, 0]}
        opacity={0.45}
        scale={3}
        blur={2.2}
        far={1.4}
      />
    </group>
  );
}
