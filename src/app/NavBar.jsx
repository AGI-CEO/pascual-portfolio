"use client";

import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <header className="header">
      <nav className="p-1 m-1">
        <div className="flex flex-row items-center justify-center">
          <div className="flex flex-row justify-start items-center w-80">
            <Link
              href="/"
              className="w-20 h-20 rounded-lg bg-white items-center justify-center flex flex-row font-bold shadow-md"
              passHref
            >
              <p className="bg-gradient-to-br from-yellow-300 to-pink-500 text-transparent  bg-clip-text items-center justify-center flex flex-row text-lg text-center">
                Blaise Pascual
              </p>
            </Link>
          </div>
          <div className="flex flex-row gap-7">
            <Link href="/about" passHref>
              <p>About Me</p>
            </Link>
            <Link href="/resume" passHref>
              <button type="button">Resume</button>
            </Link>
            <Link href="/projects" passHref>
              <button type="button">Projects</button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
