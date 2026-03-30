import { useEffect, useRef } from 'react';
import { tokens } from './tokens';

interface StreamVideoProps {
  stream: MediaStream | null;
  label?: string;
  muted?: boolean;
  autoPlay?: boolean;
}

export function StreamVideo({ stream, label, muted = true, autoPlay = true }: StreamVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: tokens.radius.md,
        overflow: 'hidden',
        background: '#0a0a0a',
        aspectRatio: '16 / 9',
        border: `1px solid ${tokens.color.border}`,
      }}
    >
      <video
        ref={ref}
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
      {label && (
        <span
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            padding: '2px 6px',
            borderRadius: tokens.radius.sm,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.03em',
            backdropFilter: 'blur(4px)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
