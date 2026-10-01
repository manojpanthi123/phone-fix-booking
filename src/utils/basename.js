/** GitHub Pages serves the built site from /phone-fix-booking. Local npm start serves /. */
export const routerBasename =
  process.env.NODE_ENV === "production" ? process.env.PUBLIC_URL || "/" : "/";
