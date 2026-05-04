'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FONT_STACK = 'Inter, "Avenir Next", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const DEFAULT_MERMAID_SOURCE = `sequenceDiagram
    participant Crew as Field Crew
    participant TG as Telegram Group
    participant Bot as Ingest Bot
    participant Store as Raw/Event/Media Storage
    participant LLM as Narrow LLM Workers
    participant Rules as Business Rules
    participant Ops as Ops DB
    participant Review as Human Review
    participant Out as Reports/Invoices/Map/Client Dashboard

    Crew->>TG: Post JOB/STATUS/LEVELS + two photos
    TG->>Bot: Webhook update
    Bot->>Bot: Verify secret token header
    Bot->>Store: Save raw update + sender + chat_id + message_id
    Bot->>Store: Group album by media_group_id
    Bot->>Store: Download photos via getFile into object storage

    Store->>LLM: Send photos + caption
    LLM->>Store: Return strict extraction JSON

    Store->>Rules: Validate schema + project mapping + evidence count
    Rules->>Ops: Lookup project and work item

    alt Exact/unique match and required fields present
        Rules->>Ops: Create validated completion record
        Ops->>Out: Draft daily report entry
        Ops->>Out: Create invoice candidate
        Ops->>Out: Update internal map state
        Ops->>Out: Update client dashboard if approved
    else Missing/duplicate/ambiguous/low confidence
        Rules->>Review: Route to human review
        Review->>Ops: Approve, reject, or correct
        Ops->>Out: Apply approved state transition
    end`;

function formatMermaidError(error) {
  if (!error) return 'Unknown Mermaid error.';
  if (typeof error === 'string') return error;
  if (typeof error?.str === 'string') return error.str;
  if (typeof error?.message === 'string') return error.message;
  return 'Unable to render Mermaid diagram.';
}

function getSvgDimensions(svgElement) {
  if (!svgElement) return { width: 1200, height: 720 };

  const viewBox = svgElement.viewBox?.baseVal;
  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    return {
      width: Math.round(viewBox.width),
      height: Math.round(viewBox.height),
    };
  }

  const widthAttr = Number.parseFloat(svgElement.getAttribute('width') || '');
  const heightAttr = Number.parseFloat(svgElement.getAttribute('height') || '');

  if (Number.isFinite(widthAttr) && widthAttr > 0 && Number.isFinite(heightAttr) && heightAttr > 0) {
    return {
      width: Math.round(widthAttr),
      height: Math.round(heightAttr),
    };
  }

  const bounds = svgElement.getBoundingClientRect();
  return {
    width: Math.max(Math.round(bounds.width), 1200),
    height: Math.max(Math.round(bounds.height), 720),
  };
}

function loadImageFromObjectUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load SVG for export.'));
    image.src = url;
  });
}

function canvasToJpgBlob(canvas, quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error('Unable to generate JPG file.'));
    }, 'image/jpeg', quality);
  });
}

export default function AdminMermaidStudio() {
  const [source, setSource] = useState(DEFAULT_MERMAID_SOURCE);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [renderError, setRenderError] = useState('');
  const [exportError, setExportError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [lastRenderedAt, setLastRenderedAt] = useState(null);

  const mermaidRef = useRef(null);
  const renderIterationRef = useRef(0);
  const previewRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMermaid() {
      try {
        const module = await import('mermaid');
        if (cancelled) return;

        const mermaid = module.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          fontFamily: FONT_STACK,
          themeVariables: {
            fontFamily: FONT_STACK,
            background: '#f8fafc',
            primaryColor: '#dbeafe',
            primaryBorderColor: '#2563eb',
            primaryTextColor: '#0f172a',
            secondaryColor: '#dcfce7',
            secondaryBorderColor: '#16a34a',
            secondaryTextColor: '#052e16',
            tertiaryColor: '#fef3c7',
            tertiaryBorderColor: '#d97706',
            tertiaryTextColor: '#431407',
            lineColor: '#1e293b',
            textColor: '#0f172a',
            noteBkgColor: '#ffedd5',
            noteBorderColor: '#f97316',
            noteTextColor: '#7c2d12',
            actorBkg: '#e0f2fe',
            actorBorder: '#0284c7',
            actorTextColor: '#0f172a',
            signalColor: '#1e293b',
            signalTextColor: '#0f172a',
            labelBoxBkgColor: '#e2e8f0',
            labelBoxBorderColor: '#475569',
            labelTextColor: '#0f172a',
            sequenceNumberColor: '#0f172a',
            clusterBkg: '#f8fafc',
            clusterBorder: '#94a3b8',
            edgeLabelBackground: '#ffffff',
            defaultLinkColor: '#334155',
            titleColor: '#0f172a',
          },
          flowchart: {
            curve: 'basis',
            useMaxWidth: true,
            htmlLabels: false,
          },
          sequence: {
            useMaxWidth: true,
            actorMargin: 44,
            messageMargin: 32,
            mirrorActors: false,
          },
        });

        mermaidRef.current = mermaid;
        setIsEngineReady(true);
        setRenderError('');
      } catch (error) {
        setRenderError(`Could not load Mermaid: ${formatMermaidError(error)}`);
      }
    }

    loadMermaid();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderDiagram = useCallback(async (nextSource) => {
    const previewElement = previewRef.current;
    const mermaid = mermaidRef.current;
    if (!previewElement || !mermaid) return;

    const sourceValue = String(nextSource || '').trim();
    if (!sourceValue) {
      previewElement.innerHTML = '';
      setRenderError('');
      setLastRenderedAt(null);
      return;
    }

    const renderIteration = ++renderIterationRef.current;
    setRenderError('');
    setExportError('');

    try {
      const renderId = `admin-mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const { svg, bindFunctions } = await mermaid.render(renderId, sourceValue);

      if (renderIteration !== renderIterationRef.current) return;
      previewElement.innerHTML = svg;
      bindFunctions?.(previewElement);
      setLastRenderedAt(new Date());
    } catch (error) {
      if (renderIteration !== renderIterationRef.current) return;
      previewElement.innerHTML = '';
      setLastRenderedAt(null);
      setRenderError(formatMermaidError(error));
    }
  }, []);

  useEffect(() => {
    if (!isEngineReady) return;
    const timeout = setTimeout(() => {
      renderDiagram(source);
    }, 160);

    return () => clearTimeout(timeout);
  }, [source, isEngineReady, renderDiagram]);

  const handleExportJpg = useCallback(async () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    const renderedSvg = previewElement.querySelector('svg');
    if (!renderedSvg) {
      setExportError('Render a valid Mermaid diagram before exporting.');
      return;
    }

    setIsExporting(true);
    setExportError('');

    let svgUrl = '';
    let jpgUrl = '';

    try {
      const clone = renderedSvg.cloneNode(true);
      const { width, height } = getSvgDimensions(renderedSvg);
      const safeWidth = Math.min(Math.max(width, 320), 4096);
      const safeHeight = Math.min(Math.max(height, 180), 4096);

      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      clone.setAttribute('width', String(safeWidth));
      clone.setAttribute('height', String(safeHeight));
      clone.setAttribute('viewBox', `0 0 ${safeWidth} ${safeHeight}`);

      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = `text, tspan { font-family: ${FONT_STACK} !important; }`;
      clone.insertBefore(style, clone.firstChild);

      const svgMarkup = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgMarkup], {
        type: 'image/svg+xml;charset=utf-8',
      });
      svgUrl = URL.createObjectURL(svgBlob);

      const image = await loadImageFromObjectUrl(svgUrl);
      const pixelRatio = 2;
      const padding = 24;

      const canvas = document.createElement('canvas');
      canvas.width = Math.round((safeWidth + padding * 2) * pixelRatio);
      canvas.height = Math.round((safeHeight + padding * 2) * pixelRatio);

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Unable to create canvas context for export.');
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.fillStyle = '#f8fafc';
      context.fillRect(0, 0, safeWidth + padding * 2, safeHeight + padding * 2);
      context.drawImage(image, padding, padding, safeWidth, safeHeight);

      const jpgBlob = await canvasToJpgBlob(canvas);
      jpgUrl = URL.createObjectURL(jpgBlob);

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const anchor = document.createElement('a');
      anchor.href = jpgUrl;
      anchor.download = `mermaid-diagram-${timestamp}.jpg`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      setExportError(formatMermaidError(error));
    } finally {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
      if (jpgUrl) {
        setTimeout(() => URL.revokeObjectURL(jpgUrl), 1000);
      }
      setIsExporting(false);
    }
  }, []);

  const renderStatus = useMemo(() => {
    if (!isEngineReady) return 'Loading Mermaid renderer...';
    if (renderError) return 'Fix syntax to restore the preview.';
    if (!lastRenderedAt) return 'Start typing to render your diagram.';
    return `Last render: ${lastRenderedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}`;
  }, [isEngineReady, lastRenderedAt, renderError]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Mermaid Studio</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
              Code Side-by-Side With Live Preview
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Build flowcharts, sequence diagrams, and charts, then export the rendered result as JPG.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSource(DEFAULT_MERMAID_SOURCE)}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400"
            >
              Load Example
            </button>

            <button
              type="button"
              onClick={handleExportJpg}
              disabled={Boolean(renderError) || !lastRenderedAt || isExporting}
              className="cursor-pointer rounded-md bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? 'Exporting JPG...' : 'Export JPG'}
            </button>
          </div>
        </div>

        <p className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
          {renderStatus}
        </p>

        {exportError ? (
          <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            Export error: {exportError}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Mermaid Code</p>
            <p className="text-[11px] text-neutral-500">Updates automatically while you type.</p>
          </div>
          <textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            spellCheck={false}
            className="h-[620px] w-full resize-y rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-3 font-mono text-[13px] leading-6 text-neutral-900 outline-none focus:border-black focus:bg-white"
            placeholder="Write Mermaid syntax here..."
          />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Live Preview</p>
            <p className="text-[11px] text-neutral-500">Theme + typography aligned with your dashboard.</p>
          </div>

          <div className="min-h-[620px] overflow-auto rounded-lg border border-neutral-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
            <div
              ref={previewRef}
              className="mx-auto w-full max-w-[1400px] [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-full [&_svg]:rounded-lg [&_svg]:border [&_svg]:border-neutral-200 [&_svg]:bg-white [&_svg]:p-3"
            />

            {!isEngineReady ? (
              <p className="text-sm text-neutral-500">Loading Mermaid engine...</p>
            ) : null}

            {isEngineReady && !source.trim() ? (
              <p className="text-sm text-neutral-500">Paste Mermaid syntax to start rendering.</p>
            ) : null}
          </div>

          {renderError ? (
            <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              Render error: {renderError}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
