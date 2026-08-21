import { connection } from "next/server";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

/**
 * Cafe24 등에서는 NEXT_PUBLIC_* 가 빌드 시점에 비어 있으면 운영에도 빈 값으로 고정된다.
 * 서버 전용 GA_MEASUREMENT_ID / GTM_MEASUREMENT_ID 를 런타임에 읽어 주입한다.
 */
export default async function Analytics() {
  await connection();

  const gaId =
    process.env.GA_MEASUREMENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ||
    "";
  const gtmId =
    process.env.GTM_MEASUREMENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID?.trim() ||
    "";

  return (
    <>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
    </>
  );
}
