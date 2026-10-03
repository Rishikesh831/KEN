import { useVaidya } from '../context/VaidyaContext';
import { RED_FLAG_LOG } from '../data/mockData';
import { Sticker } from '../components/ui';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const VERDICTS = [
  { name: 'ACT', value: 87, color: '#4ADE9A' },
  { name: 'ASK', value: 19, color: '#FFE14D' },
  { name: 'STOP', value: 6, color: '#FF3B30' },
];

const OWNER_TIMES = [
  { incident: 'RF-001', secs: 41 },
  { incident: 'RF-002', secs: 28 },
  { incident: 'RF-003', secs: 55 },
];

const RULES = [
  { text: 'Never diagnoses or advises', kind: 'never' },
  { text: 'Never ships across a district line', kind: 'never' },
  { text: 'Only escalates up, never down', kind: 'never' },
  { text: 'Money only released on a Delivered scan', kind: 'never' },
  { text: 'Red-flag screen runs before every refill check', kind: 'always' },
  { text: 'One owner, one question, one action', kind: 'always' },
];

const OWNERSHIP_LADDER = [
  { level: 1, name: 'Rishikesh', role: 'Owner' },
  { level: 2, name: 'Neha', role: 'Backup' },
  { level: 3, name: 'Anyone on approved list', role: 'Next person' },
  { level: 4, name: 'Auto-snooze 24h', role: 'Snooze' },
];

function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#111" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={800} fontFamily="Space Mono">
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
}

export default function SafetyPage() {
  const { ledger } = useVaidya();
  const rfRows = ledger.filter(r => r.kind === 'stop' && r.agent === 'safety');

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>Safety</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>
        Vaidya Sharma's gate — nothing ships without passing through here.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Verdict donut */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Verdict mix</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={VERDICTS}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                stroke="#111"
                strokeWidth={3}
                labelLine={false}
                label={<CustomPieLabel />}
              >
                {VERDICTS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ border: '3px solid #111', fontFamily: 'Space Mono', fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {VERDICTS.map(v => (
              <Sticker key={v.name} label={v.name} kind={v.name.toLowerCase()} rotate={v.name === 'ACT' ? 1 : v.name === 'ASK' ? -1 : 2} />
            ))}
          </div>
        </div>

        {/* Time to owner */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Time to a named owner</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={OWNER_TIMES} barSize={40}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
              <XAxis dataKey="incident" tick={{ fontFamily: 'Space Mono', fontSize: 11 }} />
              <YAxis tick={{ fontFamily: 'Space Mono', fontSize: 11 }} unit="s" />
              <Tooltip
                contentStyle={{ border: '3px solid #111', fontFamily: 'Space Mono', fontSize: 11 }}
                formatter={v => [`${v}s`, 'Time']}
              />
              <Bar dataKey="secs" fill="#FF3B30" stroke="#111" strokeWidth={2} label={{ position: 'top', fontSize: 11, fontFamily: 'Space Mono', fontWeight: 700 }} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Target: under 60s to owner acceptance</div>
        </div>
      </div>

      {/* Red flag log */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '14px 20px', borderBottom: '3px solid #111', background: '#FF3B30', color: '#fff' }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>🚨 Red flag log</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Matched phrase</th>
                <th>Alerted</th>
                <th>Owner accepted</th>
              </tr>
            </thead>
            <tbody>
              {RED_FLAG_LOG.map((rf, i) => (
                <tr key={i}>
                  <td><span className="mono" style={{ fontSize: 11 }}>{rf.t}</span></td>
                  <td><strong>{rf.patient}</strong></td>
                  <td><span className="mono" style={{ fontSize: 11, color: '#FF3B30' }}>{rf.phrase}</span></td>
                  <td>{rf.alerted}</td>
                  <td>
                    <span style={{ background: '#4ADE9A', border: '2px solid #111', padding: '2px 8px', fontSize: 11, fontWeight: 800, borderRadius: 2 }}>
                      {rf.acceptTime}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {/* Ownership ladder */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Ownership ladder</div>
          {OWNERSHIP_LADDER.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 32 + i * 8,
                height: 4,
                background: '#111',
                flexShrink: 0,
              }} />
              <div style={{
                border: '3px solid #111',
                padding: '8px 14px',
                fontWeight: 700,
                fontSize: 13,
                background: i === 0 ? '#FFE14D' : i === 1 ? '#5CC8FF' : '#FFFDF5',
                flex: 1,
              }}>
                <div style={{ fontSize: 10, color: '#666', fontFamily: 'Space Mono' }}>{step.role}</div>
                <div>{step.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Rules card */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Hard rules</div>
          {RULES.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              marginBottom: 10, padding: '8px 10px',
              border: '2px solid #111',
              background: r.kind === 'never' ? '#fff0ee' : '#f0fff5',
              borderRadius: 3,
            }}>
              <span style={{ fontWeight: 800, color: r.kind === 'never' ? '#FF3B30' : '#4ADE9A', fontSize: 16, lineHeight: 1.2 }}>
                {r.kind === 'never' ? '✗' : '✓'}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
