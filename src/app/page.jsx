"use client";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Loading from "./loading";
import Alien from "./models/Alien";

export default function Home() {
  const adjustForScreenSize = () => {
    let screenScale = null;
    let screenPosition = [0, 0, -203];
    let rotation = [1.1, 4.7, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [1, 1.1, 1.1];
    }

    return [screenScale, screenPosition, rotation];
  };

  const [screenScale, screenPosition] = adjustForScreenSize();

  return (
    <main className="flex h-screen  flex-col items-center justify-between p-2">
      <Canvas className="w-full h-screen" camera={{ near: 0.1, far: 1000 }}>
        <Suspense fallback={Loading}>
          <directionalLight position={[5, 5, 5]} intensity={5} />
          <ambientLight intensity={5} />
          <pointLight position={[10, 10, 10]} />
          <spotLight position={[15, 20, 5]} angle={0.3} />
          <hemisphereLight
            skyColor="#ffffff"
            groundColor="#000000"
            intensity={1.0}
          />
          <Alien position={screenPosition} scale={screenScale} />
        </Suspense>
      </Canvas>
      <p>still here</p>
    </main>
  );
}
