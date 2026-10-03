// API layer: reads from VITE_API_URL if set, otherwise uses mock data
import { LEDGER_ROWS, PATIENTS, RESERVE, ITEMS } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL;

export const isLive = !!API_URL;

export async function fetchState() {
  if (!API_URL) {
    return {
      patients: PATIENTS,
      reserve: RESERVE,
      items: ITEMS,
    };
  }
  const r = await fetch(`${API_URL}/state`);
  return r.json();
}

export async function fetchLedger() {
  if (!API_URL) return LEDGER_ROWS;
  const r = await fetch(`${API_URL}/ledger`);
  return r.json();
}

// SSE stream — only for live mode
export function subscribeToEvents(onRow, onError) {
  if (!API_URL) return () => {};
  const es = new EventSource(`${API_URL}/events`);
  es.onmessage = (e) => {
    try { onRow(JSON.parse(e.data)); } catch {}
  };
  es.onerror = onError;
  return () => es.close();
}
