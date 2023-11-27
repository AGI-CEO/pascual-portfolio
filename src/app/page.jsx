"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Loading from "./loading";
import Sky from "./models/Sky";
import Island from "./models/Island";
import Bird from "./models/Bird";
import Plane from "./models/Plane";
import HomeInfo from "./HomeInfo";

export default function Home() {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [screenScale, setScreenScale] = useState([1, 1.1, 1.1]);
  const [screenPosition, setScreenPosition] = useState([0, -6.5, -43]);
  const [rotation, setRotation] = useState([0.1, 4.7, 0]);
  const [planeScale, setPlaneScale] = useState([3, 3, 3]);
  const [planePosition, setPlanePosition] = useState([0, -4, -4]);

  // Adjust scale and position based on screen size
  useEffect(() => {
    function adjustForScreenSize() {
      if (window.innerWidth < 768) {
        setScreenScale([0.9, 0.9, 0.9]);
        setPlaneScale([1.5, 1.5, 1.5]);
        setPlanePosition([0, -1.5, 0]);
      } else {
        setScreenScale([1, 1.1, 1.1]);
        setPlaneScale([3, 3, 3]);
        setPlanePosition([0, -4, -4]);
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
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={Loading}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <hemisphereLight
            skyColor="#b1e1ff"
            groundColor="#000000"
            intensity={1.0}
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
