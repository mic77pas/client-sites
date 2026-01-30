import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "../_components/Header";
import "./globals.css";
import Image from "next/image";
import MobileNav from "@/_components/MobileNav";

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
        <Header />
        <main className="relative max-w-7xl w-full p-4">
          {/* Background image */}
          <div className="fixed inset-0 -z-10">
            <div className="h-full w-full md:h-full">
              <Image
                src="/studio.webp"
                alt="studio"
                fill
                priority
                className="object-contain md:object-cover opacity-10"
              />
            </div>
          </div>

          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
