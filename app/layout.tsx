import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: "JX Bible Journey · Genesis 1–3",
  description: "A guided, interactive journey through Creation and the Fall.",
  applicationName: "JX Bible Journey",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#082d28", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="m-0 bg-cream font-sans text-ink antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
