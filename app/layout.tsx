import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hundler Work — биржа заказов",
  description: "Площадка для заказчиков и исполнителей",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Applies the saved theme (from cookie) before paint to avoid a flash of the wrong theme.
const themeInit = `try{var m=document.cookie.match(/(?:^|; )hw-theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):null;if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}