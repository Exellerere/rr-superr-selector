import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RR SupeRR Selector — IPL 2027 Talent Scouting & Auction Engine",
  description: "Next-generation cricket analytics and domestic uncapped talent scouting dashboard for Rajasthan Royals ahead of the IPL 2027 Auction.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} min-h-screen bg-[#0F172A] text-slate-100 antialiased selection:bg-[#EA1A85] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
