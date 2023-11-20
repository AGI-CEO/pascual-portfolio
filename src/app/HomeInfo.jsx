import React from "react";
import Link from "next/link";

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <div className="bg-white shadow-md rounded text-center px-8 pt-6 pb-8 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Hi, I'm
          <span className="font-semibold mx-2 text-black">Blaise</span>
          👋
          <br /> I'm a full-stack AI Software Engineer
        </label>
      </div>
    );

  if (currentStage === 2) {
    return (
      <div className="info-box">
        <p className="font-medium sm:text-xl text-center">
          Worked with many companies <br /> and picked up many skills along the
          way
        </p>

        <Link href="/about" className="neo-brutalism-white neo-btn">
          Learn more
          <img
            src="/assets/icons/arrow"
            alt="arrow"
            className="w-4 h-4 object-contain"
          />
        </Link>
      </div>
    );
  }

  if (currentStage === 3) {
    return (
      <div className="info-box">
        <p className="font-medium text-center sm:text-xl">
          Led multiple projects to success over the years. <br /> Curious about
          the impact?
        </p>

        <Link href="/projects" className="neo-brutalism-white neo-btn">
          Visit my portfolio
          <img
            src="/assets/icons/arrow"
            alt="arrow"
            className="w-4 h-4 object-contain"
          />
        </Link>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div className="info-box">
        <p className="font-medium sm:text-xl text-center">
          Need a project done or looking for a dev? <br /> I'm just a few
          keystrokes away
        </p>

        <Link href="/contact" className="neo-brutalism-white neo-btn">
          Let's talk
          <img
            src="/assets/icons/arrow"
            alt="arrow"
            className="w-4 h-4 object-contain"
          />
        </Link>
      </div>
    );
  }

  return null;
};

export default HomeInfo;
