import "./globals.css";

import type { Metadata } from "next";

import { Toaster } from "react-hot-toast";
import OtakuAI from "@/components/OtakuAI";
export const metadata = {

  title: "Otakuflorist",

  applicationName:
    "Otakuflorist",

  description:
    "Track anime, build your library and discover trending shows.",

};


export const viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="en"
  suppressHydrationWarning
>
    <body
  className="bg-[#07010f] text-white"
  style={{
    backgroundColor:
      "#07010f",
  }}
>

  {children}

  <OtakuAI />

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