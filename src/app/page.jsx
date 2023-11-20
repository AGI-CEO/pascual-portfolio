"use client";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Loading from "./loading";
import Alien from "./models/Alien";
import Sky from "./models/Sky";
import Island from "./models/Island";

export default function Home() {
  const adjustForScreenSize = () => {
    let screenScale = null;
    let screenPosition = [0, -6.5, -43];
    let rotation = [0.1, 4.7, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [1, 1.1, 1.1];
    }

    return [screenScale, screenPosition, rotation];
  };

  const [screenScale, screenPosition, rotation] = adjustForScreenSize();

  return (
    <main className="flex h-screen  flex-col items-center justify-between p-2 relative">
      <Canvas className="w-full h-screen " camera={{ near: 0.1, far: 1000 }}>
        <Suspense fallback={Loading}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <hemisphereLight
            skyColor="#b1e1ff"
            groundColor="#000000"
            intensity={1.0}
          />
          <Sky />
          <Island
            position={screenPosition}
            scale={screenScale}
            rotation={rotation}
          />
          {/*<Alien
            position={screenPosition}
            scale={screenScale}
            rotation={rotation}
  />*/}
        </Suspense>
      </Canvas>
      <p>still here</p>
    </main>
  );
}
