import { getSiteContent } from "../lib/content";
import { Header } from "../ui/components/header";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><Header content={await getSiteContent()} />{children}</>;
}
