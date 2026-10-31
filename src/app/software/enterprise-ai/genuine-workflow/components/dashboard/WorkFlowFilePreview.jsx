"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, ExternalLink, FileText, History, MoreHorizontal, X } from "lucide-react";

export default function WorkFlowFilePreview({ asset, onDownload, fullWidth = false }) {
  const trigger = useRef(null);
  const restoringFocus = useRef(false);
  const panel = useRef(null);
  const timers = useRef({});
  const id = useId();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState(null);
  const [url, setUrl] = useState(asset.version?.previewUrl || "");
  const [error, setError] = useState("");
  const [details, setDetails] = useState(false);
  const version = asset.version;
  const name = asset.logicalName || version?.originalFilename || "File";
  const image = version?.contentType?.startsWith("image/");
  const pdf = version?.contentType === "application/pdf" || /\.pdf$/i.test(name);
  const text = version?.contentType?.startsWith("text/");
  const previewable = image || pdf || text;
  const clean = version?.scanStatus === "clean";
  const clear = useCallback(() => { clearTimeout(timers.current.show); clearTimeout(timers.current.hide); }, []);
  const close = useCallback(() => { clear(); setOpen(false); setExpanded(false); setUrl(asset.version?.previewUrl || ""); setError(""); }, [clear]);
  const enter = (immediate = false) => {
    clear();
    timers.current.show = setTimeout(() => setOpen(true), immediate ? 0 : 600);
  };
  const leave = () => {
    if (expanded) return;
    clear();
    timers.current.hide = setTimeout(() => {
      if (!trigger.current?.contains(document.activeElement) && !panel.current?.contains(document.activeElement)) close();
    }, 800);
  };
  useEffect(() => () => { clearTimeout(timers.current.show); clearTimeout(timers.current.hide); }, []);
  useEffect(() => {
    if(version?.previewUrl){setUrl(version.previewUrl);return;}
    if (!open || !previewable || !clean || !version?.downloadUrl) return;
    const controller = new AbortController();
    let objectUrl;
    fetch(version.downloadUrl, { method: "POST", signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Preview unavailable. Try downloading the file.");
      const data = await response.blob();
      const blob = new Blob([data], { type: image ? version.contentType : pdf ? "application/pdf" : version.contentType });
      if (controller.signal.aborted) return;
      objectUrl = URL.createObjectURL(blob); setUrl(objectUrl);
    }).catch((cause) => { if (!controller.signal.aborted) setError(cause.message); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [open, image, pdf, previewable, clean, version?.contentType, version?.downloadUrl]);
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      if (expanded) { setPosition({ left: 24, top: 24, width: window.innerWidth - 48, height: window.innerHeight - 48 }); return; }
      const width = Math.min(320, window.innerWidth - 24);
      const height = Math.min(310, window.innerHeight - 24);
      const right = rect.right + 8;
      setPosition({ width, maxHeight: height, left: Math.max(12, Math.min(right + width <= window.innerWidth - 12 ? right : rect.left - width - 8, window.innerWidth - width - 12)), top: Math.max(12, Math.min(rect.top - 24, window.innerHeight - height - 12)) });
    };
    const key = (event) => {
      if (event.key === "Escape") {
        event.preventDefault(); close(); restoringFocus.current = true; trigger.current?.focus(); restoringFocus.current = false;
      }
      if (expanded && event.key === "Tab") {
        const controls = [...(panel.current?.querySelectorAll('button:not([disabled]), a[href], iframe') || [])];
        const first = controls[0]; const last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const outside = (event) => { if (!trigger.current?.contains(event.target) && !panel.current?.contains(event.target)) close(); };
    place();
    const focusFrame = expanded ? requestAnimationFrame(() => panel.current?.focus()) : null;
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => { if (focusFrame) cancelAnimationFrame(focusFrame); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [open, expanded, close]);
  const control = "grid size-8 shrink-0 place-items-center rounded-md bg-white text-[#676879] hover:bg-[#e6e9ef] focus-visible:outline-2 focus-visible:outline-[#0073ea]";
  return <>
    <button ref={trigger} id={`${id}-root`} type="button" aria-label={`Preview ${name}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onPointerEnter={(event) => { if (event.pointerType !== "touch") enter(); }} onPointerLeave={leave} onFocus={() => { if (!restoringFocus.current) enter(true); }} onBlur={leave} onClick={(event) => { event.stopPropagation(); setExpanded(true); enter(true); }} className={`inline-flex items-center gap-1 overflow-hidden rounded px-1 text-xs hover:bg-[#e6e9ef] focus-visible:outline-2 focus-visible:outline-[#0073ea] ${fullWidth ? "h-10 w-full text-left" : "h-7 max-w-28"}`}>
      {image && url ? <img data-archive-cell={fullWidth?undefined:asset.demoPhotoIndex} src={url} alt={name} className="h-6 w-6 object-cover" /> : <><FileText className="size-4 shrink-0" /><span className="truncate">{name}</span></>}
    </button>
    {typeof document !== "undefined" && createPortal(<AnimatePresence>{open && position && <motion.div ref={panel} id={id} tabIndex={-1} data-selector-trigger={id} role="dialog" aria-label={`${name} preview`} aria-modal={expanded || undefined} data-work-flow-popover initial={{ opacity: 0, scale: reduced ? 1 : .94, y: reduced ? 0 : 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : .96, y: reduced ? 0 : 3 }} transition={{ duration: reduced ? 0 : .16, ease: "easeOut" }} onPointerEnter={() => clear()} onPointerLeave={leave} onFocus={() => clear()} onBlur={leave} onClick={(event) => event.stopPropagation()} className="fixed z-[240] overflow-auto rounded-lg border border-[#d0d4e4] bg-white p-2 text-[#323338] shadow-[0_8px_30px_rgba(0,0,0,.2)]" style={position}>
      <div className={`relative flex items-center justify-center rounded bg-[#f5f6f8] pl-10 pr-9 ${expanded ? "h-[calc(100%-3rem)] min-h-44" : "h-44"}`}>
        {pdf && url ? <iframe src={url} title={name} className="h-full w-full border-0" /> : text && url ? <iframe src={url} title={name} sandbox="" className="h-full w-full border-0 bg-white" /> : image && url ? <img src={url} alt={name} onError={() => setError("Image preview unavailable.")} className="max-h-full max-w-full object-contain" /> : <div className="text-center text-xs text-[#676879]"><FileText className="mx-auto mb-2 size-10" />{error || (previewable && clean ? "Loading preview…" : clean ? "Preview unavailable for this file type. Use Download file to save a copy." : "Preview awaiting security scan")}</div>}
        <div className="absolute left-1 top-2 flex flex-col gap-1"><button type="button" className={control} aria-label="File version details" onClick={() => setDetails(!details)}>V{version?.versionNumber || 1}</button><button type="button" className={control} aria-label="Download file" disabled={!clean} onClick={() => onDownload(asset)}><Download className="size-4" /></button>{url && <a className={control} href={url} target="_blank" rel="noreferrer" aria-label="Open full size preview"><ExternalLink className="size-4" /></a>}</div>
        <button type="button" className={`${control} absolute right-1 top-1`} aria-label="More file details" aria-expanded={details} onClick={() => setDetails(!details)}><MoreHorizontal className="size-4" /></button>
      </div>
      <div className="flex items-center gap-1 pt-2"><span className="min-w-0 flex-1 truncate text-sm" title={name}>{name}</span><button type="button" className={control} aria-label="File information" onClick={() => setDetails(!details)}><History className="size-4" /></button><button type="button" className={control} aria-label="Close file preview" onClick={close}><X className="size-4" /></button></div>
      {details && <div className="border-t border-[#e6e9ef] pt-2 text-xs text-[#676879]">Version {version?.versionNumber || 1} · {version?.contentType || "Unknown type"}{version?.sizeBytes ? ` · ${Math.ceil(version.sizeBytes / 1024)} KB` : ""}{version?.createdAt && <p className="mt-1">Uploaded {new Date(version.createdAt).toLocaleString()}</p>}</div>}
      {error && url && <p role="alert" className="pt-1 text-xs text-red-700">{error}</p>}
    </motion.div>}</AnimatePresence>, document.body)}
  </>;
}
