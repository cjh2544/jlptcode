import SessionProvider from "@/app/providers/SessionProvider";
import I18nProvider from "@/app/providers/I18nProvider";
import DatabaseProvider from "@/app/providers/DatabaseProvider";
import { resolveDatabaseType } from "@/app/lib/resolve-database";
import "@/app/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/app/style/common.css";
import { SWRProvider } from "./providers/SWRProvider";
import { Suspense } from "react";
import { Nanum_Gothic, Noto_Serif_JP, Geist } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { rootMetadata } from "@/app/seo/siteConfig";
import JsonLd from "@/app/components/Seo/JsonLd";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Viewport } from "next";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const GTM_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID || "";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

const nanumGothic = Nanum_Gothic({
  preload: false,
  weight: ["400", "700", "800"],
  display: "swap",
  adjustFontFallback: false,
});

const notoSerifJP = Noto_Serif_JP({
  preload: false,
  weight: ["400", "700", "900"],
  display: "swap",
  adjustFontFallback: false,
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export const metadata = rootMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const databaseType = await resolveDatabaseType();

  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className={`${nanumGothic.className} ${notoSerifJP.className}`}>
        <JsonLd />
        <SessionProvider>
          <I18nProvider>
            <DatabaseProvider initialType={databaseType}>
              <SWRProvider>
                <TooltipProvider>
                  <main>
                    <Suspense fallback={<></>}>{children}</Suspense>
                  </main>
                </TooltipProvider>
              </SWRProvider>
            </DatabaseProvider>
          </I18nProvider>
        </SessionProvider>

        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        <GoogleTagManager gtmId={GTM_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
