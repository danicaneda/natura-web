'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const dot = cursor.querySelector('.cursor-dot') as HTMLElement;
    const ring = cursor.querySelector('.cursor-ring') as HTMLElement;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dot) {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      if (ring) {
        const dx = posRef.current.x - ringRef.current.x;
        const dy = posRef.current.y - ringRef.current.y;
        ringRef.current.x += dx * 0.12;
        ringRef.current.y += dy * 0.12;
        ring.style.left = `${ringRef.current.x}px`;
        ring.style.top = `${ringRef.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => cursor.classList.add('hovered');
    const onLeave = () => cursor.classList.remove('hovered');
    const onDown = () => cursor.classList.add('clicking');
    const onUp = () => cursor.classList.remove('clicking');

    const attachHover = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    attachHover();
    rafRef.current = requestAnimationFrame(animate);

    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <div id="custom-cursor" ref={cursorRef} aria-hidden="true">
      <div
        className="cursor-dot"
        style={{ position: 'fixed', width: 8, height: 8, background: '#B8860B', borderRadius: '50%', pointerEvents: 'none', transform: 'translate(-50%,-50%)', zIndex: 99999 }}
      />
      <div
        className="cursor-ring"
        style={{ position: 'fixed', width: 36, height: 36, border: '1.5px solid rgba(184,134,11,0.45)', borderRadius: '50%', pointerEvents: 'none', transform: 'translate(-50%,-50%)', zIndex: 99998, transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease' }}
      />
    </div>
  );
}
