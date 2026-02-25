import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";
import EmotionProvider from "./providers/EmotionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Space Flight News",
  description: "Notícias referentes à exploração Espacial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <EmotionProvider>
          <QueryProvider>{children}</QueryProvider>
        </EmotionProvider>
      </body>
    </html>
  );
}
