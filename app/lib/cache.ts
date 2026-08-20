const DEFAULT_TTL = 5 * 60 * 1000; // 5 min

function read<T>(key: string): { data: T; ts: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as { data: T; ts: number };
  } catch {
    return null;
  }
}

export function getCached<T>(key: string, ttl = DEFAULT_TTL): T | null {
  const entry = read<T>(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > ttl) return null;
  return entry.data;
}

export function setCached<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export function clearCached(key: string): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(key); } catch {}
}

// Stale-while-revalidate: return cached immediately, refresh in background
export async function swr<T>(
  key: string,
  fetcher: () => Promise<T>,
  onUpdate: (data: T) => void,
  ttl = DEFAULT_TTL,
): Promise<T | null> {
  const cached = read<T>(key);
  const stale  = cached ? Date.now() - cached.ts > ttl : false;

  if (cached && !stale) {
    onUpdate(cached.data);
    return cached.data;
  }

  const refresh = () =>
    fetcher()
      .then(data => { setCached(key, data); onUpdate(data); return data; })
      .catch(() => null);

  if (cached && stale) {
    onUpdate(cached.data);
    refresh();
    return cached.data;
  }

  return refresh();
}
