import { useVaidya } from '../context/VaidyaContext';
import { LedgerRow, AgentChip, DaysMeter, Sticker } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

function CountUp({ target, duration = 1500 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 50);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 50);
    return () => clearInterval(id);
  }, [target, duration]);
  return <>{val}</>;
}

function KpiCard({ label, value, unit = '', color = '#FFE14D', sparkData }) {
  return (
    <div className="card" style={{ padding: 20, flex: 1, minWidth: 160 }}>
      <div className="mono" style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'Space Mono', fontSize: 32, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
        {typeof value === 'number' ? <CountUp target={value} /> : value}
        {unit && <span style={{ fontSize: 16 }}>{unit}</span>}
      </div>
      {sparkData && (
        <ResponsiveContainer width="100%" height={40}>
          <BarChart data={sparkData} barSize={8}>
            <Bar dataKey="v" fill={color} stroke="#111" strokeWidth={1} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function PatientCard({ patient }) {
  const { ledger } = useVaidya();
  const relevantLedger = ledger.filter(r =>
    r.msg.toLowerCase().includes(patient.name.toLowerCase())
  ).slice(0, 1);

  return (
    <div className="card" style={{ padding: 24, minWidth: 280, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{patient.name}</div>
          <div style={{ color: '#666', fontSize: 13 }}>{patient.district} · {patient.med} {patient.strength}</div>
        </div>
        <Sticker label="patient" kind="ask" rotate={-1} />
      </div>

      <DaysMeter days={patient.days_left} />

      <div style={{ marginTop: 16, padding: '10px 12px', background: '#f5f3ea', border: '2px solid #111', borderRadius: 4 }}>
        <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Next action</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{patient.nextAction}</div>
      </div>

      {relevantLedger[0] && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
          Last: {relevantLedger[0].msg.slice(0, 60)}…
        </div>
      )}
    </div>
  );
}

export default function DeskPage() {
  const { ledger, kpi, patients } = useVaidya();
  const recent = ledger.slice(0, 6);

  const sparkBase = [
    { v: 3 }, { v: 5 }, { v: 2 }, { v: 8 }, { v: 4 }, { v: 6 }, { v: 7 }, { v: 5 }
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 12,
          }}>
            Nobody has to be<br />the single thread.
          </h1>
          <p style={{ fontSize: 16, color: '#444', fontWeight: 500, maxWidth: 480 }}>
            Eight AI team members keep your family's medicines, payments, deliveries and records on track — around the clock.
          </p>
        </div>

        {/* Big stat */}
        <div className="card" style={{ padding: '28px 36px', textAlign: 'center', minWidth: 220 }}>
          <div className="mono" style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Days without a missed refill</div>
          <div style={{ fontFamily: 'Space Mono', fontSize: 72, fontWeight: 700, lineHeight: 1, color: '#111' }}>
            <CountUp target={127} duration={2000} />
          </div>
          <div style={{ marginTop: 8 }}>
            <Sticker label="SANDBOX" kind="sandbox" rotate={-1} />
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
        <KpiCard
          label="Items closed today"
          value={kpi.closed || 11}
          color="#4ADE9A"
          sparkData={[{v:2},{v:1},{v:3},{v:2},{v:1},{v:2},{v:3},{v:11}]}
        />
        <KpiCard
          label="Money in escrow"
          value={kpi.held}
          unit="₹"
          color="#5CC8FF"
          sparkData={[{v:700},{v:840},{v:0},{v:840},{v:700},{v:840},{v:0},{v:840}]}
        />
        <KpiCard
          label="Red flags handled"
          value={kpi.redFlags || 3}
          color="#FF3B30"
          sparkData={[{v:0},{v:1},{v:0},{v:1},{v:0},{v:0},{v:1},{v:3}]}
        />
        <KpiCard
          label="Median time to owner"
          value={kpi.medianTime}
          color="#FFE14D"
        />
      </div>

      {/* Patients */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 16, borderBottom: '3px solid #111', paddingBottom: 8 }}>
          Patients
        </h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {patients.map(p => <PatientCard key={p.key} patient={p} />)}
        </div>
      </div>

      {/* Recent ledger */}
      <div>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 16, borderBottom: '3px solid #111', paddingBottom: 8 }}>
          What the team did in the last hour
        </h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {recent.length === 0 ? (
            <div style={{ padding: 24, color: '#666', textAlign: 'center' }}>
              Run demo mode to see live activity
            </div>
          ) : (
            recent.map((row, i) => <LedgerRow key={i} row={row} isNew={i === 0} />)
          )}
        </div>
      </div>
    </div>
  );
}
