import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Hundler Work — биржа заказов",
  description: "Площадка для заказчиков и исполнителей",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Applies the saved theme class before paint to avoid a flash of the wrong theme.
const themeInit = `try{var t=localStorage.getItem('hw-theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}