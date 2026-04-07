import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, Lora } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InsuraFlow",
  description: "Insurance Operations Automation Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${ibmPlexMono.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
