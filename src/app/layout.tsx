import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { Anton } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const kanit = Work_Sans({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-kanit',
  display: 'swap'
});

const anton = Work_Sans({ 
  subsets: ["latin"],
  variable: '--font-anton',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "BetterEats",
  description: "Skripsi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${kanit.variable} overflow-x-hidden`}>
        <body className="min-w-screen min-h-screen w-screen h-screen flex flex-col bg-paper-default overflow-x-hidden">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

