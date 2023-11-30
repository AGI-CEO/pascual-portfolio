import "../globals.css";
import NavBar2 from "./NavBar2";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Blaise Pascual's Portfolio",
  description: "A collection of my creations.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <div>
        <NavBar2 />
        {children}
        <Analytics />
      </div>
    </>
  );
}
