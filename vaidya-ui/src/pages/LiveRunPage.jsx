import { useVaidya } from '../context/VaidyaContext';
import { AGENTS, AGENT_COLORS, AGENT_TEXT_COLORS } from '../data/mockData';
import { LedgerRow, AgentChip, TypingDots } from '../components/ui';
import { useState } from 'react';

const PIPELINE_STEPS = [
  { label: 'Pharmacy', key: 'pharm' },
  { label: 'Safety', key: 'safety' },
  { label: 'Payments hold', key: 'pay' },
  { label: 'Logistics', key: 'logi' },
  { label: 'Payments release', key: 'pay2' },
];

const SCENARIOS = ['Refill', 'Red flag', 'Out of district', 'Reports in a minute', 'Parent pauses'];
const SPEEDS = [0.5, 1, 2, 4];

function PipelineStep({ label, state, isActive }) {
  // state: 'pending' | 'active' | 'done' | 'blocked'
  const bg = state === 'done' ? '#4ADE9A' : state === 'active' ? '#FFE14D' : state === 'blocked' ? '#FF3B30' : '#FFFDF5';
  const color = state === 'blocked' ? '#fff' : '#111';
  return (
    <div
      style={{
        flex: 1,
        border: `3px solid #111`,
        borderRadius: 4,
        padding: '10px 8px',
        textAlign: 'center',
        background: bg,
        color,
        fontWeight: 700,
        fontSize: 12,
        boxShadow: state === 'active' ? '4px 4px 0 #111' : 'none',
        position: 'relative',
        overflow: state === 'blocked' ? 'hidden' : 'visible',
      }}
    >
      {state === 'blocked' && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.3,
          background: 'repeating-linear-gradient(-45deg,#000 0,#000 3px,transparent 3px,transparent 12px)',
        }} />
      )}
      {state === 'done' && <span style={{ marginRight: 4 }}>✓</span>}
      {label}
    </div>
  );
}

function AgentCard({ agent, isActive }) {
  const bg = AGENT_COLORS[agent.key] || '#eee';
  const { ledger } = useVaidya();
  const lastRow = ledger.find(r => r.agent === agent.key);

  return (
    <div
      className={isActive ? 'agent-active' : 'card'}
      style={{
        padding: 16,
        background: isActive ? bg : '#FFFDF5',
        border: isActive ? `4px solid #111` : '3px solid #111',
        boxShadow: isActive ? '8px 8px 0 #111' : '4px 4px 0 #111',
        transition: 'all 0.15s',
        borderRadius: 4,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, background: bg, border: '2px solid #111', borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 14,
        }}>
          {agent.name[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 12 }}>{agent.name.split(' ')[0]}</div>
          <div style={{ fontSize: 10, color: '#666' }}>{agent.title}</div>
        </div>
        {isActive && <TypingDots />}
      </div>
      {lastRow && (
        <div style={{ fontSize: 11, color: '#444', lineHeight: 1.4 }}>
          {lastRow.msg.slice(0, 70)}{lastRow.msg.length > 70 ? '…' : ''}
        </div>
      )}
    </div>
  );
}

function RedFlagBanner({ show }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      padding: '16px 24px',
      background: 'repeating-linear-gradient(-45deg,#FF3B30,#FF3B30 12px,#111 12px,#111 24px)',
      color: '#fff',
      fontWeight: 800,
      fontSize: 18,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      border: '4px solid #111',
      animation: 'slam-in 0.3s ease',
    }}>
      <span>🚨 RED FLAG · Papa · all orders paused · Rishikesh and Neha alerted</span>
    </div>
  );
}

export default function LiveRunPage() {
  const {
    demoPlaying, playDemo, stopDemo, demoSpeed, setDemoSpeed,
    activeAgent, activeScenario, pipelineStep, ledger, redFlag,
    demoMode,
  } = useVaidya();

  const [selectedScenario, setSelectedScenario] = useState('Refill');
  const [showRedFlag, setShowRedFlag] = useState(false);

  // Show red flag banner briefly
  if (redFlag && !showRedFlag) setShowRedFlag(true);
  if (!redFlag && showRedFlag) setTimeout(() => setShowRedFlag(false), 4000);

  const getPipelineState = (idx) => {
    if (idx < pipelineStep) return 'done';
    if (idx === pipelineStep) return 'active';
    return 'pending';
  };

  return (
    <div>
      <RedFlagBanner show={showRedFlag} />

      <h1 style={{ fontWeight: 800, fontSize: 40, marginBottom: 8, letterSpacing: '-0.02em' }}>
        Live run
      </h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Command centre — watch the team work in real time.
      </p>

      {/* Scenario controls */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {SCENARIOS.map(s => (
            <button
              key={s}
              className={`btn ${selectedScenario === s ? 'btn-lemon' : 'btn-paper'}`}
              style={{ padding: '8px 14px', fontSize: 12 }}
              onClick={() => setSelectedScenario(s)}
            >
              {s}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          {/* Speed selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Speed:</span>
            {SPEEDS.map(s => (
              <button
                key={s}
                className={`btn ${demoSpeed === s ? 'btn-ink' : 'btn-paper'}`}
                style={{ padding: '4px 10px', fontSize: 12 }}
                onClick={() => setDemoSpeed(s)}
              >
                {s}×
              </button>
            ))}
          </div>

          <button
            className="btn btn-lemon"
            style={{ padding: '10px 20px', fontSize: 14, fontWeight: 800 }}
            onClick={demoPlaying ? stopDemo : playDemo}
          >
            {demoPlaying ? '⏹ Stop' : '▶ Play full demo'}
          </button>
        </div>
      </div>

      {/* Pipeline stepper */}
      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 10 }}>Pipeline</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {PIPELINE_STEPS.map((step, i) => (
            <PipelineStep
              key={step.label}
              label={step.label}
              state={getPipelineState(i)}
            />
          ))}
        </div>
      </div>

      {/* Main 3-column layout */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Agent grid */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 10 }}>
            Team — 8 agents · {activeScenario ? `scenario: ${activeScenario}` : 'idle'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {AGENTS.map(agent => (
              <AgentCard key={agent.key} agent={agent} isActive={activeAgent === agent.key} />
            ))}
          </div>
        </div>

        {/* Streaming ledger */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 10 }}>
            Ledger stream — {ledger.length} entries
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', maxHeight: 600, overflowY: 'auto' }}>
            {ledger.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                {demoMode ? 'Press Play full demo to start' : 'Enable demo mode and press Play'}
              </div>
            ) : (
              ledger.slice(0, 40).map((row, i) => <LedgerRow key={i} row={row} isNew={i === 0} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
