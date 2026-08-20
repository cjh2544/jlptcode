import HomePage from "./HomePage";
import { pageMetadata } from "@/app/seo/pageMetadata";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/app/seo/siteConfig";

export const metadata = pageMetadata("/", SITE_TITLE, SITE_DESCRIPTION, {
  title: { absolute: SITE_TITLE },
});

export default function Page() {
  return <HomePage />;
}
