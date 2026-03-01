import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "../_components/Header";
import "./globals.css";
import Image from "next/image";
import Footer from "../_components/Footer";
import MobileNav from "@/_components/MobileNav";
import SmoothScroll from "@/_components/SmoothScroll";
import PageLoader from "@/_components/Loader";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nik Karpov",
  description: "Photographer & Creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} flex flex-col min-h-screen items-center antialiased`}
      >
        {/* <Header /> */}
        <main className="relative w-full">
          <PageLoader />
          {/* Background image */}
          <div className="fixed inset-0 -z-10 hidden md:block">
            <Image
              src="/studio.webp"
              alt="studio"
              fill
              priority
              className="object-cover object-center opacity-10"
            />
          </div>
          <SmoothScroll />
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
