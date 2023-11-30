"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Loading from "./loading";
import Sky from "./models/Sky";
import Island from "./models/BetterIsland";
import Bird from "./models/Bird";
import Plane from "./models/BetterPlane";
import HomeInfo from "./HomeInfo";

export default function Home() {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [screenScale, setScreenScale] = useState([1, 1.1, 1.1]);
  const [screenPosition, setScreenPosition] = useState([0, -60.5, -300]);
  const [rotation, setRotation] = useState([0.1, 4.7, 0]);
  const [planeScale, setPlaneScale] = useState([3, 3, 3]);
  const [planePosition, setPlanePosition] = useState([0, -4, -4]);

  // Adjust scale and position based on screen size
  useEffect(() => {
    function adjustForScreenSize() {
      if (window.innerWidth < 768) {
        setScreenScale([1.5, 1.5, 1.5]);
        setPlaneScale([0.015, 0.015, 0.015]);
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

  return (
    <main className="flex h-screen  flex-col items-center justify-between p-2 relative">
      <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 10000 }}
      >
        <Suspense fallback={Loading}>
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
        </Suspense>
      </Canvas>
    </main>
  );
}
