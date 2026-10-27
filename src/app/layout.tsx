import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Fraunces } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { ASSETS } from "@/constants/assets";
import { SEO_DEFAULTS, SITE_NAME } from "@/constants/seo";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: SEO_DEFAULTS.defaultTitle,
    template: SEO_DEFAULTS.titleTemplate,
  },
  description: SEO_DEFAULTS.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  icons: {
    icon: ASSETS.LOGO,
    shortcut: ASSETS.LOGO,
    apple: ASSETS.LOGO,
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: SEO_DEFAULTS.locale,
    type: SEO_DEFAULTS.type,
    images: [
      {
        url: ASSETS.LOGO,
        width: 640,
        height: 640,
        alt: `${SITE_NAME} Logo`,
      },
    ],
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-D6RP1ELY2E";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${fraunces.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Analytics (gtag.js) */}
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

