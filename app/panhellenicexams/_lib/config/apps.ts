import type { AppId } from "../api/types";

/**
 * The app a user is sent to after login. The frontend only ever passes this id; the backend maps
 * it to a URL from its own list, so a crafted request can't redirect anywhere else.
 */
export const APP: AppId = "eclass";
