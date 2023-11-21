"use client";

import Link from "next/link";
import React from "react";

const NavBar2 = () => {
  return (
    <header className="header">
      <div className="flex flex-row w-screen items-center p-5 justify-center z-10">
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
            <p>About</p>
          </Link>
          <Link href="/contact" passHref>
            <button type="button">Contact</button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar2;
