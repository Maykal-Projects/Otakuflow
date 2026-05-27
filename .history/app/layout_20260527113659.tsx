import "./globals.css";

import type { Metadata } from "next";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "OtakuFlow",

  description:
    "Modern anime tracker",

  manifest:
    "/manifest.json",

  themeColor:
    "#7c3aed",

  icons: {
    apple:
      "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster
  position="top-center"
  toastOptions={{
    duration: 2500,

    style: {
      background:
        "rgba(15,15,20,0.95)",

      color: "#fff",

      border:
        "1px solid rgba(255,255,255,0.08)",

      borderRadius:
        "22px",

      padding:
        "18px 22px",

      backdropFilter:
        "blur(18px)",

      fontWeight:
        "800",

      boxShadow:
        "0 10px 60px rgba(0,0,0,0.5)",
    },

    success: {
      iconTheme: {
        primary:
          "#a855f7",
        secondary:
          "#fff",
      },
    },
  }}
/>
      </body>
    </html>
  );
}