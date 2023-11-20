"use client";
import { useGLTF } from "@react-three/drei";
import React from "react";
const Plane = ({ isRotating, ...props }) => {
  const { scene, aninations } = useGLTF("assets/3d/plane.glb");
  return (
    <mesh {...props}>
      <primitive object={scene} />
    </mesh>
  );
};

export default Plane;
