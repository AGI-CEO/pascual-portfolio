import React from "react";
import Link from "next/link";

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <div className="bg-white shadow-md rounded text-center px-8 pt-6 pb-2 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Hi, I'm
          <span className="font-semibold mx-2 text-black">Blaise</span>
          👋
          <br /> I'm a seasoned leader and innovator, leveraging my skills into
          the world of AI and automation with LangLabs.
        </label>
      </div>
    );
  if (currentStage === 2) {
    return (
      <div className="bg-white shadow-md rounded text-center px-8 pt-6 pb-4 mb-4">
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

  if (currentStage === 3) {
    return (
      <div className="bg-white shadow-md rounded text-center px-8 pt-6 pb-4 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          I am a passionate creator, and I love to build things. Check out some
          of my projects 👍
        </label>
        <Link href="/projects" className="btn btn-primary">
          Visit my portfolio
        </Link>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div className="bg-white shadow-md rounded text-center px-8 pt-6 pb-4 mb-4">
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
