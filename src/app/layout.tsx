import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RR SupeRR Selector Season 2 | Rajasthan Royals Analytics & Auction War Room",
  description: "Official Rajasthan Royals T20 Pressure & Reliability Intelligence Engine (HL-PRS v7) and IPL 2027 Auction War Room.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} min-h-screen bg-[#0B162C] text-slate-100 antialiased selection:bg-[#EA1A85] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
