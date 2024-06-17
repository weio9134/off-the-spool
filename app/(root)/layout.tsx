import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import NavBar from "@/components/shared/NavBar";
import LeftBar from "@/components/shared/LeftBar";
import RightBar from "@/components/shared/RightBar";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Off the Spool",
  description: "A Next.js 14 Meta Threads App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />

          <main className="flex flex-row">
            <LeftBar />

            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>

            <RightBar />
          </main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
