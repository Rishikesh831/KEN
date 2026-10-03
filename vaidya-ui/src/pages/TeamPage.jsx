import { useState } from 'react';
import { AGENTS, AGENT_COLORS, AGENT_TEXT_COLORS } from '../data/mockData';
import { useVaidya } from '../context/VaidyaContext';
import { LedgerRow, AgentChip } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

function AgentDrawer({ agent, onClose }) {
  const { ledger } = useVaidya();
  const rows = ledger.filter(r => r.agent === agent.key).slice(0, 10);
  const bg = AGENT_COLORS[agent.key];
  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0,
      width: 420,
      background: '#FFFDF5',
      border: '3px solid #111',
      borderRight: 'none',
      boxShadow: '-8px 0 0 #111',
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ background: bg, borderBottom: '3px solid #111', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{agent.name}</div>
          <div style={{ fontSize: 13 }}>{agent.title}</div>
        </div>
        <button className="btn btn-paper" style={{ padding: '6px 12px', fontSize: 13 }} onClick={onClose}>✕ Close</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '12px 16px', borderBottom: '2px solid #111' }}>
          <span className="mono" style={{ fontSize: 10, color: '#666' }}>Last 10 actions</span>
        </div>
        {rows.length === 0 ? (
          <div style={{ padding: 24, color: '#666', textAlign: 'center' }}>
            No actions yet — run demo mode
          </div>
        ) : (
          rows.map((row, i) => <LedgerRow key={i} row={row} />)
        )}
      </div>
    </div>
  );
}

function SparkBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <BarChart data={data.map((v, i) => ({ i, v }))} barSize={6}>
        <Bar dataKey="v" fill="#111" stroke="#111" strokeWidth={1} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function AgentCard({ agent }) {
  const [open, setOpen] = useState(false);
  const bg = AGENT_COLORS[agent.key];
  const { drawerAgent, setDrawerAgent } = useVaidya();

  return (
    <>
      <div
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.1s, box-shadow 0.1s',
        }}
        onClick={() => setDrawerAgent(agent)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setDrawerAgent(agent)}
      >
        {/* Color header */}
        <div style={{ background: bg, borderBottom: '3px solid #111', padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>{agent.name}</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{agent.title}</div>
            </div>
            <div style={{ background: '#111', color: '#FFFDF5', fontFamily: 'Space Mono', fontSize: 24, fontWeight: 700, padding: '8px 12px', border: '2px solid #111' }}>
              {agent.name[0]}{agent.name.split(' ')[1]?.[0]}
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: '#333', fontWeight: 500 }}>{agent.mission}</div>
        </div>

        <div style={{ padding: 16 }}>
          {/* Can / Never */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: '#4ADE9A', marginBottom: 4, fontFamily: 'Space Mono' }}>CAN</div>
              {agent.can.map((c, i) => (
                <div key={i} style={{ fontSize: 12, padding: '2px 0', color: '#333', display: 'flex', gap: 4 }}>
                  <span>✓</span><span>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: '#FF3B30', marginBottom: 4, fontFamily: 'Space Mono' }}>NEVER</div>
              {agent.never.map((n, i) => (
                <div key={i} style={{ fontSize: 12, padding: '2px 0', color: '#333', display: 'flex', gap: 4 }}>
                  <span style={{ color: '#FF3B30' }}>✗</span><span>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sparkline */}
          <div style={{ marginBottom: 10 }}>
            <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Actions per hour</div>
            <SparkBar data={agent.sparkline} />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, borderTop: '2px solid #111', paddingTop: 12 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: '#666' }}>Today</div>
              <div style={{ fontFamily: 'Space Mono', fontSize: 20, fontWeight: 700 }}>{agent.actionsToday}</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, color: '#666' }}>Escalations</div>
              <div style={{ fontFamily: 'Space Mono', fontSize: 20, fontWeight: 700, color: agent.escalations > 0 ? '#FF3B30' : '#4ADE9A' }}>
                {agent.escalations}
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <button
                className="btn btn-paper"
                style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={e => { e.stopPropagation(); setDrawerAgent(agent); }}
              >
                Last 10 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TeamPage() {
  const { drawerAgent, setDrawerAgent } = useVaidya();

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>The team</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>
        Eight specialists. Clear lanes. No single thread.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20,
      }}>
        {AGENTS.map(agent => <AgentCard key={agent.key} agent={agent} />)}
      </div>

      {drawerAgent && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 499 }}
            onClick={() => setDrawerAgent(null)}
          />
          <AgentDrawer agent={drawerAgent} onClose={() => setDrawerAgent(null)} />
        </>
      )}
    </div>
  );
}
