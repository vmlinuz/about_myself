import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Volodymyr Salo - Senior Software Engineer",
  description:
    "Professional portfolio for Volodymyr Salo, a Vienna-based senior software engineer focused on embedded Linux, Qt/QML, Python, C++, APIs, and production systems.",
  authors: [{ name: "Volodymyr Salo" }],
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "Volodymyr Salo - Senior Software Engineer",
    description:
      "Embedded Linux, cross-platform product engineering, and production-grade desktop systems.",
    type: "website",
    images: ["/avatar.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
