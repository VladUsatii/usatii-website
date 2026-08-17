"use client";

import { useMemo, useState } from "react";
import { Download, ExternalLink, QrCode, ShieldCheck } from "lucide-react";
import styles from "./qr-code.module.css";

const DEFAULT_URL = "https://usatii.com/software?utm_source=qr&utm_campaign=software-qr";

export default function QrCodeDesigner() {
  const [input, setInput] = useState(DEFAULT_URL);
  const [target, setTarget] = useState(DEFAULT_URL);
  const [error, setError] = useState("");

  const imageUrl = useMemo(
    () => `/api/qr?url=${encodeURIComponent(target)}&format=svg&size=1024`,
    [target],
  );

  function generate(event) {
    event.preventDefault();
    try {
      const url = new URL(input.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      setTarget(url.toString());
      setError("");
    } catch {
      setError("Enter a complete web address beginning with https:// or http://.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.copy}>
          <a className={styles.brand} href="/" aria-label="USATII home">
            <span className={styles.brandMark}>U</span>
            <span>USATII</span>
          </a>
          <div className={styles.eyebrow}><QrCode size={16} /> FIRST-PARTY QR STUDIO</div>
          <h1>One scan.<br /><span>Zero middlemen.</span></h1>
          <p className={styles.lede}>Create a high-resolution QR code served directly by USATII. No subscriptions, expiring links, tracking pixels, or third-party redirects.</p>

          <form onSubmit={generate} className={styles.form}>
            <label htmlFor="qr-url">Destination URL</label>
            <div className={styles.inputRow}>
              <input id="qr-url" type="url" value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" aria-describedby={error ? "qr-error" : undefined} />
              <button type="submit">Generate</button>
            </div>
            {error && <p id="qr-error" className={styles.error}>{error}</p>}
          </form>

          <div className={styles.trust}><ShieldCheck size={19} /><span><strong>Direct destination</strong><small>The URL is encoded inside the QR itself.</small></span></div>
        </div>

        <div className={styles.previewColumn}>
          <div className={styles.card}>
            <div className={styles.cardTop}><span>SCAN TO EXPLORE</span><span className={styles.live}>LIVE</span></div>
            <div className={styles.qrFrame}><img key={imageUrl} src={imageUrl} alt={`QR code linking to ${target}`} /></div>
            <div className={styles.cardTitle}>Software that fits<br />the way you work.</div>
            <div className={styles.destination}><ExternalLink size={15} />{target.replace(/^https?:\/\//, "")}</div>
          </div>
          <div className={styles.downloads}>
            <a href={`${imageUrl}&download=1`} download="usatii-qr-code.svg"><Download size={17} /> Download SVG</a>
            <a href={`/api/qr?url=${encodeURIComponent(target)}&format=png&size=1024`} download="usatii-qr-code.png"><Download size={17} /> Download PNG</a>
          </div>
          <p className={styles.hint}>SVG is best for print. PNG is ready for social and digital use.</p>
        </div>
      </section>
    </main>
  );
}
