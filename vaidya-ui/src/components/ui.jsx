import { AGENT_COLORS, AGENT_TEXT_COLORS } from '../data/mockData';

const AGENT_LABELS = {
  coord:  'Ananya',
  intake: 'Meera',
  safety: 'Vaidya',
  pharm:  'Arjun',
  pay:    'Kabir',
  logi:   'Sana',
  family: 'Ravi',
  rec:    'Nisha',
};

export function AgentChip({ agentKey, size = 'sm' }) {
  const bg = AGENT_COLORS[agentKey] || '#ccc';
  const fg = AGENT_TEXT_COLORS[agentKey] || '#111';
  const label = AGENT_LABELS[agentKey] || agentKey;
  const px = size === 'sm' ? '6px 10px' : '8px 14px';
  const fs = size === 'sm' ? '11px' : '13px';

  return (
    <span
      style={{
        background: bg,
        color: fg,
        border: '2px solid #111',
        borderRadius: '3px',
        padding: px,
        fontSize: fs,
        fontWeight: 800,
        fontFamily: 'Space Grotesk, sans-serif',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        lineHeight: 1.3,
      }}
    >
      {label}
    </span>
  );
}

export function LedgerRow({ row, isNew }) {
  const borderColor = row.kind === 'ok' ? '#4ADE9A' : row.kind === 'warn' ? '#FF8A3D' : '#FF3B30';
  return (
    <div
      className={isNew ? 'slam-in' : ''}
      style={{
        borderLeft: `5px solid ${borderColor}`,
        padding: '10px 14px',
        borderBottom: '2px solid #111',
        background: row.kind === 'stop' ? '#fff0ee' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
        <span className="mono" style={{ color: '#666', fontSize: 11 }}>{row.t}</span>
        <AgentChip agentKey={row.agent} />
        <span style={{ fontWeight: 500, fontSize: 14, flex: 1, minWidth: 0 }}>{row.msg}</span>
      </div>
      {row.evidence && (
        <div className="mono" style={{ color: '#666', fontSize: 11, paddingLeft: 0 }}>
          ↳ {row.evidence}
        </div>
      )}
    </div>
  );
}

export function Sticker({ label, kind = 'sandbox', rotate = 0 }) {
  const styles = {
    sandbox: { background: '#FFE14D', color: '#111' },
    live:    { background: '#4ADE9A', color: '#111' },
    stop:    { background: '#FF3B30', color: '#fff' },
    act:     { background: '#4ADE9A', color: '#111' },
    ask:     { background: '#FFE14D', color: '#111' },
    exists:  { background: '#4ADE9A', color: '#111' },
    partial: { background: '#FFE14D', color: '#111' },
    built:   { background: '#FF6B9D', color: '#111' },
  };
  const s = styles[kind] || styles.sandbox;
  return (
    <span
      className="sticker"
      style={{
        ...s,
        transform: `rotate(${rotate}deg)`,
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  );
}

export function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </span>
  );
}

export function DaysMeter({ days, max = 30 }) {
  const pct = Math.min(100, (days / max) * 100);
  const color = days < 5 ? '#FF3B30' : days < 10 ? '#FF8A3D' : '#4ADE9A';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#666' }}>Days left</span>
        <span style={{ fontFamily: 'Space Mono', fontWeight: 700, fontSize: 13, color }}>{days.toFixed(1)}d</span>
      </div>
      <div className="meter-bar">
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

export function KindBadge({ kind }) {
  const map = { ok: { label: 'ACT', color: '#4ADE9A' }, warn: { label: 'ASK', color: '#FFE14D' }, stop: { label: 'STOP', color: '#FF3B30', text: '#fff' } };
  const m = map[kind] || map.ok;
  return (
    <span style={{ background: m.color, color: m.text || '#111', border: '2px solid #111', borderRadius: 2, padding: '2px 6px', fontSize: 10, fontWeight: 800 }}>
      {m.label}
    </span>
  );
}
