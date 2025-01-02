import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const GrassScene = () => {
  const grassModel = useLoader(GLTFLoader, "models/ground.glb", loader => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  const birchModel = useLoader(GLTFLoader, "models/birch.glb", loader => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  const rockModel = useLoader(GLTFLoader, "models/rock.glb", loader => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  // Function to generate random positions, scales, and rotations
  const generateGrass = () => {
    const grassInstances = [];
    const grassCount = 1200; // Increase the count for denser grass

    for (let i = 0; i < grassCount; i++) {
      grassInstances.push({
        position: [
          (Math.random() - 0.5) * 400, // Random X position within [-200, 200]
          0, // Keep on the ground
          (Math.random() - 0.5) * 400, // Random Z position within [-200, 200]
        ],
        scale: [1.5, 0.9, 1.5], // Keep the original proportions
        rotation: Math.random() * Math.PI * 2, // Random Y rotation
      });
    }
    return grassInstances;
  };

  // Function to generate random positions, scales, and rotations
  const generateTree = () => {
    const tInstances = [];
    const tCount = 15; // Increase the count for denser grass

    for (let i = 0; i < tCount; i++) {
      tInstances.push({
        position: [
          (Math.random() - 0.5) * 400,
          0, // Keep on the ground
          (Math.random() - 0.5) * 400,
        ],
        scale: [15, 15, 15], // Keep the original proportions
        rotation: Math.random() * Math.PI * 2, // Random Y rotation
      });
    }
    return tInstances;
  };

  // Function to generate random positions, scales, and rotations for rocks
  const generateRocks = () => {
    const rockInstances = [];
    const rockCount = 400; // Number of rocks to generate
    const perimeterDistance = 200; // Distance from the center to place rocks on the perimeter

    for (let i = 0; i < rockCount; i++) {
      const isXPerimeter = Math.random() < 0.5;
      const positionX = isXPerimeter ? (Math.random() < 0.5 ? -perimeterDistance : perimeterDistance) : (Math.random() - 0.5) * 400;
      const positionZ = !isXPerimeter ? (Math.random() < 0.5 ? -perimeterDistance : perimeterDistance) : (Math.random() - 0.5) * 400;

      rockInstances.push({
        position: [positionX, 0, positionZ],
        scale: [9, 9, 9], // Adjust scale as needed
        rotation: Math.random() * Math.PI * 2, // Random Y rotation
      });
    }
    return rockInstances;
  };

  const grassInstances = useMemo(generateGrass, []);
  const birchInstances = useMemo(generateTree, []);
  const rockInstances = useMemo(generateRocks, []);

  return (
    <>
      {/* Render all grass instances */}
      {grassInstances.map((instance, index) => (
        <primitive
          key={index}
          object={grassModel.scene.clone()}
          position={instance.position}
          scale={instance.scale}
          rotation={[0, instance.rotation, 0]}
        />
      ))}
      {/* Render all birch instances */}
      {birchInstances.map((instance, index) => (
        <primitive
          key={index}
          object={birchModel.scene.clone()}
          position={instance.position}
          scale={instance.scale}
          rotation={[0, instance.rotation, 0]}
        />
      ))}
      {/* Render all rock instances */}
      {rockInstances.map((instance, index) => (
        <primitive
          key={index}
          object={rockModel.scene.clone()}
          position={instance.position}
          scale={instance.scale}
          rotation={[0, instance.rotation, 0]}
        />
      ))}
    </>
  );
};

export default GrassScene;