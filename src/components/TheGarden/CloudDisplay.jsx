'use client';

import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Cloud, Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { HerbModal } from "./HerbModal";
import { herbs } from "../../data/herbs2";
import { plantsDatabase } from "../../data/plants";
import Link from "next/link";

const RevolvingPlant = ({ model, position, onClick, herb, name }) => {
  const groupRef = useRef();
  const { scene } = useLoader(GLTFLoader, model, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.5;
    groupRef.current.position.x =
      position[0] * Math.cos(t) - position[2] * Math.sin(t);
    groupRef.current.position.z =
      position[0] * Math.sin(t) + position[2] * Math.cos(t);
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        position={[0, 2, 0]}
        onClick={onClick}
        scale={[1.5, 1.5, 1.5]}
      />
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

export const CloudDisplay = () => {
  const [selectedHerb, setSelectedHerb] = useState(null);
  const topPlants = plantsDatabase.filter((plant) =>
    [1, 2, 3, 4, 5].includes(plant.id)
  );

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-[rgba(56,79,1,255)] to-[rgba(217,235,252,255)]">
      <Canvas camera={{ position: [0, 5, 8], fov: 75 }}>
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <Cloud position={[-4, 2, 0]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, 2, -2]} speed={0.1} opacity={0.3} />

          {topPlants.map((plant) => {
            const herb = herbs.find(
              (h) => h.name.toLowerCase() === plant.name.toLowerCase()
            );
            return (
              <RevolvingPlant
                key={plant.id}
                model={plant.model}
                position={plant.position2}
                onClick={() => setSelectedHerb(herb)}
                herb={herb}
                name={plant.name}
              />
            );
          })}

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
          />
        </Suspense>
      </Canvas>

      {selectedHerb && (
        <HerbModal
          isOpen={true}
          onClose={() => setSelectedHerb(null)}
          herb={selectedHerb}
        />
      )}
      <Link href="/Garden">
        <button>Explore</button>
      </Link>
    </div>
  );
};

export default CloudDisplay;
