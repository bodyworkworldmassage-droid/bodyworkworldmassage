import type { Metadata } from "next";
import { Jost, Marcellus_SC } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const marcellusSC = Marcellus_SC({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "BodyWorkWorldMassage — Nationwide Wellness Directory",
  description:
    "Find licensed, independent massage and bodywork professionals near you. Search, compare, and book directly — no middleman.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${marcellusSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
