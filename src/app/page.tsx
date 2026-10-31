import PortalClient from "@/components/PortalClient";
import { FORUM_COUNTS } from "@/data/forumCounts";

/**
 * The single-page portal. This server shell only computes the forum thread
 * counts, so the client bundle never carries the forum threads or episode data.
 */
export default function MixiuhLabsHomePage() {
  return <PortalClient forumCounts={FORUM_COUNTS} />;
}
