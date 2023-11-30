"use client";
import { useGLTF, useAnimations } from "@react-three/drei";
import React, { useEffect, useRef } from "react";

const Plane = ({ isRotating, ...props }) => {
  const group = useRef();
  const { scene, nodes, materials, animations } = useGLTF(
    "assets/3d/dragon_flying.glb"
  );
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (isRotating) {
      actions["Object_0"].paused = false;
      actions["Object_0"].play();
    } else {
      actions["Object_0"].paused = true;
    }
  }, [actions, isRotating]);

  return (
    <mesh {...props} ref={group}>
      <primitive object={scene} />
    </mesh>
  );
};

export default Plane;
