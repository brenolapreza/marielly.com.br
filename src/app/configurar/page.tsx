import { hasCmsSession } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import { CmsEditor } from "./editor";
import { CmsLogin } from "./login";

export const dynamic = "force-dynamic";

export default async function ConfigurePage() {
  if (!(await hasCmsSession())) return <CmsLogin />;
  return <CmsEditor initialContent={await getSiteContent()} />;
}
