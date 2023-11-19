"use client";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Loading from "./loading";
import Alien from "./models/Alien";

export default function Home() {
  return (
    <main className="flex h-screen  flex-col items-center justify-between p-2">
      <Canvas
        className="w-full h-screen bg-white opacity-50"
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={Loading}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <spotLight position={[15, 20, 5]} angle={0.3} />
          <hemisphereLight
            skyColor="#ffffff"
            groundColor="#000000"
            intensity={1.0}
          />
          <Alien />
        </Suspense>
      </Canvas>
      <p>still here</p>
    </main>
  );
}
