// Temporarily unpublished sections. Keep /resources itself available.
export function isHiddenPublicPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return ["/reviews", "/advertising", "/ai", "/services", "/compare"].some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  ) || path.startsWith("/resources/");
}
