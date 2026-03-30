import { useState } from 'react';
import { tokens } from './components/tokens';
import { StreamPublisher } from './components/StreamPublisher';
import { StreamPlayer } from './components/StreamPlayer';

const DEFAULT_PUBLISHER_URL = 'webrtc://localhost/live/pushstream';
const DEFAULT_PUBLISHER_API = 'http://localhost:1985/rtc/v1/publish/';
const DEFAULT_PLAYER_URL = 'webrtc://localhost/live/livestream';
const DEFAULT_PLAYER_API = 'http://localhost:1985/rtc/v1/play/';

export default function App() {
  const [pubStreamUrl, setPubStreamUrl] = useState(DEFAULT_PUBLISHER_URL);
  const [pubApiUrl, setPubApiUrl] = useState(DEFAULT_PUBLISHER_API);
  const [playerStreamUrl, setPlayerStreamUrl] = useState(DEFAULT_PLAYER_URL);
  const [playerApiUrl, setPlayerApiUrl] = useState(DEFAULT_PLAYER_API);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: tokens.color.bg,
        color: tokens.color.text.primary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          borderBottom: `1px solid ${tokens.color.border}`,
          background: tokens.color.surface,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect
                x="1"
                y="4"
                width="16"
                height="12"
                rx="2"
                stroke={tokens.color.accent}
                strokeWidth="1.5"
              />
              <circle cx="17.5" cy="7.5" r="2" stroke={tokens.color.accent} strokeWidth="1.5" />
              <circle cx="17.5" cy="13.5" r="1.5" stroke={tokens.color.accent} strokeWidth="1.5" />
              <path
                d="M19 10l3 1.5L19 13"
                stroke={tokens.color.accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
              WebRTC Player
            </span>
            <span
              style={{
                padding: '2px 6px',
                borderRadius: 4,
                background: tokens.color.accentLight,
                color: tokens.color.accent,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              DEMO
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: tokens.color.text.muted }}>推流端 + 拉流端</span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '28px 24px 48px',
        }}
      >
        {/* 副标题说明 */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: tokens.color.text.primary,
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
            }}
          >
            摄像头推拉流演示
          </h1>
          <p style={{ fontSize: 14, color: tokens.color.text.secondary, margin: 0 }}>
            摄像头通过推流端发布到流媒体服务器，再由拉流端从服务器订阅并播放。两侧面板独立运行，可同时启用。
          </p>
        </div>

        {/* 流程示意 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            marginBottom: 28,
            padding: '12px 16px',
            background: tokens.color.surface,
            border: `1px solid ${tokens.color.border}`,
            borderRadius: tokens.radius.md,
            fontSize: 13,
            color: tokens.color.text.secondary,
          }}
        >
          <FlowChip label="摄像头" />
          <FlowArrow />
          <FlowChip label="推流端" accent />
          <FlowArrow />
          <FlowChip label="流媒体服务器" />
          <FlowArrow />
          <FlowChip label="拉流端" accent />
          <FlowArrow />
          <FlowChip label="视频播放" />
        </div>

        {/* 双面板 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          <StreamPublisher
            streamUrl={pubStreamUrl}
            apiUrl={pubApiUrl}
            onStreamUrlChange={setPubStreamUrl}
            onApiUrlChange={setPubApiUrl}
          />
          <StreamPlayer
            streamUrl={playerStreamUrl}
            apiUrl={playerApiUrl}
            onStreamUrlChange={setPlayerStreamUrl}
            onApiUrlChange={setPlayerApiUrl}
          />
        </div>

        {/* 底部说明 */}
        <div
          style={{
            marginTop: 24,
            padding: '14px 16px',
            background: tokens.color.surface,
            border: `1px solid ${tokens.color.border}`,
            borderRadius: tokens.radius.md,
          }}
        >
          <p style={{ fontSize: 12, color: tokens.color.text.muted, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: tokens.color.text.secondary }}>使用说明：</strong>
            确认流媒体服务器（ZLMediaKit / SRS / monibuca 等）已启动并启用 WebRTC 功能。
            推流端与拉流端的{' '}
            <code
              style={{
                fontFamily: tokens.font.mono,
                background: tokens.color.surfaceHover,
                padding: '1px 4px',
                borderRadius: 3,
              }}
            >
              streamUrl
            </code>{' '}
            需指向同一流名称（如{' '}
            <code
              style={{
                fontFamily: tokens.font.mono,
                background: tokens.color.surfaceHover,
                padding: '1px 4px',
                borderRadius: 3,
              }}
            >
              webrtc://localhost/live/mycam
            </code>
            ）， 信令地址则根据服务器配置填写对应路径。
          </p>
        </div>
      </main>
    </div>
  );
}

/* ─── Flow diagram chips ─── */

function FlowChip({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: tokens.radius.sm,
        background: accent ? tokens.color.accentLight : tokens.color.surfaceHover,
        color: accent ? tokens.color.accent : tokens.color.text.secondary,
        fontSize: 12,
        fontWeight: accent ? 600 : 400,
        border: `1px solid ${accent ? tokens.color.accent : tokens.color.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function FlowArrow() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M0 6H18M18 6L13 1M18 6L13 11"
        stroke={tokens.color.border}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
