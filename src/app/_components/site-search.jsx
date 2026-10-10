"use client";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import styles from "./public-header.module.css";

const prompts = ["Ask about our software", "Ask about construction", "Ask about OASIS", "Ask about emergency management", "Ask about careers", "Ask about AI integration"];
export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [prompt, setPrompt] = useState(0);
  const input = useRef(null);
  const request = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open || query || reduced) return;
    const timer = setInterval(() => setPrompt(previous => (previous + 1) % prompts.length), 3500);
    return () => clearInterval(timer);
  }, [open, query, reduced]);
  useEffect(() => () => request.current?.abort(), []);
  const changeOpen = (value) => {
    setOpen(value);
    if (!value) { request.current?.abort(); setStatus("idle"); setQuery(""); setSubmitted(""); setResults([]); }
  };
  const search = async (event) => {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setSubmitted(text); setStatus("loading"); setResults([]);
    try {
      const response = await fetch(`/api/site-search?q=${encodeURIComponent(text)}`, { signal: controller.signal });
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data.results); setStatus("done");
    } catch (error) { if (error.name !== "AbortError") setStatus("error"); }
  };
  return <Dialog.Root open={open} onOpenChange={changeOpen}>
    <Dialog.Trigger asChild><button className={styles.searchTrigger} aria-label="Search website"><Search size={19} strokeWidth={1.7} aria-hidden="true" /></button></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.searchOverlay} />
      <Dialog.Content className={styles.searchPage} onOpenAutoFocus={event => { event.preventDefault(); input.current?.focus(); }}>
        <Dialog.Title className="sr-only">Search USATII</Dialog.Title>
        <Dialog.Description className="sr-only">Search news, blogs, products, and public pages across the USATII website.</Dialog.Description>
        <Dialog.Close className={styles.searchClose} aria-label="Close search"><X size={23} strokeWidth={1.5} /></Dialog.Close>
        <div className={styles.searchColumn}>
          <form className={styles.searchForm} onSubmit={search} role="search">
            <div className={styles.inputWrap}>
              <input ref={input} type="search" aria-label="Search USATII website" value={query} maxLength={200} onChange={event => setQuery(event.target.value)} autoComplete="off" />
              {!query && <div className={styles.prompt} aria-hidden="true"><AnimatePresence mode="wait"><motion.span key={prompt} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .4 }}>{prompts[prompt]}</motion.span></AnimatePresence></div>}
            </div>
            <button type="submit" aria-label="Submit search" className={styles.submit} disabled={!query.trim()}><ArrowUp size={20} aria-hidden="true" /></button>
          </form>
          {submitted && <div className={styles.searchResults} aria-busy={status === "loading"}>
            <div className={styles.querySummary}><p>Your search</p><h2>{submitted}</h2></div>
            <p className={styles.resultStatus} role="status">{status === "loading" ? "Searching…" : status === "error" ? "Search is temporarily unavailable. Please try again." : results.length ? `Sources · ${results.length} results` : "No results found. Try a product, industry, or topic such as DART, construction, or careers."}</p>
            {results.map(result => <Link href={result.href} key={result.href} className={styles.searchResult} onClick={() => changeOpen(false)}>
              <div><div className={styles.resultMeta}><span>{result.category}</span>{result.date && <span>{new Date(result.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</span>}</div><h3>{result.title}</h3><p>{result.description}</p></div>
              {result.image && <Image src={result.image} alt="" width={140} height={140} className={styles.resultImage} />}
            </Link>)}
          </div>}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
