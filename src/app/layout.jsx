import "./globals.css";
import NavBar from "./NavBar";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Blaise Pascual's Portfolio",
  description: "A collection of my creations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
