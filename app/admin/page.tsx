'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Producto {
  id: number; nombre: string; categoria: string; descripcion?: string;
  precio?: number; precio_oferta?: number; disponible: boolean; destacado: boolean;
  imagen_url?: string; etiquetas: string[];
}
interface GalleryImg {
  id: number; titulo?: string; imagen_url: string; categoria?: string; status: string;
}
interface Testimonio {
  id: number; nombre: string; texto: string; nota: number;
  ocasion?: string; avatar?: string; verificado: boolean; orden: number;
}
interface Config {
  maintenance_mode: boolean; maintenance_title: string; maintenance_message: string;
}

type Tab = 'productos' | 'galeria' | 'testimonios' | 'config';

// ── Helpers ───────────────────────────────────────────────────────────────────

const api = async (url: string, opts: RequestInit = {}) => {
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...opts.headers } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Error ${res.status}`);
  }
  return res.json();
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: 'ok' | 'err'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
      background: type === 'ok' ? '#14532d' : '#7f1d1d',
      color: type === 'ok' ? '#bbf7d0' : '#fecaca',
      padding: '12px 20px', fontFamily: 'Jost, sans-serif', fontSize: '0.85rem',
      borderLeft: `3px solid ${type === 'ok' ? '#22c55e' : '#ef4444'}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)', maxWidth: 360,
      animation: 'fadeInUp 0.3s ease both',
    }}>
      {msg}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
      background: 'rgba(212,160,23,0.12)', color: '#D4A017',
      border: '1px solid rgba(212,160,23,0.2)', fontSize: '0.7rem',
      letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif',
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1 }}>×</button>
    </span>
  );
}

// ── Productos Tab ─────────────────────────────────────────────────────────────

function ProductosTab({ toast }: { toast: (m: string, t: 'ok' | 'err') => void }) {
  const [items, setItems]         = useState<Producto[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState<Producto | null>(null);
  const [creating, setCreating]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [etiquetaInput, setEtIn]  = useState('');

  const blank: Omit<Producto, 'id'> = {
    nombre: '', categoria: 'flores', descripcion: '', precio: undefined,
    precio_oferta: undefined, disponible: true, destacado: false,
    imagen_url: '', etiquetas: [],
  };
  const [draft, setDraft] = useState<Omit<Producto, 'id'>>(blank);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api('/api/admin/productos')); }
    catch { toast('Error cargando productos', 'err'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const startEdit = (p: Producto) => {
    setEditing(p);
    setDraft({ nombre: p.nombre, categoria: p.categoria, descripcion: p.descripcion ?? '',
      precio: p.precio, precio_oferta: p.precio_oferta,
      disponible: p.disponible, destacado: p.destacado,
      imagen_url: p.imagen_url ?? '', etiquetas: [...p.etiquetas] });
    setCreating(false);
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setDraft(blank);
  };

  const save = async () => {
    if (!draft.nombre.trim()) { toast('El nombre es obligatorio', 'err'); return; }
    setSaving(true);
    try {
      if (creating) {
        await api('/api/admin/productos', { method: 'POST', body: JSON.stringify(draft) });
        toast('Producto creado', 'ok');
        setCreating(false);
      } else if (editing) {
        await api(`/api/admin/productos/${editing.id}`, { method: 'PUT', body: JSON.stringify(draft) });
        toast('Producto actualizado', 'ok');
        setEditing(null);
      }
      await load();
    } catch (e) { toast((e as Error).message, 'err'); }
    finally { setSaving(false); }
  };

  const toggleField = async (p: Producto, field: 'disponible' | 'destacado') => {
    try {
      await api(`/api/admin/productos/${p.id}`, { method: 'PUT', body: JSON.stringify({ [field]: !p[field] }) });
      setItems(prev => prev.map(x => x.id === p.id ? { ...x, [field]: !x[field] } : x));
    } catch (e) { toast((e as Error).message, 'err'); }
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await api(`/api/admin/productos/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(x => x.id !== id));
      toast('Producto eliminado', 'ok');
    } catch (e) { toast((e as Error).message, 'err'); }
  };

  const addEtiqueta = () => {
    const v = etiquetaInput.trim();
    if (v && !draft.etiquetas.includes(v)) {
      setDraft(d => ({ ...d, etiquetas: [...d.etiquetas, v] }));
    }
    setEtIn('');
  };

  const form = (
    <div style={{ background: '#1A1208', border: '1px solid rgba(212,160,23,0.15)', padding: '24px', marginBottom: 24 }}>
      <p style={S.sectionTitle}>{creating ? 'Nuevo producto' : `Editando: ${editing?.nombre}`}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={S.label}>Nombre *</label>
          <input style={S.input} value={draft.nombre} onChange={e => setDraft(d => ({ ...d, nombre: e.target.value }))} />
        </div>
        <div>
          <label style={S.label}>Categoría</label>
          <select style={S.input} value={draft.categoria} onChange={e => setDraft(d => ({ ...d, categoria: e.target.value }))}>
            {['flores', 'plantas', 'ramos', 'macetas', 'accesorios'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Precio (€)</label>
          <input style={S.input} type="number" step="0.01" value={draft.precio ?? ''} onChange={e => setDraft(d => ({ ...d, precio: e.target.value ? parseFloat(e.target.value) : undefined }))} />
        </div>
        <div>
          <label style={S.label}>Precio oferta (€)</label>
          <input style={S.input} type="number" step="0.01" value={draft.precio_oferta ?? ''} onChange={e => setDraft(d => ({ ...d, precio_oferta: e.target.value ? parseFloat(e.target.value) : undefined }))} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={S.label}>Imagen URL</label>
          <input style={S.input} value={draft.imagen_url ?? ''} onChange={e => setDraft(d => ({ ...d, imagen_url: e.target.value }))} placeholder="https://... o /media/..." />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={S.label}>Descripción</label>
          <textarea style={{ ...S.input, height: 80, resize: 'vertical' }} value={draft.descripcion ?? ''} onChange={e => setDraft(d => ({ ...d, descripcion: e.target.value }))} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Etiquetas</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          {draft.etiquetas.map(t => <Chip key={t} label={t} onRemove={() => setDraft(d => ({ ...d, etiquetas: d.etiquetas.filter(x => x !== t) }))} />)}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ ...S.input, flex: 1 }} value={etiquetaInput} onChange={e => setEtIn(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEtiqueta(); } }}
            placeholder="Nueva etiqueta + Enter" />
          <button style={S.btnSecondary} onClick={addEtiqueta}>+</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#EDE0C4', fontFamily: 'Jost, sans-serif', fontSize: '0.8rem' }}>
          <input type="checkbox" checked={draft.disponible} onChange={e => setDraft(d => ({ ...d, disponible: e.target.checked }))} /> Disponible
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#EDE0C4', fontFamily: 'Jost, sans-serif', fontSize: '0.8rem' }}>
          <input type="checkbox" checked={draft.destacado} onChange={e => setDraft(d => ({ ...d, destacado: e.target.checked }))} /> Destacado
        </label>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        <button style={S.btnGhost} onClick={() => { setEditing(null); setCreating(false); }}>Cancelar</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={S.tabTitle}>Productos ({items.length})</p>
        <button style={S.btnPrimary} onClick={startCreate}>+ Nuevo</button>
      </div>

      {(editing || creating) && form}

      {loading ? <p style={S.muted}>Cargando…</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0F0B05', borderLeft: `2px solid ${p.disponible ? 'rgba(212,160,23,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
              {p.imagen_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagen_url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#FAF6EE', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{p.nombre}</p>
                <p style={{ color: 'rgba(245,230,192,0.4)', fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', margin: 0 }}>
                  {p.categoria} {p.precio ? `· ${p.precio}€` : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <button style={{ ...S.pill, background: p.disponible ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: p.disponible ? '#22c55e' : '#94a3b8' }}
                  onClick={() => toggleField(p, 'disponible')} title="Toggle disponible">
                  {p.disponible ? 'Activo' : 'Oculto'}
                </button>
                <button style={{ ...S.pill, background: p.destacado ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.06)', color: p.destacado ? '#D4A017' : '#94a3b8' }}
                  onClick={() => toggleField(p, 'destacado')} title="Toggle destacado">
                  {p.destacado ? '★ Dest.' : '☆'}
                </button>
                <button style={S.btnIconEdit} onClick={() => startEdit(p)} title="Editar">✎</button>
                <button style={S.btnIconDel} onClick={() => del(p.id)} title="Eliminar">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Galería Tab ───────────────────────────────────────────────────────────────

function GaleriaTab({ toast }: { toast: (m: string, t: 'ok' | 'err') => void }) {
  const [items, setItems]       = useState<GalleryImg[]>([]);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [saving, setSaving]     = useState(false);
  const [draft, setDraft]       = useState({ imagen_url: '', titulo: '', categoria: '', status: 'publicado' });

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api('/api/admin/gallery')); }
    catch { toast('Error cargando galería', 'err'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!draft.imagen_url.trim()) { toast('La URL de imagen es obligatoria', 'err'); return; }
    setSaving(true);
    try {
      await api('/api/admin/gallery', { method: 'POST', body: JSON.stringify(draft) });
      toast('Imagen añadida', 'ok');
      setAdding(false);
      setDraft({ imagen_url: '', titulo: '', categoria: '', status: 'publicado' });
      await load();
    } catch (e) { toast((e as Error).message, 'err'); }
    finally { setSaving(false); }
  };

  const toggleStatus = async (img: GalleryImg) => {
    const newStatus = img.status === 'publicado' ? 'borrador' : 'publicado';
    try {
      await api(`/api/admin/gallery/${img.id}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
      setItems(prev => prev.map(x => x.id === img.id ? { ...x, status: newStatus } : x));
    } catch (e) { toast((e as Error).message, 'err'); }
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar imagen de la galería?')) return;
    try {
      await api(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(x => x.id !== id));
      toast('Imagen eliminada', 'ok');
    } catch (e) { toast((e as Error).message, 'err'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={S.tabTitle}>Galería ({items.length})</p>
        <button style={S.btnPrimary} onClick={() => setAdding(v => !v)}>+ Añadir imagen</button>
      </div>

      {adding && (
        <div style={{ background: '#1A1208', border: '1px solid rgba(212,160,23,0.15)', padding: '20px', marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={S.label}>URL de imagen *</label>
              <input style={S.input} value={draft.imagen_url} onChange={e => setDraft(d => ({ ...d, imagen_url: e.target.value }))} placeholder="https://res.cloudinary.com/..." />
            </div>
            <div>
              <label style={S.label}>Título (opcional)</label>
              <input style={S.input} value={draft.titulo} onChange={e => setDraft(d => ({ ...d, titulo: e.target.value }))} />
            </div>
            <div>
              <label style={S.label}>Categoría (opcional)</label>
              <input style={S.input} value={draft.categoria} onChange={e => setDraft(d => ({ ...d, categoria: e.target.value }))} placeholder="bodas, eventos…" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Añadir'}</button>
            <button style={S.btnGhost} onClick={() => setAdding(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? <p style={S.muted}>Cargando…</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {items.map(img => (
            <div key={img.id} style={{ position: 'relative', background: '#0F0B05', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imagen_url} alt={img.titulo ?? ''} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', opacity: img.status === 'publicado' ? 1 : 0.4 }} />
              <div style={{ padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: 'rgba(245,230,192,0.7)', fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.titulo || img.categoria || '—'}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ ...S.pill, flex: 1, background: img.status === 'publicado' ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: img.status === 'publicado' ? '#22c55e' : '#94a3b8', fontSize: '0.62rem' }}
                    onClick={() => toggleStatus(img)}>
                    {img.status === 'publicado' ? 'Pub.' : 'Draft'}
                  </button>
                  <button style={S.btnIconDel} onClick={() => del(img.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Testimonios Tab ───────────────────────────────────────────────────────────

function TestimoniosTab({ toast }: { toast: (m: string, t: 'ok' | 'err') => void }) {
  const [items, setItems]     = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding]   = useState(false);
  const [saving, setSaving]   = useState(false);
  const [draft, setDraft]     = useState({ nombre: '', texto: '', nota: 5, ocasion: '', verificado: true });

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api('/api/admin/testimonios')); }
    catch { toast('Error cargando testimonios', 'err'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!draft.nombre.trim() || !draft.texto.trim()) { toast('Nombre y texto son obligatorios', 'err'); return; }
    setSaving(true);
    try {
      await api('/api/admin/testimonios', { method: 'POST', body: JSON.stringify(draft) });
      toast('Testimonio añadido', 'ok');
      setAdding(false);
      setDraft({ nombre: '', texto: '', nota: 5, ocasion: '', verificado: true });
      await load();
    } catch (e) { toast((e as Error).message, 'err'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('¿Eliminar testimonio?')) return;
    try {
      await api(`/api/admin/testimonios/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(x => x.id !== id));
      toast('Testimonio eliminado', 'ok');
    } catch (e) { toast((e as Error).message, 'err'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={S.tabTitle}>Testimonios ({items.length})</p>
        <button style={S.btnPrimary} onClick={() => setAdding(v => !v)}>+ Añadir</button>
      </div>

      {adding && (
        <div style={{ background: '#1A1208', border: '1px solid rgba(212,160,23,0.15)', padding: '20px', marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={S.label}>Nombre *</label>
              <input style={S.input} value={draft.nombre} onChange={e => setDraft(d => ({ ...d, nombre: e.target.value }))} />
            </div>
            <div>
              <label style={S.label}>Ocasión</label>
              <input style={S.input} value={draft.ocasion} onChange={e => setDraft(d => ({ ...d, ocasion: e.target.value }))} placeholder="Boda, Regalo…" />
            </div>
            <div>
              <label style={S.label}>Nota (1-5)</label>
              <select style={S.input} value={draft.nota} onChange={e => setDraft(d => ({ ...d, nota: parseInt(e.target.value) }))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={S.label}>Texto *</label>
              <textarea style={{ ...S.input, height: 100, resize: 'vertical' }} value={draft.texto} onChange={e => setDraft(d => ({ ...d, texto: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Añadir'}</button>
            <button style={S.btnGhost} onClick={() => setAdding(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? <p style={S.muted}>Cargando…</p> : items.length === 0 ? (
        <p style={S.muted}>No hay testimonios en la base de datos. Los de la web son estáticos; añade aquí para que aparezcan dinámicamente.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(t => (
            <div key={t.id} style={{ background: '#0F0B05', padding: '14px 16px', borderLeft: '2px solid rgba(212,160,23,0.2)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#B8860B,#D4A017)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF6EE', fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', flexShrink: 0 }}>
                {t.avatar || t.nombre.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#FAF6EE', fontFamily: 'Jost, sans-serif', fontSize: '0.88rem', margin: '0 0 4px 0', fontWeight: 500 }}>{t.nombre}</p>
                <p style={{ color: 'rgba(245,230,192,0.4)', fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', margin: '0 0 6px 0' }}>{t.ocasion || '—'} · {'★'.repeat(t.nota)}</p>
                <p style={{ color: 'rgba(245,230,192,0.6)', fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', margin: 0, fontStyle: 'italic' }}>&ldquo;{t.texto}&rdquo;</p>
              </div>
              <button style={S.btnIconDel} onClick={() => del(t.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Config Tab ────────────────────────────────────────────────────────────────

function ConfigTab({ toast }: { toast: (m: string, t: 'ok' | 'err') => void }) {
  const [cfg, setCfg]     = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    api('/api/admin/config')
      .then(d => setCfg(d))
      .catch(() => toast('Error cargando configuración', 'err'))
      .finally(() => setLoading(false));
  }, [toast]);

  const save = async () => {
    if (!cfg) return;
    setSaving(true);
    try {
      await api('/api/admin/config', { method: 'POST', body: JSON.stringify(cfg) });
      toast('Configuración guardada', 'ok');
    } catch (e) { toast((e as Error).message, 'err'); }
    finally { setSaving(false); }
  };

  if (loading) return <p style={S.muted}>Cargando…</p>;
  if (!cfg) return null;

  return (
    <div>
      <p style={S.tabTitle}>Configuración del sitio</p>
      <div style={{ background: '#0F0B05', border: '1px solid rgba(212,160,23,0.1)', padding: '24px', maxWidth: 520 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, cursor: 'pointer' }}>
          <div
            onClick={() => setCfg(c => c ? { ...c, maintenance_mode: !c.maintenance_mode } : c)}
            style={{
              width: 44, height: 24, borderRadius: 12, position: 'relative', cursor: 'pointer',
              background: cfg.maintenance_mode ? '#B8860B' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{ position: 'absolute', top: 3, left: cfg.maintenance_mode ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#FAF6EE', transition: 'left 0.2s ease' }} />
          </div>
          <div>
            <p style={{ color: '#FAF6EE', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>Modo mantenimiento</p>
            <p style={{ color: 'rgba(245,230,192,0.4)', fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', margin: 0 }}>
              {cfg.maintenance_mode ? '⚠ Activo — la web muestra la pantalla de mantenimiento' : 'Inactivo — la web funciona con normalidad'}
            </p>
          </div>
        </label>

        {cfg.maintenance_mode && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Título de mantenimiento</label>
              <input style={S.input} value={cfg.maintenance_title} onChange={e => setCfg(c => c ? { ...c, maintenance_title: e.target.value } : c)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Mensaje de mantenimiento</label>
              <textarea style={{ ...S.input, height: 80, resize: 'vertical' }} value={cfg.maintenance_message} onChange={e => setCfg(c => c ? { ...c, maintenance_message: e.target.value } : c)} />
            </div>
          </>
        )}

        <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
      </div>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const S = {
  label:       { display: 'block', color: 'rgba(245,230,192,0.45)', fontFamily: 'Jost, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 5 },
  input:       { display: 'block', width: '100%', background: '#0F0B05', border: '1px solid rgba(212,160,23,0.15)', color: '#FAF6EE', fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', padding: '9px 12px', outline: 'none' },
  btnPrimary:  { background: '#B8860B', color: '#FAF6EE', border: 'none', padding: '10px 20px', fontFamily: 'Jost, sans-serif', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer' },
  btnSecondary:{ background: 'rgba(212,160,23,0.12)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.25)', padding: '9px 14px', fontFamily: 'Jost, sans-serif', fontSize: '0.78rem', cursor: 'pointer' },
  btnGhost:    { background: 'transparent', color: 'rgba(245,230,192,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', fontFamily: 'Jost, sans-serif', fontSize: '0.78rem', cursor: 'pointer' },
  btnIconEdit: { background: 'rgba(212,160,23,0.1)', color: '#D4A017', border: 'none', width: 30, height: 30, cursor: 'pointer', fontSize: '0.9rem' },
  btnIconDel:  { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', width: 30, height: 30, cursor: 'pointer', fontSize: '0.8rem' },
  pill:        { border: 'none', padding: '3px 8px', fontFamily: 'Jost, sans-serif', fontSize: '0.68rem', cursor: 'pointer', textTransform: 'uppercase' as const, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const },
  sectionTitle:{ color: '#D4A017', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem', fontWeight: 400, margin: '0 0 16px 0' },
  tabTitle:    { color: '#FAF6EE', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.5rem', fontWeight: 300, margin: '0 0 4px 0' },
  muted:       { color: 'rgba(245,230,192,0.35)', fontFamily: 'Jost, sans-serif', fontSize: '0.85rem' },
};

// ── Login ─────────────────────────────────────────────────────────────────────

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: pw }) });
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0806', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <svg width="32" height="42" viewBox="0 0 20 26" fill="none" style={{ marginBottom: 16 }}>
            <path d="M10 25 Q9.5 18 10 8" stroke="#D4A017" strokeWidth="1.15" strokeLinecap="round" />
            <path d="M10 21 C8 19 5 19 4 17 C6 13 10 15 10 19 Z" fill="#D4A017" />
            <path d="M10 16 C12 14 15 13 16 11 C14 7 10 9 10 14 Z" fill="#D4A017" opacity="0.78" />
            <path d="M10 9 C9.5 7 9 5 10 3 C11 5 10.5 7 10 9 Z" fill="#D4A017" opacity="0.5" />
          </svg>
          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '0.3em', color: '#FAF6EE', margin: 0, textTransform: 'uppercase' }}>NATURA</p>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(212,160,23,0.4)', margin: '6px 0 0 0', textTransform: 'uppercase' }}>Panel de administración</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={S.label}>Contraseña</label>
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={e => setPw(e.target.value)}
              style={{ ...S.input, fontSize: '1rem' }}
              placeholder="••••••••"
            />
          </div>
          {error && <p style={{ color: '#fca5a5', fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
          <button type="submit" style={{ ...S.btnPrimary, width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'Verificando…' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28 }}>
          <a href="/" style={{ color: 'rgba(212,160,23,0.35)', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
            ← Volver a la web
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'productos',   label: 'Productos',   icon: '✿' },
  { id: 'galeria',     label: 'Galería',     icon: '◫' },
  { id: 'testimonios', label: 'Testimonios', icon: '❝' },
  { id: 'config',      label: 'Config',      icon: '⚙' },
];

export default function AdminPage() {
  const [auth, setAuth]   = useState<'loading' | 'in' | 'out'>('loading');
  const [tab, setTab]     = useState<Tab>('productos');
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = useCallback((msg: string, type: 'ok' | 'err') => setToast({ msg, type }), []);

  useEffect(() => {
    fetch('/api/admin/session')
      .then(r => setAuth(r.ok ? 'in' : 'out'))
      .catch(() => setAuth('out'));
  }, []);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuth('out');
  };

  if (auth === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0806', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B8860B', animation: 'dotPulse 1.2s ease-in-out infinite' }} />
      </div>
    );
  }

  if (auth === 'out') return <Login onSuccess={() => setAuth('in')} />;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0806', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{ background: '#0F0B05', borderBottom: '1px solid rgba(212,160,23,0.1)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="24" viewBox="0 0 20 26" fill="none">
            <path d="M10 25 Q9.5 18 10 8" stroke="#D4A017" strokeWidth="1.15" strokeLinecap="round" />
            <path d="M10 21 C8 19 5 19 4 17 C6 13 10 15 10 19 Z" fill="#D4A017" />
            <path d="M10 16 C12 14 15 13 16 11 C14 7 10 9 10 14 Z" fill="#D4A017" opacity="0.78" />
          </svg>
          <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', letterSpacing: '0.2em', color: '#EDE0C4', textTransform: 'uppercase', fontWeight: 300 }}>Admin</span>
          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(212,160,23,0.35)', textTransform: 'uppercase' }}>Natura</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(245,230,192,0.35)', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Ver web ↗</a>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,230,192,0.4)', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', padding: '6px 14px' }}>Salir</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar — desktop */}
        <aside style={{ width: 200, background: '#0D0906', borderRight: '1px solid rgba(212,160,23,0.08)', padding: '20px 0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}
          className="hidden md:flex">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', background: tab === t.id ? 'rgba(184,134,11,0.1)' : 'transparent', color: tab === t.id ? '#D4A017' : 'rgba(245,230,192,0.4)', fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', borderLeft: `2px solid ${tab === t.id ? '#B8860B' : 'transparent'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}>
              <span style={{ fontSize: '0.9rem' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '28px 24px' }}>
          {tab === 'productos'   && <ProductosTab   toast={showToast} />}
          {tab === 'galeria'     && <GaleriaTab     toast={showToast} />}
          {tab === 'testimonios' && <TestimoniosTab toast={showToast} />}
          {tab === 'config'      && <ConfigTab      toast={showToast} />}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav style={{ background: '#0F0B05', borderTop: '1px solid rgba(212,160,23,0.1)', display: 'flex', padding: '8px 0' }}
        className="md:hidden">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: tab === t.id ? '#D4A017' : 'rgba(245,230,192,0.3)', padding: '6px 4px' }}>
            <span style={{ fontSize: '1rem' }}>{t.icon}</span>
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.label}</span>
          </button>
        ))}
      </nav>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
