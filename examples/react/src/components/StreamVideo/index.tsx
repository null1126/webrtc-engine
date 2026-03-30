import { useEffect, useRef } from 'react';
import './index.css';

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
    <div className="stream-video">
      <video ref={ref} autoPlay={autoPlay} muted={muted} playsInline />
      {label && <span className="stream-video__label">{label}</span>}
    </div>
  );
}
