import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  title: "AImySTOCKS",
  description: "AI-Powered Stock Portfolio Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.puter.com/v2/" async></script>
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
