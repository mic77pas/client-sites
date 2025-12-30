import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "../_components/Header";
import "./globals.css";
import Image from "next/image";

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
            <Image
              src="/studio.webp"
              alt="studio"
              fill
              priority
              className="object-cover object-center opacity-10"
            />
          </div>

          {children}
        </main>
      </body>
    </html>
  );
}
