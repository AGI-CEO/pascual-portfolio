"use client";
import React from "react";
import Skills from "./Skills";

const About = () => {
  return (
    <section className="max-container m-5 p-5 w-5/6 justify-center mx-auto">
      <h1 className="head-text text-3xl text-center ">
        Hi, I'm{" "}
        <span className="font-semibold bg-gradient-to-br from-yellow-300 to-pink-500 text-transparent  bg-clip-text items-center justify-center flex flex-row text-3xl text-center">
          Blaise Pascual
        </span>
        👋
      </h1>

      <div className="mt-5 flex flex-col gap-3 text-white m-5 p-5">
        <h2 className="text-2xl text-center">About Me</h2>
        <p>
          I'm a seasoned leader and innovator with a background in the U.S.
          Marine Corps and scientific research.
        </p>
        <p>
          Currently, I'm applying my skills in the exciting field of AI and
          automation at LangLabs. 🚀
        </p>
        <p>
          My experience includes serving as a Manpower Officer and working as an
          Undergraduate Research Assistant in the Department of Laboratory
          Medicine and Pathology at the University of Washington. 🧪🔬
        </p>
        <p>
          At LangLabs, we're committed to creating tailored AI solutions that
          help businesses unlock their full potential. 🤖💼
        </p>
        <p>
          I'm passionate about supporting veterans, promoting entrepreneurship,
          and advancing artificial intelligence. I believe in the power of these
          communities and technologies to drive innovation. 🌍💡
        </p>
        <p>
          If you're interested in AI solutions or want to connect, feel free to
          reach out. Let's explore how we can harness the transformative power
          of AI together! 💪🔥
        </p>
      </div>
      <Skills />
    </section>
  );
};

export default About;
