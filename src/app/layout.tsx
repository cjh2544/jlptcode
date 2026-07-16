import SessionProvider from "@/app/providers/SessionProvider";
import I18nProvider from "@/app/providers/I18nProvider";
import "@/app/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/app/style/tailwind.css";
import "@/app/style/common.css";
import { SWRProvider } from "./providers/SWRProvider";
import { Suspense } from "react";
import { Nanum_Gothic, Noto_Serif_JP } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { rootMetadata } from "@/app/seo/siteConfig";
import JsonLd from "@/app/components/Seo/JsonLd";

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

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${nanumGothic.className} ${notoSerifJP.className}`}>
        <JsonLd />
        <SessionProvider>
          <I18nProvider>
            <SWRProvider>
              <main>
                <Suspense fallback={<></>}>{children}</Suspense>
              </main>
            </SWRProvider>
          </I18nProvider>
        </SessionProvider>

        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        <GoogleTagManager gtmId={GTM_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
