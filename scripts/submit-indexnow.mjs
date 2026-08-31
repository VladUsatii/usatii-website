const siteUrl = (process.env.INDEXNOW_SITE_URL || "https://usatii.com").replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY || "de7915beac89e33ae656e2a848882600";
const keyLocation = `${siteUrl}/${key}.txt`;

function normalizeUrl(value) {
  const url = new URL(value, siteUrl);
  if (url.origin !== siteUrl) throw new Error(`IndexNow only accepts URLs on ${siteUrl}: ${value}`);
  return url.href;
}

async function getSitemapUrls() {
  const response = await fetch(`${siteUrl}/sitemap.xml`);
  if (!response.ok) throw new Error(`Unable to read sitemap.xml (${response.status})`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => normalizeUrl(match[1]));
}

const suppliedUrls = process.argv.slice(2);
const urlList = [...new Set(suppliedUrls.length ? suppliedUrls.map(normalizeUrl) : await getSitemapUrls())];

if (!urlList.length) throw new Error("No URLs were supplied or found in the sitemap.");
if (urlList.length > 10_000) throw new Error("IndexNow accepts no more than 10,000 URLs per request.");

const payload = { host: new URL(siteUrl).host, key, keyLocation, urlList };

if (process.env.INDEXNOW_DRY_RUN === "1") {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (!response.ok) throw new Error(`IndexNow submission failed (${response.status}): ${await response.text()}`);
console.log(`Submitted ${urlList.length} URL${urlList.length === 1 ? "" : "s"} to IndexNow.`);
