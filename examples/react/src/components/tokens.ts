/**
 * 设计 token
 */
export const tokens = {
  color: {
    bg: '#f8f7f4',
    surface: '#ffffff',
    surfaceHover: '#f3f2ef',
    border: '#e5e4e0',
    borderFocus: '#d4d3cf',
    text: {
      primary: '#1a1a1a',
      secondary: '#6b6b6b',
      muted: '#9a9a9a',
      inverse: '#ffffff',
    },
    accent: '#c2410c', // orange-700
    accentLight: '#fed7aa', // orange-200
    status: {
      connecting: '#d97706', // amber-600
      connected: '#16a34a', // green-600
      disconnected: '#6b6b6b', // gray-500
      failed: '#dc2626', // red-600
      switching: '#d97706', // amber-600
      closed: '#9a9a9a',
    },
    input: {
      bg: '#ffffff',
      border: '#d4d3cf',
      borderFocus: '#c2410c',
      placeholder: '#9a9a9a',
    },
    badge: {
      connecting: '#fef3c7',
      connectingText: '#92400e',
      connected: '#dcfce7',
      connectedText: '#166534',
      disconnected: '#f4f4f4',
      disconnectedText: '#6b6b6b',
      failed: '#fee2e2',
      failedText: '#991b1b',
      switching: '#fef3c7',
      switchingText: '#92400e',
      closed: '#f4f4f4',
      closedText: '#6b6b6b',
      destroyed: '#f4f4f4',
      destroyedText: '#6b6b6b',
    },
  },
  font: {
    mono: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  shadow: {
    card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
    cardHover: '0 4px 12px 0 rgba(0,0,0,0.08)',
    input: 'inset 0 1px 2px 0 rgba(0,0,0,0.05)',
  },
} as const;
