import type { Metadata } from "next";
import { SolidCursor } from "@/components/public/solid-cursor";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nicolas Paris | Branding e identidad visual",
    template: "%s | Nicolas Paris",
  },
  description: "Portfolio y sitio comercial de Nicolas Paris, diseñador gráfico especializado en branding, creación de marcas e identidad visual.",
  keywords: ["Nicolas Paris", "branding", "identidad visual", "diseño gráfico", "creación de marcas", "diseño de marcas"],
  authors: [{ name: "Nicolas Paris" }],
  creator: "Nicolas Paris",
  publisher: "Nicolas Paris",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Nicolas Paris",
    title: "Nicolas Paris | Branding e identidad visual",
    description: "Diseño marcas e identidades visuales con impacto, criterio y dirección.",
    images: [
      {
        url: "/images/figma/project-placeholder.png",
        width: 1200,
        height: 630,
        alt: "Nicolas Paris branding e identidad visual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolas Paris | Branding e identidad visual",
    description: "Diseño marcas e identidades visuales con impacto, criterio y dirección.",
    images: ["/images/figma/project-placeholder.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png?v=2", type: "image/png", sizes: "51x51" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png?v=2",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <SolidCursor />
        {children}
      </body>
    </html>
  );
}
