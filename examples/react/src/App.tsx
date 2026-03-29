import { useEffect, useRef, useState } from 'react';
import { RtcPlayer, RtcPublisher, RtcState } from '@webrtc-player/core';

type Tab = 'player' | 'publisher';

function App() {
  const [tab, setTab] = useState<Tab>('player');

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>WebRTC Player</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setTab('player')} style={tabStyle(tab === 'player')}>
          拉流
        </button>
        <button onClick={() => setTab('publisher')} style={tabStyle(tab === 'publisher')}>
          推流
        </button>
      </div>

      {tab === 'player' && <PlayerDemo />}
      {tab === 'publisher' && <PublisherDemo />}
    </div>
  );
}

/* ───────────── 拉流示例 ───────────── */
function PlayerDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<RtcPlayer | null>(null);
  const [state, setState] = useState<RtcState>(RtcState.CONNECTING);
  const [url, setUrl] = useState('webrtc://localhost/live/livestream');

  useEffect(() => {
    if (!videoRef.current) return;

    playerRef.current = new RtcPlayer({
      url,
      api: 'http://localhost:1985/rtc/v1/play/',
      video: videoRef.current,
    });

    playerRef.current.on('track', ({ stream }) => {
      console.log('[Player] track:', stream);
    });

    playerRef.current.on('state', (s) => {
      console.log('[Player] state:', s);
      setState(s);
    });

    playerRef.current.on('error', (err) => {
      console.error('[Player] error:', err);
    });

    playerRef.current.on('icecandidate', (candidate) => {
      console.log('[Player] icecandidate:', candidate);
    });

    playerRef.current.play();

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const switchStream = (newUrl: string) => {
    setUrl(newUrl);
    playerRef.current?.switchStream(newUrl);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => switchStream('webrtc://localhost/live/livestream')}>流1</button>
        <button onClick={() => switchStream('webrtc://localhost/live/livestream1')}>流2</button>
        <button
          onClick={() => {
            playerRef.current?.destroy();
            playerRef.current = null;
          }}
        >
          销毁
        </button>
      </div>

      <p>
        拉流状态: <strong>{state}</strong>
      </p>

      <video
        ref={videoRef}
        style={{
          display: 'block',
          width: '640px',
          maxWidth: '100%',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
        muted
        controls
      />
    </div>
  );
}

/* ───────────── 推流示例 ───────────── */
type SourceType = 'camera' | 'screen' | 'custom';

function PublisherDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const publisherRef = useRef<RtcPublisher | null>(null);
  const [state, setState] = useState<RtcState>(RtcState.CLOSED);
  const [sourceType, setSourceType] = useState<SourceType>('camera');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const startPublisher = async () => {
    if (publisherRef.current) return;

    const source =
      sourceType === 'camera'
        ? { type: 'camera' as const }
        : sourceType === 'screen'
          ? { type: 'screen' as const, audio: false }
          : { type: 'camera' as const };

    const pub = new RtcPublisher({
      url: 'webrtc://localhost/live/pushstream',
      api: 'http://localhost:1985/rtc/v1/publish/',
      source,
      video: videoRef.current ?? undefined,
    });

    publisherRef.current = pub;

    pub.on('state', (s) => {
      console.log('[Publisher] state:', s);
      setState(s);
    });

    pub.on('error', (err) => {
      console.error('[Publisher] error:', err);
    });

    pub.on('streamstart', ({ stream }) => {
      console.log('[Publisher] streamstart:', stream);
      setLocalStream(stream);
    });

    pub.on('sourcechange', (src) => {
      console.log('[Publisher] sourcechange:', src);
    });

    pub.on('track', ({ stream }) => {
      console.log('[Publisher] track (remote):', stream);
    });

    try {
      await pub.start();
    } catch (err) {
      console.error('[Publisher] start failed:', err);
    }
  };

  const stopPublisher = () => {
    publisherRef.current?.stop();
    publisherRef.current?.destroy();
    publisherRef.current = null;
    setLocalStream(null);
  };

  const switchSource = (type: SourceType) => {
    setSourceType(type);
    if (!publisherRef.current) return;

    const source =
      type === 'camera'
        ? { type: 'camera' as const }
        : type === 'screen'
          ? { type: 'screen' as const, audio: false }
          : { type: 'camera' as const };

    publisherRef.current.switchSource(source);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value as SourceType)}
          disabled={!!publisherRef.current}
          style={{ padding: '6px 12px' }}
        >
          <option value="camera">摄像头</option>
          <option value="screen">屏幕录制</option>
        </select>

        {!publisherRef.current ? (
          <button onClick={startPublisher} style={btnStyle()}>
            开始推流
          </button>
        ) : (
          <>
            <button onClick={() => switchSource(sourceType)} style={btnStyle()}>
              切换输入源
            </button>
            <button onClick={stopPublisher} style={btnStyle('red')}>
              停止推流
            </button>
          </>
        )}
      </div>

      <p>
        推流状态: <strong>{state}</strong>
      </p>

      {state === RtcState.CONNECTED && (
        <p style={{ color: '#22c55e', fontSize: '14px' }}>推流成功</p>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {localStream && (
          <div>
            <p style={{ fontSize: '14px', color: '#666' }}>本地预览</p>
            <LocalStreamView stream={localStream} />
          </div>
        )}
      </div>
    </div>
  );
}

function LocalStreamView({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      playsInline
      style={{
        width: '320px',
        maxWidth: '100%',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    />
  );
}

/* ───────────── 样式辅助 ───────────── */
function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    background: active ? '#3b82f6' : '#e5e7eb',
    color: active ? '#fff' : '#374151',
    fontWeight: active ? '600' : '400',
  };
}

function btnStyle(color = 'blue'): React.CSSProperties {
  const bg = color === 'red' ? '#ef4444' : '#3b82f6';
  return {
    padding: '6px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    background: bg,
    color: '#fff',
    fontSize: '14px',
  };
}

export default App;
