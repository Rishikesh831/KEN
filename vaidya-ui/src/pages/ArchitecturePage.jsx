import { Sticker } from '../components/ui';

const RAILS = [
  {
    name: 'Voice',
    provider: 'Gnani.ai',
    color: '#FFE14D',
    capabilities: [
      { name: 'Speech-to-text (Hindi)', status: 'exists' },
      { name: 'Speaker verification', status: 'exists' },
      { name: 'Stop-word detection', status: 'built' },
    ],
    agents: ['Meera (Intake)'],
  },
  {
    name: 'Payments',
    provider: 'Pine Labs',
    color: '#5CC8FF',
    capabilities: [
      { name: 'Payment hold / escrow', status: 'exists' },
      { name: 'Conditional release', status: 'exists' },
      { name: 'Care reserve tracking', status: 'built' },
    ],
    agents: ['Kabir (Payments)'],
  },
  {
    name: 'Logistics',
    provider: 'Delhivery',
    color: '#FF8A3D',
    capabilities: [
      { name: 'Pincode serviceability', status: 'exists' },
      { name: 'Shipment creation + AWB', status: 'exists' },
      { name: 'Scan-event webhooks', status: 'partial' },
    ],
    agents: ['Sana (Logistics)'],
  },
];

const AGENTS_ARCH = [
  { name: 'Ananya', role: 'Coordinator', color: '#FFE14D' },
  { name: 'Meera', role: 'Intake', color: '#FF6B9D' },
  { name: 'Vaidya', role: 'Safety Gate', color: '#FF3B30' },
  { name: 'Arjun', role: 'Pharmacy', color: '#4ADE9A' },
  { name: 'Kabir', role: 'Payments', color: '#5CC8FF' },
  { name: 'Sana', role: 'Logistics', color: '#FF8A3D' },
  { name: 'Ravi', role: 'Family', color: '#B28DFF' },
  { name: 'Nisha', role: 'Records', color: '#111111' },
];

const STATUS_KIND = { exists: 'exists', partial: 'partial', built: 'built' };
const STATUS_LABEL = { exists: 'EXISTS', partial: 'PARTIAL', built: 'BUILT BY US' };

export default function ArchitecturePage() {
  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>Architecture</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>
        System diagram for the pitch — three rails, eight agents, one family.
      </p>

      <div className="card" style={{ padding: 32, overflow: 'hidden' }}>
        {/* Family row at top */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Sharma family</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {['Papa', 'Maa', 'Rishikesh', 'Neha'].map(name => (
              <div key={name} style={{
                border: '3px solid #111', padding: '8px 16px', fontWeight: 700, fontSize: 13,
                background: '#FFFDF5', borderRadius: 4, boxShadow: '3px 3px 0 #111',
              }}>
                {name}
              </div>
            ))}
          </div>
          {/* Arrow down */}
          <div style={{ fontSize: 32, marginTop: 16, fontWeight: 800 }}>↓</div>
        </div>

        {/* Agent grid */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 16, marginBottom: 16, padding: '8px', background: '#111', color: '#FFFDF5', borderRadius: 4 }}>
            8 AI Agents
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {AGENTS_ARCH.map(agent => (
              <div key={agent.name} style={{
                background: agent.color,
                border: '3px solid #111',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 4,
                boxShadow: '3px 3px 0 #111',
                textAlign: 'center',
                color: agent.color === '#111111' ? '#FFFDF5' : '#111',
                minWidth: 80,
              }}>
                <div>{agent.name}</div>
                <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.8 }}>{agent.role}</div>
              </div>
            ))}
          </div>
          {/* Arrow down */}
          <div style={{ fontSize: 32, textAlign: 'center', marginTop: 16, fontWeight: 800 }}>↓</div>
        </div>

        {/* Rails */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {RAILS.map(rail => (
            <div key={rail.name} style={{ flex: 1, minWidth: 240 }}>
              <div style={{
                background: rail.color,
                border: '3px solid #111',
                borderBottom: 'none',
                padding: '14px 16px',
                fontWeight: 800,
                fontSize: 16,
                boxShadow: '4px 4px 0 #111',
              }}>
                {rail.name}
                <div style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>{rail.provider}</div>
              </div>
              <div style={{ border: '3px solid #111', borderTop: 'none', padding: 16 }}>
                {rail.capabilities.map((cap, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, flex: 1, paddingRight: 8 }}>{cap.name}</span>
                    <Sticker
                      label={STATUS_LABEL[cap.status]}
                      kind={STATUS_KIND[cap.status]}
                      rotate={i % 2 === 0 ? -1 : 1}
                    />
                  </div>
                ))}
                <div style={{ marginTop: 12, borderTop: '2px solid #ddd', paddingTop: 10 }}>
                  {rail.agents.map(a => (
                    <div key={a} style={{ fontSize: 11, color: '#666', fontFamily: 'Space Mono' }}>→ {a}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 24,
          padding: '12px 16px',
          background: '#111',
          color: '#FFFDF5',
          fontFamily: 'Space Mono',
          fontSize: 12,
          textAlign: 'center',
          borderRadius: 4,
        }}>
          All data in this demo is mock sandbox data. No real payments, shipments or medical data involved.
        </div>
      </div>
    </div>
  );
}
