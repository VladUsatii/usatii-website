// Unpublished sections and retired products. Keep /resources itself available.
export function isHiddenPublicPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return ["/editor", "/reviews", "/advertising", "/ai", "/services", "/compare"].some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  ) || path.startsWith("/resources/") || path === "/USATII_EDITOR_DEMO.gif";
}
