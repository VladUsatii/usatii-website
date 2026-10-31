'use client';
import { useEffect, useRef, useState } from 'react';

export function useWorkFlowLive({ boardId, revision, blocked, refresh, request }) {
  const latest = useRef({ revision, blocked, refresh, request });
  useEffect(() => { latest.current = { revision, blocked, refresh, request }; });
  const [state, setState] = useState(null);
  useEffect(() => {
    if (!boardId) return;
    let active = true, inFlight = false, stamp = null, needsRefresh = false;
    const poll = async () => {
      const current = latest.current;
      if (inFlight || document.visibilityState === 'hidden' || current.blocked || document.activeElement?.closest?.('[data-grid-cell], [data-work-flow-popover], [role="dialog"], [role="alertdialog"]')) return;
      inFlight = true;
      try {
        const result = await current.request(`/api/work-flow/v1/boards/${boardId}/live`);
        if (!active) return;
        // Recheck after the request: the user may have begun editing meanwhile.
        if (latest.current.blocked || document.activeElement?.closest?.('[data-grid-cell], [data-work-flow-popover], [role="dialog"]')) return;
        const changed = String(result.data.revision) !== String(latest.current.revision) || (stamp !== null && stamp !== result.data.stamp);
        if (changed) needsRefresh = true;
        if (needsRefresh && await latest.current.refresh() === false) return;
        needsRefresh = false;
        if (!active) return;
        stamp = result.data.stamp;
        setState({ ...result.data, boardId, failed: false });
      } catch { if (active) setState(previous => ({ ...(previous?.boardId === boardId ? previous : {}), boardId, failed: true })); }
      finally { inFlight = false; }
    };
    const timer = window.setInterval(poll, 20000);
    window.addEventListener('focus', poll);
    document.addEventListener('visibilitychange', poll);
    void poll();
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('focus', poll); document.removeEventListener('visibilitychange', poll); };
  }, [boardId]);
  return state?.boardId === boardId ? state : null;
}
