import React, { useState, useEffect } from "react";
import Link from "next/link";

const HomeInfo = ({ currentStage }) => {
  const [visible, setVisible] = useState(true);
  const [prevStage, setPrevStage] = useState(currentStage);
  const [displayStage, setDisplayStage] = useState(currentStage);

  useEffect(() => {
    if (currentStage !== prevStage) {
      setVisible(false);
      setTimeout(() => {
        setVisible(true);
        setPrevStage(currentStage);
        setDisplayStage(currentStage);
      }, 500); // Delay before the fade in animation
    }
  }, [currentStage, prevStage]);

  if (!visible) return null;

  if (displayStage === 1)
    return (
      <div
        className="bg-white shadow-md rounded text-center px-8 pt-6 pb-2 mb-4"
        style={{
          animation: visible ? "fadeIn 0.4s" : undefined,
          transition: "opacity 0.5s",
          opacity: visible ? 1 : 0,
        }}
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Hi, I'm
          <span className="font-semibold mx-2 text-black">Blaise</span>
          👋
          <br /> Welcome to my Island
          <br />
          🏝️ Drag to explore.
        </label>
      </div>
    );
  if (displayStage === 2) {
    return (
      <div
        className="bg-white shadow-md rounded text-center px-8 pt-6 pb-4 mb-4"
        style={{
          animation: visible ? "fadeIn 0.4s" : undefined,
          transition: "opacity 0.5s",
          opacity: visible ? 1 : 0,
        }}
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          I leverage a unique blend of science, leadership, and strategic
          planning to tackle business challenges with AI implementation.
          Interested in hearing about my journey?
        </label>
        <Link href="/about" className="btn btn-primary">
          Learn more
        </Link>
      </div>
    );
  }

  if (displayStage === 3) {
    return (
      <div
        className="bg-white shadow-md rounded text-center px-8 pt-6 pb-4 mb-4"
        style={{
          animation: visible ? "fadeIn 0.4s" : undefined,
          transition: "opacity 0.5s",
          opacity: visible ? 1 : 0,
        }}
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          I am a passionate creator, and I love to build things. Check out some
          of my projects 👍
        </label>
        <Link href="https://github.com/AGI-CEO" className="btn btn-primary">
          Check my GitHub
        </Link>
      </div>
    );
  }

  if (displayStage === 4) {
    return (
      <div
        className="bg-white shadow-md rounded text-center px-8 pt-6 pb-4 mb-4"
        style={{
          animation: visible ? "fadeIn 0.4s" : undefined,
          transition: "opacity 0.5s",
          opacity: visible ? 1 : 0,
        }}
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Intrigued by AI solutions or wish to connect? Don't hesitate to reach
          out.
        </label>
        <Link href="/contact" className="btn btn-primary">
          Let's talk
        </Link>
      </div>
    );
  }

  return null;
};

export default HomeInfo;
