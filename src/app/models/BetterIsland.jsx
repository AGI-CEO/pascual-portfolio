"use client";
import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { a } from "@react-spring/three";

const Island = ({ isRotating, setIsRotating, setCurrentStage, ...props }) => {
  const group = useRef();
  const { gl, viewport } = useThree();

  const { nodes, materials, animations } = useGLTF(
    "assets/3d/treasure_island.glb"
  );
  const { actions } = useAnimations(animations, group);

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95;

  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the island's rotation based on the mouse/touch movement
      group.current.rotation.y += delta * 0.01 * Math.PI;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      group.current.rotation.y += 0.001 * Math.PI;
      rotationSpeed.current = 0.0125;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      group.current.rotation.y -= 0.001 * Math.PI;
      rotationSpeed.current = -0.0125;
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  useFrame(() => {
    if (!isRotating) {
      const speed = Math.abs(rotationSpeed.current) * dampingFactor;

      rotationSpeed.current = Math.sign(rotationSpeed.current) * speed;

      if (rotationSpeed.current > 0.001) {
        rotationSpeed.current *= dampingFactor;

        if (Math.abs(rotationSpeed.current) < 0.001) {
          rotationSpeed.current = 0;
        }

        group.current.rotation.y += rotationSpeed.current;
      } else {
        // When rotating, determine the current stage based on island's orientation
        const rotation = group.current.rotation.y;

        const normalizedRotation =
          ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

        // Set the current stage based on the island's orientation
        switch (true) {
          case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
            setCurrentStage(4);
            break;
          case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
            setCurrentStage(3);
            break;
          case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
            setCurrentStage(2);
            break;
          case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
            setCurrentStage(1);
            break;
          default:
            setCurrentStage(null);
        }
      }
    }
  });
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("touchstart", handlePointerDown, {
      passive: false,
    });
    canvas.addEventListener("touchend", handlePointerUp, { passive: false });
    canvas.addEventListener("touchmove", handlePointerMove, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Play the animation
    console.log(actions);

    actions["Scene"].play();

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("touchstart", handlePointerDown);
      canvas.removeEventListener("touchend", handlePointerUp);
      canvas.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="93f504eef39b4fe08a8ff84cecc61f17fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="island_landmass"
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <mesh
                    name="island_landmass_island_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.island_landmass_island_0.geometry}
                    material={materials.island}
                  />
                </group>
                <group
                  name="ocean"
                  position={[0, 3, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                />
                <group
                  name="large_rock_"
                  position={[0, -9.428, 0]}
                  rotation={[-1.419, 0, 0.543]}
                  scale={15.213}
                >
                  <mesh
                    name="large_rock__large_rock_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.large_rock__large_rock_0.geometry}
                    material={materials.large_rock}
                  />
                </group>
                <group
                  name="small_rock"
                  position={[64.054, 11.217, -43.146]}
                  rotation={[-1.303, 0.108, 2.894]}
                  scale={[5.866, 5.841, 2.759]}
                >
                  <mesh
                    name="small_rock_small_rock_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.small_rock_small_rock_0.geometry}
                    material={materials.small_rock}
                  />
                </group>
                <group
                  name="plank"
                  position={[41.522, -27.113, 23.913]}
                  rotation={[-1.413, 0.2, 0.895]}
                  scale={[5.377, 1.644, 5.377]}
                >
                  <mesh
                    name="plank_plank_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.plank_plank_0.geometry}
                    material={materials.plank}
                  />
                </group>
                <group
                  name="barrel"
                  position={[49.274, 6.763, 53.87]}
                  rotation={[Math.PI, 0.616, Math.PI / 2]}
                  scale={100}
                />
                <group
                  name="bottle"
                  position={[52.822, -38.492, 42.798]}
                  rotation={[-1.533, -0.138, -0.037]}
                  scale={4.538}
                >
                  <mesh
                    name="bottle_bottle_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bottle_bottle_0.geometry}
                    material={materials.bottle}
                  />
                </group>
                <group
                  name="PEARL_OYSTER"
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                />
                <group
                  name="hermit_crab"
                  rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                  scale={100}
                />
                <group
                  name="treasure_chest"
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                />
                <group
                  name="large_rock_001"
                  position={[-21.894, -32.84, 28.124]}
                  rotation={[-1.672, -0.114, 1.055]}
                  scale={8.826}
                >
                  <mesh
                    name="large_rock_001_large_rock_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.large_rock_001_large_rock_0.geometry}
                    material={materials.large_rock}
                  />
                </group>
                <group
                  name="small_rock003"
                  position={[52.738, 12.321, -48.038]}
                  rotation={[-1.704, 0.071, -0.578]}
                  scale={[2.708, 2.697, 1.274]}
                >
                  <mesh
                    name="small_rock003_small_rock_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.small_rock003_small_rock_0.geometry}
                    material={materials.small_rock}
                  />
                </group>
                <group
                  name="small_rock001"
                  position={[14.559, 11.963, -69.825]}
                  rotation={[-1.457, 0.265, -2.604]}
                  scale={[4.58, 4.56, 2.154]}
                >
                  <mesh
                    name="small_rock001_small_rock_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.small_rock001_small_rock_0.geometry}
                    material={materials.small_rock}
                  />
                </group>
                <group
                  name="small_rock002"
                  position={[-1.056, 14.408, -73.65]}
                  rotation={[-1.704, 0.071, -0.578]}
                  scale={[2.115, 2.106, 0.995]}
                >
                  <mesh
                    name="small_rock002_small_rock_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.small_rock002_small_rock_0.geometry}
                    material={materials.small_rock}
                  />
                </group>
                <group
                  name="small_rock004"
                  position={[52.128, 10.151, -39.13]}
                  rotation={[-1.704, 0.071, -0.578]}
                  scale={[0.982, 0.977, 0.462]}
                >
                  <mesh
                    name="small_rock004_small_rock_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.small_rock004_small_rock_0.geometry}
                    material={materials.small_rock}
                  />
                </group>
                <group
                  name="palm_tree"
                  position={[60.297, 12.403, -59.48]}
                  rotation={[-Math.PI / 2, 0.529, 0]}
                  scale={22.417}
                />
                <group
                  name="palm_tree002"
                  position={[6.212, 12.403, -79.538]}
                  rotation={[-2.046, -0.241, 2.006]}
                  scale={22.417}
                />
                <group
                  name="seaweed"
                  position={[-17.364, -41.545, 54.083]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                />
                <group
                  name="seaweed001"
                  position={[2.613, -32.339, 36.627]}
                  rotation={[-Math.PI / 2, 0, 0.987]}
                  scale={63.668}
                />
                <group
                  name="seaweed002"
                  position={[17.221, -36.751, 66.084]}
                  rotation={[-Math.PI / 2, 0, 2.548]}
                  scale={82.895}
                />
                <group
                  name="barrel_armature"
                  position={[49.274, 6.763, 53.87]}
                  rotation={[Math.PI, 0.616, Math.PI / 2]}
                  scale={6.375}
                >
                  <group name="Object_35">
                    <primitive object={nodes._rootJoint} />
                    <skinnedMesh
                      name="Object_38"
                      geometry={nodes.Object_38.geometry}
                      material={materials.barrel}
                      skeleton={nodes.Object_38.skeleton}
                    />
                    <group
                      name="Object_37"
                      position={[49.274, 6.763, 53.87]}
                      rotation={[Math.PI, 0.616, Math.PI / 2]}
                      scale={100}
                    />
                  </group>
                </group>
                <group
                  name="chest_armature"
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <group name="Object_41">
                    <primitive object={nodes._rootJoint_1} />
                    <skinnedMesh
                      name="Object_44"
                      geometry={nodes.Object_44.geometry}
                      material={materials.cheast}
                      skeleton={nodes.Object_44.skeleton}
                    />
                    <skinnedMesh
                      name="Object_45"
                      geometry={nodes.Object_45.geometry}
                      material={materials.gems}
                      skeleton={nodes.Object_45.skeleton}
                    />
                    <skinnedMesh
                      name="Object_46"
                      geometry={nodes.Object_46.geometry}
                      material={materials.coin_volume}
                      skeleton={nodes.Object_46.skeleton}
                    />
                    <skinnedMesh
                      name="Object_47"
                      geometry={nodes.Object_47.geometry}
                      material={materials.material}
                      skeleton={nodes.Object_47.skeleton}
                    />
                    <skinnedMesh
                      name="Object_48"
                      geometry={nodes.Object_48.geometry}
                      material={materials.individual_coins}
                      skeleton={nodes.Object_48.skeleton}
                    />
                    <skinnedMesh
                      name="Object_49"
                      geometry={nodes.Object_49.geometry}
                      material={materials.staff_base}
                      skeleton={nodes.Object_49.skeleton}
                    />
                    <group
                      name="Object_43"
                      rotation={[-Math.PI / 2, 0, 0]}
                      scale={100}
                    />
                  </group>
                </group>
                <group
                  name="oyster_armature"
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <group name="Object_55">
                    <primitive object={nodes._rootJoint_2} />
                    <skinnedMesh
                      name="Object_58"
                      geometry={nodes.Object_58.geometry}
                      material={materials.oyster}
                      skeleton={nodes.Object_58.skeleton}
                    />
                    <group
                      name="Object_57"
                      rotation={[-Math.PI / 2, 0, 0]}
                      scale={100}
                    />
                  </group>
                </group>
                <group
                  name="seaweed_armature"
                  position={[-17.364, -41.545, 54.083]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <group name="Object_62">
                    <primitive object={nodes._rootJoint_3} />
                    <skinnedMesh
                      name="Object_65"
                      geometry={nodes.Object_65.geometry}
                      material={materials.seaweed}
                      skeleton={nodes.Object_65.skeleton}
                    />
                    <group
                      name="Object_64"
                      position={[-17.364, -41.545, 54.083]}
                      rotation={[-Math.PI / 2, 0, 0]}
                      scale={100}
                    />
                  </group>
                </group>
                <group
                  name="ocean_armature"
                  position={[0, 3, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <group name="Object_92">
                    <primitive object={nodes._rootJoint_4} />
                    <skinnedMesh
                      name="Object_95"
                      geometry={nodes.Object_95.geometry}
                      material={materials.ocean}
                      skeleton={nodes.Object_95.skeleton}
                    />
                    <group
                      name="Object_94"
                      position={[0, 3, 0]}
                      rotation={[-Math.PI / 2, 0, 0]}
                      scale={100}
                    />
                  </group>
                </group>
                <group
                  name="palm_tree_armature"
                  position={[60.297, 12.403, -59.48]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <group name="Object_135">
                    <primitive object={nodes._rootJoint_5} />
                    <skinnedMesh
                      name="Object_138"
                      geometry={nodes.Object_138.geometry}
                      material={materials.palm_tree}
                      skeleton={nodes.Object_138.skeleton}
                    />
                    <skinnedMesh
                      name="Object_139"
                      geometry={nodes.Object_139.geometry}
                      material={materials.palm_tree_leaves}
                      skeleton={nodes.Object_139.skeleton}
                    />
                    <group
                      name="Object_137"
                      position={[60.297, 12.403, -59.48]}
                      rotation={[-Math.PI / 2, 0.529, 0]}
                      scale={22.417}
                    />
                  </group>
                </group>
                <group
                  name="hermit_crab_armature"
                  rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                  scale={100}
                >
                  <group name="Object_252">
                    <primitive object={nodes._rootJoint_6} />
                    <skinnedMesh
                      name="Object_255"
                      geometry={nodes.Object_255.geometry}
                      material={materials.hermit_crab}
                      skeleton={nodes.Object_255.skeleton}
                    />
                    <group
                      name="Object_254"
                      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                      scale={100}
                    />
                  </group>
                </group>
                <group
                  name="palm_tree_armature002"
                  position={[6.212, 12.403, -79.538]}
                  rotation={[-Math.PI / 2, 0, 2.064]}
                  scale={100}
                >
                  <group name="Object_327">
                    <primitive object={nodes._rootJoint_7} />
                    <skinnedMesh
                      name="Object_330"
                      geometry={nodes.Object_330.geometry}
                      material={materials.palm_tree}
                      skeleton={nodes.Object_330.skeleton}
                    />
                    <skinnedMesh
                      name="Object_331"
                      geometry={nodes.Object_331.geometry}
                      material={materials.palm_tree_leaves}
                      skeleton={nodes.Object_331.skeleton}
                    />
                    <group
                      name="Object_329"
                      position={[6.212, 12.403, -79.538]}
                      rotation={[-2.046, -0.241, 2.006]}
                      scale={22.417}
                    />
                  </group>
                </group>
                <group
                  name="seaweed_armature001"
                  position={[2.613, -32.339, 36.627]}
                  rotation={[-Math.PI / 2, 0, 0.987]}
                  scale={63.668}
                >
                  <group name="Object_444">
                    <primitive object={nodes._rootJoint_8} />
                    <skinnedMesh
                      name="Object_447"
                      geometry={nodes.Object_447.geometry}
                      material={materials.seaweed}
                      skeleton={nodes.Object_447.skeleton}
                    />
                    <group
                      name="Object_446"
                      position={[2.613, -32.339, 36.627]}
                      rotation={[-Math.PI / 2, 0, 0.987]}
                      scale={63.668}
                    />
                  </group>
                </group>
                <group
                  name="seaweed_armature002"
                  position={[17.221, -36.751, 66.084]}
                  rotation={[-Math.PI / 2, 0, 2.548]}
                  scale={82.895}
                >
                  <group name="Object_474">
                    <primitive object={nodes._rootJoint_9} />
                    <skinnedMesh
                      name="Object_477"
                      geometry={nodes.Object_477.geometry}
                      material={materials.seaweed}
                      skeleton={nodes.Object_477.skeleton}
                    />
                    <group
                      name="Object_476"
                      position={[17.221, -36.751, 66.084]}
                      rotation={[-Math.PI / 2, 0, 2.548]}
                      scale={82.895}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default Island;
