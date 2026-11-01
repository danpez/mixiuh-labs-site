import "server-only";
import { INITIAL_FORUM_THREADS } from "@/data/forumData";
import { isCuratedThreadReleased } from "@/data/forumStats";
import { CHALLENGES } from "@/data/labsData";
import { EP02_CHALLENGES } from "@/data/ep02Data";
import { EP03_CHALLENGES } from "@/data/ep03Data";
import { EP04_CHALLENGES } from "@/data/ep04Data";
import {
  RELEASE_TIMESTAMPS_CST,
  type ReleaseKey,
  type ReleasedState,
} from "@/data/releaseSchedule";

/**
 * Size of the forum's thread list (curated threads plus one thread per
 * challenge, as ForumSection renders it), split by the release that unlocks
 * each thread. The server page passes it to the client, which adds up the
 * released parts, so the home route never ships the threads or the episodes.
 */
export interface ForumCounts {
  /** Threads listed whatever has been released. */
  base: number;
  /** Threads listed only once that production is released. */
  byRelease: Record<ReleaseKey, number>;
}

const RELEASE_KEYS = Object.keys(RELEASE_TIMESTAMPS_CST) as ReleaseKey[];

const NOTHING_RELEASED: ReleasedState = {
  ep01: false,
  ep02: false,
  cc01: false,
  ep03: false,
  ep04: false,
  carbon01: false,
  cc02: false,
};

function countThreadsByRelease(): ForumCounts {
  const byRelease = Object.fromEntries(
    RELEASE_KEYS.map((key) => [key, 0])
  ) as Record<ReleaseKey, number>;
  let base = 0;
  // Each curated thread goes where isCuratedThreadReleased (the forum's own
  // filter) shows it: always, or once a single production is out.
  for (const thread of INITIAL_FORUM_THREADS) {
    if (isCuratedThreadReleased(thread, NOTHING_RELEASED)) {
      base++;
      continue;
    }
    const key = RELEASE_KEYS.find((k) =>
      isCuratedThreadReleased(thread, { ...NOTHING_RELEASED, [k]: true })
    );
    if (!key) {
      throw new Error(`No single release shows forum thread "${thread.id}"`);
    }
    byRelease[key]++;
  }
  // One thread per challenge: EP04 and EP03 wait for their release
  byRelease.ep04 += EP04_CHALLENGES.length;
  byRelease.ep03 += EP03_CHALLENGES.length;
  base += EP02_CHALLENGES.length + CHALLENGES.length;
  return { base, byRelease };
}

export const FORUM_COUNTS: ForumCounts = countThreadsByRelease();
