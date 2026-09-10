import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Toko Kue Bu Rohayah — Melestarikan Cita Rasa Asli Nusantara",
  description:
    "Jajanan pasar tradisional dibuat segar setiap subuh. Klepon, lemper, bika ambon, hingga paket tampah hajatan. Pengiriman tepat waktu untuk seluruh Jakarta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
