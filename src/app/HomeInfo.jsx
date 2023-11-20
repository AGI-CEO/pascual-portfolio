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
          <br /> I'm a seasoned leader and innovator, leveraging my skills into
          the world of AI and automation with LangLabs.
        </label>
      </div>
    );

  if (currentStage === 2) {
    return (
      <div className="info-box">
        <p className="font-medium sm:text-xl text-center">
          Merging diverse background in science, leadership, and strategic
          planning to address the challenges businesses face when implementing
          AI solutions.
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
          Passionate about supporting veterans, fostering small business growth,
          promoting entrepreneurship, and advancing artificial intelligence.
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
          Intrigued by AI solutions or wish to connect? Don't hesitate to reach
          out.
        </p>

        <Link href="/contact" className="btn-square ">
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
