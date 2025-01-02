'use client';

import * as THREE from 'three';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { plantsDatabase } from '../data/plants';
import GrassScene from "./GrassScene";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { HerbModal } from './HerbModal';
import { herbs } from '../data/herbs2';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { Leaf, BookOpen, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'; // Import Chevron icons

const Plant = ({ model, position, onClick, isGlowing, onPointerOver, onPointerOut, name }) => {
  const { scene } = useLoader(GLTFLoader, model, loader => {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/gh/pmdrs/drei-assets/basis/');
    loader.setKTX2Loader(ktx2Loader);
    
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);

    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  useEffect(() => {
    if (scene) {
      if (isGlowing) {
        scene.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0x00ff00);
            child.material.emissiveIntensity = 0.05;
          }
        });
      } else {
        scene.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0x00ff00);
            child.material.emissiveIntensity = 0;
          }
        });
      }
    }
  }, [isGlowing, scene]);

  return scene ? (
    <group>
      <primitive
        object={scene}
        position={position}
        scale={[10.5, 10.5, 10.5]}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
      {isGlowing && (
        <Html position={[position[0], position[1] + 10, position[2]]} scaleFactor={10}>
          <div style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '5px 10px', borderRadius: '5px' }}>
            {name}
          </div>
        </Html>
      )}
    </group>
  ) : null;
};

// const Pot = ({ model, position, scale }) => {
//   const { scene } = useGLTF(model);
//   return <primitive object={scene} position={position} scale={scale}/>;
// };

const GardenEnvironment = () => {
  const texture = useLoader(EXRLoader, 'models/envi.exr');
  // random try switching true false
  useEffect(() => {
    texture.flipY = false;
    texture.needsUpdate = true;
  }, [texture]);
  return (
    <>
      <mesh scale={[0.7, 0.7, 0.7]} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        {/* Sphere geometry to act as the environment */}
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.BackSide} // Render inside of the sphere
        />
      </mesh>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
    </>
  );
};

const Sidebar = ({ herbs, onHerbClick, onSearch, onClear, showClear }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  const filteredHerbs = herbs.filter(herb =>
    herb.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-900 shadow-2xl z-50 overflow-hidden">
      <div className="bg-emerald-600 p-4 flex items-center space-x-3 border-b border-emerald-500 shadow-md">
        <Leaf className="text-white w-8 h-8" />
        <h2 className="text-2xl font-bold text-white">Herbal Guide</h2>
      </div>
      
      <div className="p-4 border-b border-emerald-700">
        <div className="flex items-center bg-emerald-800 rounded-lg px-3 py-2 space-x-2">
          <Search className="text-emerald-300 w-5 h-5" />
          <input 
            type="text" 
            value={inputValue}
            placeholder="Find an herb..." 
            className="bg-transparent text-white placeholder-emerald-300 w-full focus:outline-none"
            onChange={handleInputChange}
          />
          {showClear && (
            <X
              className="text-emerald-300 w-5 h-5 cursor-pointer"
              onClick={handleClear}
            />
          )}
        </div>
      </div>
      
      <ul className="overflow-y-auto h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-emerald-700">
        {filteredHerbs.map((herb) => (
          <li 
            key={herb.id} 
            className="
              px-4 py-3 
              border-b border-emerald-700 
              hover:bg-emerald-600 
              transition-colors duration-200 
              cursor-pointer 
              group
              flex items-center
              space-x-3
            "
            onClick={() => onHerbClick(herb)}
          >
            <BookOpen 
              className="
                text-emerald-300 
                w-5 h-5 
                group-hover:text-white 
                transition-colors 
                duration-200
              "
            />
            <span className="text-emerald-100 group-hover:text-white font-medium">
              {herb.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Garden = () => {
  const [displayedPlants, setDisplayedPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedPlant, setFocusedPlant] = useState(null);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Add state for sidebar visibility
  const [hoveredPlant, setHoveredPlant] = useState(null); // Add state for hovered plant
  const controlsRef = useRef();

  useEffect(() => {
    // Select 5 random plants initially
    const randomPlants = [...plantsDatabase]
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);
    setDisplayedPlants(randomPlants);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      const searchResult = plantsDatabase.find(
        plant => plant.name.toLowerCase().includes(term.toLowerCase())
      );
      if (searchResult) {
        if (!displayedPlants.find(p => p.id === searchResult.id)) {
          setDisplayedPlants([...displayedPlants, searchResult]);
        }
        setFocusedPlant(searchResult);
        // Zoom to plant position
        controlsRef.current?.target.set(...searchResult.position);
        controlsRef.current?.object.position.set(
          searchResult.position[0] + 20,
          searchResult.position[1] + 20,
          searchResult.position[2] + 20
        );
      }
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFocusedPlant(null);
    // Reset camera position
    controlsRef.current?.reset();
  };

  const handlePlantClick = (plant) => {
    setFocusedPlant(plant);
    const herb = herbs.find(h => h.name.toLowerCase() === plant.name.toLowerCase());
    setSelectedHerb(herb);
  };

  const handleHerbClick = (herb) => {
    setSelectedHerb(herb);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      {isSidebarVisible && (
        <Sidebar 
          herbs={herbs} 
          onHerbClick={handleHerbClick} 
          onSearch={handleSearch} 
          onClear={handleClear} 
          showClear={!!focusedPlant} 
        />
      )}
      <button 
        onClick={() => setIsSidebarVisible(!isSidebarVisible)} 
        style={{
          position: 'fixed',
          top: '50%',
          left: isSidebarVisible ? '16rem' : '0', // Adjust position based on sidebar visibility
          transform: 'translateY(-50%)',
          zIndex: 100,
          backgroundColor: 'emerald-700',
          color: 'white',
          padding: '0.5rem',
          borderRadius: '0 0.5rem 0.5rem 0',
          cursor: 'pointer'
        }}
      >
        {isSidebarVisible ? <ChevronLeft /> : <ChevronRight />}
      </button>
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [100, 100, 100], fov: 60 }}>
          <Suspense fallback={null}>
            <GardenEnvironment />
            <OrbitControls 
              ref={controlsRef} 
              minDistance={50} 
              maxDistance={150} 
              maxPolarAngle={(Math.PI / 2 - 0.1)} 
            />
            <GrassScene /> {/* Ensure GrassScene is rendered only once */}
            {/* Permanent decorative elements */}
            <mesh position={[5, 0, 5]} scale={[1, 1, 1]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="gray" /> {/* Placeholder for rock */}
            </mesh>
            
            {/* <Pot model="/models/pot.glb" position={[-100, 0, -5]} scale={[20, 20, 50]} /> Replaced placeholder pot */}

            {displayedPlants.map((plant) => (
              <Plant
                key={plant.id}
                model={plant.model}
                position={plant.position}
                onClick={() => handlePlantClick(plant)}
                isGlowing={hoveredPlant && hoveredPlant.id === plant.id}
                onPointerOver={() => setHoveredPlant(plant)}
                onPointerOut={() => setHoveredPlant(null)}
                name={plant.name}
              />
            ))}
          </Suspense>
        </Canvas>
        {selectedHerb && (
          <HerbModal
            isOpen={true}
            onClose={() => setSelectedHerb(null)}
            herb={selectedHerb}
          />
        )}
      </div>
    </div>
  );
};

export default Garden;