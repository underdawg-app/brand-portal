import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

// Exact font files bundled from the creator app (assets/fonts) so the portal
// pixel-matches the app — no Google/Fontshare dependency.
const anton = localFont({
  src: "./fonts/Anton_400Regular.ttf",
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: [
    { path: "./fonts/SpaceGrotesk_400Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SpaceGrotesk_500Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/SpaceGrotesk_700Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-space",
  display: "swap",
});

const cabinet = localFont({
  src: [
    { path: "./fonts/CabinetGrotesk-Extrabold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/CabinetGrotesk-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-cabinet",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Underdawg — Brand & Agency Portal",
  description:
    "Discover, hire, contract, pay and rate creators. The brand & agency side of Underdawg.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anton.variable} ${spaceGrotesk.variable} ${cabinet.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
