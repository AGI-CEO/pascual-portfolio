/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: Henrique Naspolini (https://sketchfab.com/henriquedw)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/xeno-raven-e444a88e999549d99eacb1ea0f8e04e4
Title: Xeno Raven
*/
"use client";
import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { a } from "@react-spring/three";

const Alien = (props) => {
  const alienRef = useRef();
  const { nodes, materials } = useGLTF("models/xeno_raven.glb");
  return (
    <>
      <a.group ref={alienRef} {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["body_07_-_Default_0"].geometry}
          material={materials["07_-_Default"]}
          position={[0, -6.43225193, -2.8e-7]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.head_default_0.geometry}
          material={materials["default"]}
          position={[0, -6.43225193, -2.8e-7]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </a.group>
    </>
  );
};

export default Alien;
