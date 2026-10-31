import { INITIAL_FORUM_THREADS, type ForumThread } from "@/data/forumData";
import { CHALLENGES } from "@/data/labsData";
import { EP02_CHALLENGES } from "@/data/ep02Data";
import { EP03_CHALLENGES } from "@/data/ep03Data";
import { EP04_CHALLENGES } from "@/data/ep04Data";
import type { ReleasedState } from "@/data/releaseSchedule";

/** Curated threads stay hidden until their production is published. */
export function isCuratedThreadReleased(t: ForumThread, rel: ReleasedState) {
  if (t.episode === "carbon01" && !rel.carbon01) return false;
  if (t.episode === "ep04" && !rel.ep04) return false;
  if (t.episode === "ep03" && !rel.ep03) return false;
  if (t.episode === "cc01" && !rel.cc01) return false;
  return true;
}

/** Same thread list size the forum renders (curated + one thread per released challenge). */
export function countForumThreads(rel: ReleasedState): number {
  return (
    INITIAL_FORUM_THREADS.filter((t) => isCuratedThreadReleased(t, rel)).length +
    (rel.ep04 ? EP04_CHALLENGES.length : 0) +
    (rel.ep03 ? EP03_CHALLENGES.length : 0) +
    EP02_CHALLENGES.length +
    CHALLENGES.length
  );
}
