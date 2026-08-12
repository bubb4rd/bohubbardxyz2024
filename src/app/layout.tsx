import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import { MobileNav } from "@/components/MobileNav";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-display-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bo Hubbard — Developer & Designer",
  description:
    "Portfolio of William (Bo) Hubbard — software developer, graphic designer, and ASU Computer Science graduate.",
  openGraph: {
    title: "Bo Hubbard — Developer & Designer",
    description:
      "Software development, graphic design, and interfaces with intention.",
    url: "https://bohubbard.xyz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans">
        <MobileNav />
        {children}
      </body>
    </html>
  );
}
