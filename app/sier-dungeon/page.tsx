'use client';

import { useEffect, useRef } from 'react';
import type { Game } from 'phaser';
import Link from 'next/link';

// Route: /sier-dungeon
// Hosts the SIer Dungeon action game in an isolated Phaser instance.
// Does not share state or scene registry with the existing /game route.
export default function SierDungeonPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Game | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;

    (async () => {
      // Dynamic import keeps Phaser out of the SSR bundle
      // @ts-ignore — dynamic import without extension, same pattern as /game page
      const { createDungeonGame } = await import('../../src/game/DungeonGame');
      if (!cancelled && containerRef.current && !gameRef.current) {
        gameRef.current = createDungeonGame(containerRef.current);
      }
    })().catch(console.error);

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050d18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Back button — sits above the Phaser canvas */}
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 100,
          background: '#1a2e4a',
          border: '1px solid #2a5a7c',
          color: '#aabbcc',
          fontSize: 12,
          borderRadius: 6,
          padding: '5px 11px',
          textDecoration: 'none',
          fontFamily: 'monospace',
        }}
      >
        ← ホームへ
      </Link>

      {/* Phaser mounts here; scale: FIT centres the 640×512 canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </main>
  );
}
