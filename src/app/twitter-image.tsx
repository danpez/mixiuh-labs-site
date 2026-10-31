// X (Twitter) uses the same evergreen card as Open Graph. Re-exporting is safe for
// these four names; route segment config (runtime, revalidate, dynamic...) is read
// statically and would have to be declared literally in this file, not re-exported.
// The ?hash Next appends to the twitter:image URL comes from this file's own bytes,
// not from opengraph-image.tsx, so bump this revision whenever the card changes: X
// then sees a new image URL and fetches the new card instead of its cached copy.
// Card revision: 1
export { default, alt, size, contentType } from "./opengraph-image";
