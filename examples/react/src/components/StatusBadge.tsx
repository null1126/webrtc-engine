import { RtcState } from '@webrtc-player/core';
import { tokens } from './tokens';

const STATE_LABELS: Record<RtcState, string> = {
  [RtcState.CONNECTING]: '连接中',
  [RtcState.CONNECTED]: '已连接',
  [RtcState.DISCONNECTED]: '断开',
  [RtcState.FAILED]: '失败',
  [RtcState.CLOSED]: '已关闭',
  [RtcState.SWITCHING]: '切换中',
  [RtcState.SWITCHED]: '已切换',
  [RtcState.DESTROYED]: '已销毁',
};

const BADGE_STYLES: Record<RtcState, { bg: string; color: string }> = {
  [RtcState.CONNECTING]: {
    bg: tokens.color.badge.connecting,
    color: tokens.color.badge.connectingText,
  },
  [RtcState.CONNECTED]: {
    bg: tokens.color.badge.connected,
    color: tokens.color.badge.connectedText,
  },
  [RtcState.DISCONNECTED]: {
    bg: tokens.color.badge.disconnected,
    color: tokens.color.badge.disconnectedText,
  },
  [RtcState.FAILED]: { bg: tokens.color.badge.failed, color: tokens.color.badge.failedText },
  [RtcState.CLOSED]: { bg: tokens.color.badge.closed, color: tokens.color.badge.closedText },
  [RtcState.SWITCHING]: {
    bg: tokens.color.badge.switching,
    color: tokens.color.badge.switchingText,
  },
  [RtcState.SWITCHED]: {
    bg: tokens.color.badge.connected,
    color: tokens.color.badge.connectedText,
  },
  [RtcState.DESTROYED]: {
    bg: tokens.color.badge.destroyed,
    color: tokens.color.badge.destroyedText,
  },
};

interface StatusBadgeProps {
  state: RtcState;
}

export function StatusBadge({ state }: StatusBadgeProps) {
  const style = BADGE_STYLES[state];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        borderRadius: tokens.radius.sm,
        background: style.bg,
        color: style.color,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.01em',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: style.color,
          flexShrink: 0,
        }}
      />
      {STATE_LABELS[state]}
    </span>
  );
}
