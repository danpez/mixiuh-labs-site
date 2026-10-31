import type { ForumThread } from "@/data/forumData";
import type { ReleasedState } from "@/data/releaseSchedule";

/**
 * Curated threads stay hidden until their production is published. Used by
 * the forum's thread list and by the server-side counts in forumCounts.ts.
 */
export function isCuratedThreadReleased(t: ForumThread, rel: ReleasedState) {
  if (t.episode === "carbon01" && !rel.carbon01) return false;
  if (t.episode === "ep04" && !rel.ep04) return false;
  if (t.episode === "ep03" && !rel.ep03) return false;
  if (t.episode === "cc01" && !rel.cc01) return false;
  return true;
}
