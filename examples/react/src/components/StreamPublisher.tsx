import { useRef, useState } from 'react';
import { RtcPublisher, RtcState, type MediaSource } from '@webrtc-player/core';
import { tokens } from './tokens';
import { StatusBadge } from './StatusBadge';
import { StreamVideo } from './StreamVideo';

export type PublisherSourceType = 'camera' | 'screen';

interface StreamPublisherProps {
  streamUrl: string;
  apiUrl: string;
  onStreamUrlChange: (url: string) => void;
  onApiUrlChange: (url: string) => void;
}

interface LogEntry {
  id: number;
  time: string;
  level: 'info' | 'error';
  message: string;
}

let logId = 0;
function mkLog(level: LogEntry['level'], message: string): LogEntry {
  const now = new Date();
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
  return { id: ++logId, time, level, message };
}

export function StreamPublisher({
  streamUrl,
  apiUrl,
  onStreamUrlChange,
  onApiUrlChange,
}: StreamPublisherProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const publisherRef = useRef<RtcPublisher | null>(null);

  const [state, setState] = useState<RtcState>(RtcState.CLOSED);
  const [sourceType, setSourceType] = useState<PublisherSourceType>('camera');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  function appendLog(level: LogEntry['level'], message: string) {
    setLogs((prev) => [mkLog(level, message), ...prev].slice(0, 60));
  }

  async function handleStart() {
    if (publisherRef.current) return;

    const source: MediaSource =
      sourceType === 'screen' ? { type: 'screen', audio: false } : { type: 'camera' };

    const pub = new RtcPublisher({
      url: streamUrl,
      api: apiUrl,
      source,
      video: videoRef.current ?? undefined,
    });

    publisherRef.current = pub;

    pub.on('state', (s) => {
      setState(s);
      appendLog('info', `[状态] ${s}`);
    });

    pub.on('error', (err) => {
      appendLog('error', `[错误] ${err}`);
    });

    pub.on('streamstart', ({ stream }) => {
      setLocalStream(stream);
      appendLog('info', '[事件] streamstart — 推流已启动');
    });

    pub.on('sourcechange', (src) => {
      appendLog('info', `[事件] sourcechange — 切换输入源: ${src.type}`);
    });

    try {
      await pub.start();
    } catch (err) {
      appendLog('error', `[启动失败] ${err instanceof Error ? err.message : err}`);
    }
  }

  function handleStop() {
    publisherRef.current?.destroy();
    publisherRef.current = null;
    setLocalStream(null);
    setState(RtcState.DESTROYED);
    appendLog('info', '[操作] 停止推流');
  }

  function handleSwitchSource() {
    if (!publisherRef.current) return;
    const newType: PublisherSourceType = sourceType === 'camera' ? 'screen' : 'camera';
    setSourceType(newType);
    const source: MediaSource =
      newType === 'screen' ? { type: 'screen', audio: false } : { type: 'camera' };
    publisherRef.current.switchSource(source);
    appendLog('info', `[操作] 切换至 ${newType === 'camera' ? '摄像头' : '屏幕录制'}`);
  }

  const active = !!publisherRef.current;

  return (
    <div
      style={{
        background: tokens.color.surface,
        border: `1px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.lg,
        boxShadow: tokens.shadow.card,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${tokens.color.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="10"
              height="8"
              rx="1.5"
              stroke={tokens.color.accent}
              strokeWidth="1.3"
            />
            <circle cx="12.5" cy="5.5" r="1.5" stroke={tokens.color.accent} strokeWidth="1.3" />
            <circle cx="12.5" cy="9.5" r="1" stroke={tokens.color.accent} strokeWidth="1.3" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: tokens.color.text.primary }}>
            推流端
          </span>
        </div>
        <StatusBadge state={state} />
      </div>

      {/* Body */}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* URL 配置 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldLabel>流地址 / Stream URL</FieldLabel>
          <Input
            value={streamUrl}
            onChange={(e) => onStreamUrlChange(e.target.value)}
            placeholder="webrtc://localhost/live/pushstream"
            mono
            disabled={active}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldLabel>信令地址 / API URL</FieldLabel>
          <Input
            value={apiUrl}
            onChange={(e) => onApiUrlChange(e.target.value)}
            placeholder="http://localhost:1985/rtc/v1/publish/"
            mono
            disabled={active}
          />
        </div>

        {/* 源选择 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldLabel>输入源 / Source</FieldLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['camera', 'screen'] as PublisherSourceType[]).map((type) => (
              <SourceBtn
                key={type}
                active={sourceType === type && !active}
                selected={sourceType === type}
                label={type === 'camera' ? '摄像头' : '屏幕录制'}
                onClick={() => setSourceType(type)}
                disabled={active}
              />
            ))}
          </div>
        </div>

        {/* 视频预览 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FieldLabel>本地预览 / Preview</FieldLabel>
            {localStream && (
              <span style={{ fontSize: 11, color: tokens.color.status.connected }}>
                ● {localStream.getVideoTracks().length} 视频轨道 ·{' '}
                {localStream.getAudioTracks().length} 音频轨道
              </span>
            )}
          </div>
          <StreamVideo stream={localStream} label="本地预览" muted />
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: 8 }}>
          {!active ? (
            <button onClick={handleStart} style={btnStyle('primary', false)}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                <polygon points="2,1 12,6.5 2,12" fill="currentColor" />
              </svg>
              开始推流
            </button>
          ) : (
            <>
              <button onClick={handleSwitchSource} style={btnStyle('secondary', false)}>
                切换输入源
              </button>
              <button onClick={handleStop} style={btnStyle('danger', false)}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <rect x="1.5" y="1.5" width="10" height="10" rx="1" fill="currentColor" />
                </svg>
                停止
              </button>
            </>
          )}
        </div>

        {/* 日志 */}
        {logs.length > 0 && <LogPanel logs={logs} />}
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: tokens.color.text.secondary,
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </span>
  );
}

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  mono?: boolean;
  disabled?: boolean;
}

function Input({ value, onChange, placeholder, mono, disabled }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '8px 10px',
        borderRadius: tokens.radius.sm,
        border: `1px solid ${disabled ? tokens.color.border : tokens.color.input.border}`,
        background: disabled ? tokens.color.surfaceHover : tokens.color.input.bg,
        color: tokens.color.text.primary,
        fontSize: 13,
        fontFamily: mono ? tokens.font.mono : 'inherit',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        opacity: disabled ? 0.6 : 1,
      }}
      onFocus={(e) => {
        if (!disabled) e.currentTarget.style.borderColor = tokens.color.input.borderFocus;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = tokens.color.input.border;
      }}
    />
  );
}

interface SourceBtnProps {
  active: boolean;
  selected: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function SourceBtn({ active, selected, label, onClick, disabled }: SourceBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 14px',
        borderRadius: tokens.radius.sm,
        border: `1px solid ${selected ? tokens.color.accent : tokens.color.border}`,
        background: active ? tokens.color.surface : 'transparent',
        color: selected ? tokens.color.accent : tokens.color.text.secondary,
        fontSize: 13,
        fontWeight: selected ? 600 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

function LogPanel({ logs }: { logs: LogEntry[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <FieldLabel>运行日志</FieldLabel>
      <div
        style={{
          background: '#1a1a1a',
          borderRadius: tokens.radius.sm,
          padding: '10px 12px',
          maxHeight: 120,
          overflowY: 'auto',
          fontFamily: tokens.font.mono,
          fontSize: 11,
          lineHeight: 1.7,
        }}
      >
        {logs.map((log) => (
          <div key={log.id} style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#555', flexShrink: 0 }}>{log.time}</span>
            <span style={{ color: log.level === 'error' ? '#f87171' : '#86efac' }}>
              {log.level === 'error' ? '✕' : '·'}
            </span>
            <span
              style={{
                color: log.level === 'error' ? '#f87171' : '#d4d4d4',
                wordBreak: 'break-all',
              }}
            >
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function btnStyle(
  variant: 'primary' | 'secondary' | 'danger',
  disabled: boolean
): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: tokens.radius.sm,
    border: '1px solid transparent',
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s',
    letterSpacing: '0.01em',
  };

  if (variant === 'primary') {
    return {
      ...base,
      background: tokens.color.accent,
      color: tokens.color.text.inverse,
      borderColor: tokens.color.accent,
    };
  }
  if (variant === 'danger') {
    return {
      ...base,
      background: '#fff',
      color: '#dc2626',
      borderColor: '#fca5a5',
    };
  }
  return {
    ...base,
    background: '#fff',
    color: tokens.color.text.primary,
    borderColor: tokens.color.border,
  };
}
