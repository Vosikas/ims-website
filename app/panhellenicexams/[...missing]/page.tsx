import { notFound } from "next/navigation";

// This route only ever shows the 404, so instant-navigation validation has nothing to check.
export const instant = false;

// Unknown paths under /panhellenicexams get the login's own 404 page instead of the site's.
export default function MissingPage() {
  notFound();
}
