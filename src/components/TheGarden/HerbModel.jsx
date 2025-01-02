import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';

export const HerbModel = ({ position, herbName, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useRef();

  const spring = useSpring({
    scale: hovered ? 1.2 : 1,
    color: hovered ? '#10b981' : '#064e3b',
  });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.position.x = position[0] * Math.cos(t) - position[2] * Math.sin(t);
    groupRef.current.position.z = position[0] * Math.sin(t) + position[2] * Math.cos(t);
  });

  return (
    <group ref={groupRef}>
      <animated.mesh
        scale={spring.scale}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <animated.meshStandardMaterial color={spring.color} />
      </animated.mesh>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {herbName}
      </Text>
    </group>
  );
};