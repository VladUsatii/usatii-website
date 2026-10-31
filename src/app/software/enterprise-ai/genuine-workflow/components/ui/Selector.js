"use client";

import { Children, isValidElement, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import styles from "./Selector.module.css";

const text = node => Children.toArray(node).map(child => isValidElement(child) ? text(child.props.children) : String(child)).join("");
function readOptions(children, group = "", inheritedDisabled = false) {
  return Children.toArray(children).flatMap(child => {
    if (!isValidElement(child)) return [];
    if (child.type === "option") return [{ value: String(child.props.value ?? text(child.props.children)), label: child.props.label || text(child.props.children), disabled: inheritedDisabled || child.props.disabled, group }];
    return readOptions(child.props.children, child.type === "optgroup" ? child.props.label : group, inheritedDisabled || child.props.disabled);
  });
}
const OPEN_EVENT = "rebuildit-selector-open";
export default function Selector({ children, options: suppliedOptions, value, defaultValue, onChange, name, required, disabled, className = "", label, onBlur, onFocus, ...attributes }) {
  const options = useMemo(() => suppliedOptions ? suppliedOptions.map(option => ({ ...option, value: String(option.value) })) : readOptions(children), [children, suppliedOptions]);
  const [localValue, setLocalValue] = useState(() => String(defaultValue ?? options[0]?.value ?? ""));
  const selectedValue = String(value ?? localValue);
  const [open, setOpen] = useState(false), [query, setQuery] = useState(""), [active, setActive] = useState(0), [position, setPosition] = useState(null), [menuHost,setMenuHost] = useState(null), [invalid, setInvalid] = useState(false);
  const root = useRef(null), trigger = useRef(null), menu = useRef(null), search = useRef(null), input = useRef(null), typeAhead = useRef({ text: "", at: 0 });
  const id = useId(), reduce = useReducedMotion();
  const filtered = useMemo(() => query ? options.filter(option => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : options, [options,query]);
  const selected = useMemo(() => options.find(option => option.value === selectedValue),[options,selectedValue]);
  function close(focus = false) { setOpen(false); if (focus) trigger.current?.focus(); }
  function show() {
    if (disabled || !options.length) return;
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
    setMenuHost(trigger.current?.closest("dialog") || document.body);
    setQuery(""); setActive(Math.max(0, options.findIndex(option => option.value === selectedValue))); setOpen(true);
  }
  function choose(option) {
    if (!option || option.disabled) return;
    setLocalValue(option.value); setInvalid(false);
    const target = input.current;
    if (target) Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(target, option.value);
    onChange?.({ target, currentTarget: target, type: "change", preventDefault() {}, stopPropagation() {} });
    close(true);
  }
  const resetValue=String(defaultValue ?? options[0]?.value ?? "");
  useEffect(() => {
    if(!open)return;
    const other = event => { if (event.detail !== id) setOpen(false); };
    window.addEventListener(OPEN_EVENT, other);
    return () => window.removeEventListener(OPEN_EVENT, other);
  },[id,open]);
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => { setLocalValue(resetValue); setInvalid(false); setOpen(false); };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [resetValue]);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!root.current?.contains(event.target) && !menu.current?.contains(event.target)) close(); };
    const focusOutside = event => { if (!root.current?.contains(event.target) && !menu.current?.contains(event.target)) close(); };
    const dismiss = () => close();
    document.addEventListener("pointerdown", outside, true); document.addEventListener("focusin", focusOutside); window.addEventListener("blur", dismiss);
    return () => { document.removeEventListener("pointerdown", outside, true); document.removeEventListener("focusin", focusOutside); window.removeEventListener("blur", dismiss); };
  }, [open]);
  useLayoutEffect(() => {
    if (!open) return;
    let frame;
    const place = () => {
      const rect = trigger.current.getBoundingClientRect(), width = Math.min(Math.max(rect.width, 200), window.innerWidth - 24);
      const below = window.innerHeight - rect.bottom - 16, above = rect.top - 16, flip = below < 240 && above > below;
      setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), width, maxHeight: Math.max(80, Math.min(320, flip ? above : below)), ...(flip ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }) });
    };
    const schedule=event=>{if(menu.current?.contains(event.target))return;if(frame)return;frame=requestAnimationFrame(()=>{frame=null;place();});};
    place(); window.addEventListener("resize", schedule); window.addEventListener("scroll", schedule, true);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); window.removeEventListener("scroll", schedule, true); };
  }, [open]);
  const menuReady = open && position !== null;
  useEffect(() => { if (menuReady && options.length > 10) search.current?.focus(); }, [menuReady, options.length]);
  useEffect(() => { if (menuReady) menu.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView?.({ block: "nearest" }); }, [menuReady, active]);
  function keyDown(event) {
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); close(true); return; }
    if (event.key === "Tab") { close(); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault(); if (!open) { show(); return; }
      const direction = event.key === "ArrowUp" ? -1 : 1;
      let next = event.key === "Home" ? 0 : event.key === "End" ? filtered.length - 1 : (active + direction + filtered.length) % filtered.length;
      for (let i = 0; i < filtered.length && filtered[next]?.disabled; i++) next = (next + direction + filtered.length) % filtered.length;
      setActive(next); return;
    }
    if (event.key === "Enter" || (event.key === " " && event.target === trigger.current)) {
      event.preventDefault(); if (open) choose(filtered[active]); else show(); return;
    }
    if (event.target === trigger.current && event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const now = event.timeStamp; typeAhead.current = { text: (now - typeAhead.current.at < 700 ? typeAhead.current.text : "") + event.key.toLocaleLowerCase(), at: now };
      const index = filtered.findIndex(option => !option.disabled && option.label.toLocaleLowerCase().startsWith(typeAhead.current.text));
      if (index >= 0) { if (!open) show(); setActive(index); }
    }
  }
  const accessibleLabel = label || attributes["aria-label"];
  return <div ref={root} id={`${id}-root`} className={styles.root} onKeyDown={keyDown}>
    <button {...attributes} data-collaboration-field={attributes["data-collaboration-field"]||name} ref={trigger} type="button" value={selectedValue} role="combobox" aria-label={accessibleLabel} aria-expanded={open} aria-haspopup="listbox" aria-controls={`${id}-list`} aria-activedescendant={open ? `${id}-option-${active}` : undefined} aria-required={required || undefined} aria-invalid={invalid || attributes["aria-invalid"] || undefined} disabled={disabled} className={`${styles.trigger} ${className}`} onBlur={onBlur} onFocus={onFocus} onClick={event => { event.stopPropagation(); if (open) close(); else show(); }}>
      <span>{selected?.label || (selectedValue ? `${selectedValue} (unavailable)` : "Choose…")}</span><motion.span className={styles.chevron} animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : .16 }}><ChevronDown size={14}/></motion.span>
    </button>
    <input ref={input} data-collaboration-ignore="true" className={styles.formValue} tabIndex={-1} aria-hidden="true" name={name} value={selectedValue} onChange={() => {}} disabled={disabled} required={required} onInvalid={event => { event.preventDefault(); setInvalid(true); trigger.current?.focus(); show(); }}/>
    {invalid && <span className={styles.error}>Choose an option.</span>}
    {menuHost && createPortal(<AnimatePresence>{open && position && <motion.div ref={menu} style={position} className={styles.menu} data-selector-trigger={id} initial={{ opacity: 0, y: reduce ? 0 : -4, scale: reduce ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduce ? 0 : -3, scale: reduce ? 1 : .98 }} transition={{ duration: reduce ? 0 : .14 }} onKeyDown={event => { keyDown(event); event.stopPropagation(); }} onPointerDown={event => event.stopPropagation()} onClick={event => event.stopPropagation()}>
      {options.length > 10 && <div className={styles.search}><Search size={14}/><input ref={search} aria-label={`Search ${accessibleLabel || name || "options"}`} value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} placeholder="Search options…"/></div>}
      <div id={`${id}-list`} role="listbox" aria-label={accessibleLabel} className={styles.list}>{filtered.length ? filtered.map((option, index) => <button key={`${option.value}:${index}`} id={`${id}-option-${index}`} data-index={index} data-active={index === active} data-value={option.value} type="button" role="option" tabIndex={-1} aria-selected={option.value === selectedValue} disabled={option.disabled} className={`${styles.option} ${index === active ? styles.active : ""}`} onPointerMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(option)}>{option.group && <small>{option.group}</small>}<span>{option.label}{option.description&&<small className={styles.description}>{option.description}</small>}</span>{option.value === selectedValue && <Check size={14}/>}</button>) : <p className={styles.empty}>No matching options.</p>}</div>
    </motion.div>}</AnimatePresence>, menuHost)}
  </div>;
}
