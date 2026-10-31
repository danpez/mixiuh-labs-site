// X (Twitter) uses the same evergreen card as Open Graph. Re-exporting is safe for
// these four names; route segment config (runtime, revalidate, dynamic...) is read
// statically and would have to be declared literally in this file, not re-exported.
export { default, alt, size, contentType } from "./opengraph-image";
