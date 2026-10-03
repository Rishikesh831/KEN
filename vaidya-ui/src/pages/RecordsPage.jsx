import { useState, useEffect } from 'react';
import { REPORTS, APPROVED_CONTACTS } from '../data/mockData';
import { Sticker } from '../components/ui';

function Stopwatch({ running, target = 38 }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) { setElapsed(0); return; }
    const id = setInterval(() => {
      setElapsed(prev => {
        if (prev >= target) { clearInterval(id); return target; }
        return prev + 0.1;
      });
    }, 100);
    return () => clearInterval(id);
  }, [running, target]);

  const color = elapsed >= target ? '#4ADE9A' : '#111';
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontFamily: 'Space Mono', fontSize: 64, fontWeight: 700, color, lineHeight: 1 }}>
        {elapsed.toFixed(1)}s
      </div>
      <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
        {elapsed >= target ? '✓ Delivered to Dr. Kapoor' : 'Building + delivering…'}
      </div>
    </div>
  );
}

export default function RecordsPage() {
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  const allReports = [
    ...REPORTS.papa.map(r => ({ ...r, patient: 'Papa' })),
    ...REPORTS.maa.map(r => ({ ...r, patient: 'Maa' })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>Records</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>
        Find it in a minute. Values as printed, no interpretation.
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Report timeline */}
        <div style={{ flex: 3, minWidth: 300 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, borderBottom: '3px solid #111', paddingBottom: 8 }}>
            2026 — report timeline
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allReports.map((r, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 16,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  marginLeft: i % 2 === 0 ? 0 : 20,
                }}
              >
                <div style={{
                  background: r.patient === 'Papa' ? '#FFE14D' : '#FF6B9D',
                  border: '2px solid #111',
                  padding: '6px 12px',
                  fontWeight: 800,
                  fontSize: 12,
                  borderRadius: 3,
                  minWidth: 60,
                  textAlign: 'center',
                }}>
                  {r.patient}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.type}</div>
                  <div className="mono" style={{ fontSize: 11, color: '#666' }}>{r.date}</div>
                </div>
                <div style={{
                  background: '#111',
                  color: '#FFFDF5',
                  border: '2px solid #111',
                  padding: '4px 10px',
                  fontSize: 11,
                  fontFamily: 'Space Mono',
                  borderRadius: 2,
                  cursor: 'pointer',
                }}>
                  📎 {r.file}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div style={{ flex: 2, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stopwatch */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Doctor asks for last 3 sugar reports</div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
              Nisha finds, bundles and delivers — timed.
            </div>
            <Stopwatch running={stopwatchRunning} target={38} />
            <button
              className="btn btn-lemon"
              style={{ width: '100%', padding: '10px 0', fontSize: 14, justifyContent: 'center' }}
              onClick={() => setStopwatchRunning(true)}
            >
              Send reports →
            </button>
            {stopwatchRunning && (
              <button
                className="btn btn-paper"
                style={{ width: '100%', padding: '8px 0', fontSize: 12, justifyContent: 'center', marginTop: 8 }}
                onClick={() => setStopwatchRunning(false)}
              >
                Reset
              </button>
            )}
          </div>

          {/* Approved recipients */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Approved recipients</div>
            {Object.entries(APPROVED_CONTACTS).map(([name, phone]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '8px 12px', background: '#f0fff5', border: '2px solid #111', borderRadius: 3 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                  <div className="mono" style={{ fontSize: 11, color: '#666' }}>{phone}</div>
                </div>
                <Sticker label="✓" kind="act" rotate={1} />
              </div>
            ))}

            {/* Blocked example */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px',
              background: '#fff0ee', border: '2px solid #FF3B30', borderRadius: 3,
              marginTop: 8,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#FF3B30' }}>Unknown caller</div>
                <div className="mono" style={{ fontSize: 11, color: '#FF3B30' }}>+91 99xxx xx000</div>
              </div>
              <Sticker label="BLOCKED" kind="stop" rotate={-2} />
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: '#FF3B30', fontWeight: 600 }}>
              Not on the approved list. Not sending.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
