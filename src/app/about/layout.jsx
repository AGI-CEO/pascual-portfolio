import { Inter } from "next/font/google";
import "../globals.css";
import NavBar2 from "./NavBar2";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blaise Pascual's Portfolio",
  description: "A collection of my creations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar2 />
        {children}
      </body>
    </html>
  );
}
