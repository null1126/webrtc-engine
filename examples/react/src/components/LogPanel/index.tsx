import { useState } from 'react';
import './index.css';

export interface LogEntry {
  id: number;
  time: string;
  level: 'info' | 'error';
  message: string;
}

let logId = 0;

export function mkLog(level: LogEntry['level'], message: string): LogEntry {
  const now = new Date();
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
  return { id: ++logId, time, level, message };
}

export function useLogs(maxLogs = 60) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  function appendLog(level: LogEntry['level'], message: string) {
    setLogs((prev) => [mkLog(level, message), ...prev].slice(0, maxLogs));
  }

  function clearLogs() {
    setLogs([]);
  }

  return { logs, appendLog, clearLogs };
}

interface LogPanelProps {
  logs: LogEntry[];
  label?: string;
  maxHeight?: number;
}

export function LogPanel({ logs, label = '运行日志', maxHeight = 120 }: LogPanelProps) {
  return (
    <div className="log-panel">
      <div className="log-panel-header">
        <span className="field-label">{label}</span>
        {logs.length > 0 && <span className="log-count">{logs.length}</span>}
      </div>
      <div className="log-list" style={{ maxHeight }}>
        {logs.length === 0 ? (
          <span className="log-empty">暂无日志</span>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="log-item">
              <span className="log-time">{log.time}</span>
              <span className={`log-icon log-icon--${log.level}`}>
                {log.level === 'error' ? '✕' : '·'}
              </span>
              <span className={`log-message log-message--${log.level}`}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
