"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import {
  PointLight,
  PointsMaterial,
  BufferGeometry,
  Vector3,
  Color,
  BufferAttribute,
  Points,
} from "three";

import Loading from "./loading";
import Sky from "./models/Sky";
import Island from "./models/BetterIsland";
import Bird from "./models/Bird";
import Plane from "./models/BetterPlane";
import HomeInfo from "./HomeInfo";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Utility to create particle positions
function createParticles(count, distance) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const vertex = new Vector3();
    vertex.x = Math.random() * distance - distance / 2;
    vertex.y = Math.random() * distance - distance / 2;
    vertex.z = Math.random() * distance - distance / 2;
    positions.push(vertex.x, vertex.y, vertex.z);
  }
  return new Float32Array(positions);
}

// Dynamic Point Light Component
const MovingLight = () => {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    lightRef.current.position.x = Math.sin(time) * 10;
    lightRef.current.position.y = Math.cos(time) * 10;
    lightRef.current.position.z = Math.cos(time) * 10;
    lightRef.current.intensity = 10 + Math.sin(time * 5);
  });

  return <pointLight ref={lightRef} args={["#a2b9c8", 2, 100]} castShadow />;
};

// Particle System Component
const Particles = () => {
  const particlesRef = useRef();
  const particlePositions = createParticles(100, 10); // Reduced distance

  useFrame(() => {
    particlesRef.current.rotation.y += 0.001; // Rotate particles for effect
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(particlePositions, 3));

  return (
    <primitive
      ref={particlesRef}
      object={
        new Points(
          geometry,
          new PointsMaterial({ color: "gold", size: 0.0001 })
        )
      }
    />
  );
};

export default function Home() {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [screenScale, setScreenScale] = useState([1, 1.1, 1.1]);
  const [screenPosition, setScreenPosition] = useState([0, -60.5, -300]);
  const [rotation, setRotation] = useState([0.1, 4.7, 0]);
  const [planeScale, setPlaneScale] = useState([3, 3, 3]);
  const [planePosition, setPlanePosition] = useState([0, -4, -4]);
  const [isLoading, setIsLoading] = useState(true);

  // Adjust scale and position based on screen size
  useEffect(() => {
    function adjustForScreenSize() {
      if (window.innerWidth < 768) {
        setScreenScale([1.5, 1.5, 1.5]);
        setPlaneScale([0.013, 0.013, 0.013]);
        setPlanePosition([-1, -3, 1]);
      } else {
        setScreenScale([1.7, 1.7, 1.7]);
        setPlaneScale([0.015, 0.015, 0.015]);
        setPlanePosition([-1, -3, 1]);
      }
    }

    adjustForScreenSize(); // Adjust on mount

    // Adjust when window resizes
    window.addEventListener("resize", adjustForScreenSize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", adjustForScreenSize);
  }, []);
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Increase this delay if necessary

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex h-screen flex-col items-center justify-between p-2 relative">
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div
          className={`w-full h-screen bg-black`}
          style={{ opacity: isLoading ? 0 : 1, transition: "opacity 5s" }}
        >
          <Canvas
            className={`w-full h-screen bg-transparent ${
              isRotating ? "cursor-grabbing" : "cursor-grab"
            }`}
            camera={{ near: 0.1, far: 10000 }}
            style={{
              animation: !isLoading ? "fadeIn 5s" : undefined,
            }}
          >
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.01}
                luminanceSmoothing={0.3}
                height={100}
              />
              <directionalLight
                position={[1, 1, 1]}
                intensity={2.5}
                color="#a2b9c8"
              />
              <ambientLight intensity={0.3} />
              <hemisphereLight
                skyColor="#6a89cc"
                groundColor="#b8b8b8"
                intensity={0.75}
              />
              <pointLight
                position={[-1, 2, -1]}
                color="#c7d5e0"
                intensity={1.5}
                distance={100}
              />
              <MovingLight /> {/* Dynamic light */}
              <Particles /> {/* Particle system */}
              <Sky isRotating={isRotating} />
              <Bird />
              <Island
                position={screenPosition}
                scale={screenScale}
                rotation={rotation}
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                setCurrentStage={setCurrentStage}
              />
              <Plane
                isRotating={isRotating}
                scale={planeScale}
                position={planePosition}
                rotation={[0, 20, 0]}
              />
              {/* <Alien
            position={[0, -23, -15]}
            scale={[0.05, 0.05, 0.05]}
            rotation={rotation}
            isRotating={isRotating}
      />*/}
            </EffectComposer>
          </Canvas>
        </div>
      )}
    </main>
  );
}
