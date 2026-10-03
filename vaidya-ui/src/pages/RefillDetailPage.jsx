import { useState } from 'react';
import { ITEMS, AGENT_COLORS } from '../data/mockData';
import { AgentChip, Sticker } from '../components/ui';

const STATES_COLOR = {
  OPENED:    '#FFE14D',
  QUOTED:    '#5CC8FF',
  APPROVED:  '#4ADE9A',
  HELD:      '#B28DFF',
  SHIPPED:   '#FF8A3D',
  PICKED_UP: '#FF8A3D',
  IN_TRANSIT:'#FF8A3D',
  DELIVERED: '#4ADE9A',
  RELEASED:  '#4ADE9A',
  CLOSED:    '#4ADE9A',
  BLOCKED:   '#FF3B30',
  REFUNDED:  '#FFE14D',
  PICKUP:    '#B28DFF',
};

const SHIP_STATIONS = ['Created', 'Picked up', 'Out for delivery', 'Delivered'];

function EscrowDiagram({ item }) {
  const state = item.state;
  const amt = item.quote.price;

  // Determine money position
  const moneyPos =
    ['HELD'].includes(item.timeline.find(t => t.state === 'HELD') ? item.timeline[item.timeline.length - 1].state : '') ? 1 :
    item.state === 'CLOSED' ? 2 :
    item.state === 'REFUNDED' ? 0 :
    item.state === 'HELD' ? 1 : 0;

  const boxes = [
    { label: 'Care reserve', sublabel: 'Rs 2,500', color: '#FFFDF5' },
    { label: 'Escrow', sublabel: `Rs ${amt} held`, color: '#B28DFF' },
    { label: 'Pharmacy', sublabel: item.quote.pharmacy, color: '#4ADE9A' },
  ];

  return (
    <div>
      <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 12 }}>Escrow diagram</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {boxes.map((box, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{
              flex: 1,
              border: '3px solid #111',
              padding: '14px 12px',
              background: box.color,
              borderRadius: 4,
              textAlign: 'center',
              boxShadow: '4px 4px 0 #111',
              position: 'relative',
            }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{box.label}</div>
              <div className="mono" style={{ fontSize: 11, color: '#555' }}>{box.sublabel}</div>
            </div>
            {i < boxes.length - 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: 18, fontWeight: 700 }}>→</div>
                <div className="mono" style={{ fontSize: 9, color: '#4ADE9A', marginTop: -4 }}>Rs {amt}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShipTracker({ stage }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 12 }}>Shipment tracker</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 0, right: 0, top: '50%',
          height: 4, background: '#ddd', borderRadius: 2, zIndex: 0,
          transform: 'translateY(-50%)',
        }}>
          <div style={{
            width: `${(stage / (SHIP_STATIONS.length - 1)) * 100}%`,
            height: '100%',
            background: '#4ADE9A',
            border: '2px solid #111',
            transition: 'width 0.5s ease',
          }} />
        </div>
        {SHIP_STATIONS.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 28, height: 28,
              background: i <= stage ? '#4ADE9A' : '#FFFDF5',
              border: '3px solid #111',
              borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 6px',
              fontWeight: 800, fontSize: 14,
              boxShadow: i === stage ? '3px 3px 0 #111' : 'none',
            }}>
              {i <= stage ? '✓' : '○'}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{s}</div>
          </div>
        ))}
        {/* Van icon */}
        <div style={{
          position: 'absolute',
          left: `calc(${(stage / (SHIP_STATIONS.length - 1)) * 100}% - 16px)`,
          top: -22,
          fontSize: 24,
          transition: 'left 0.5s ease',
          zIndex: 2,
        }}>🚐</div>
      </div>
    </div>
  );
}

export default function RefillDetailPage() {
  const [selectedId, setSelectedId] = useState('R-101');
  const item = ITEMS.find(i => i.id === selectedId) || ITEMS[0];

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>Refill detail</h1>

      {/* Item picker */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {ITEMS.map(it => (
          <button
            key={it.id}
            className={`btn ${selectedId === it.id ? 'btn-lemon' : 'btn-paper'}`}
            style={{ padding: '8px 16px', fontSize: 14 }}
            onClick={() => setSelectedId(it.id)}
          >
            {it.id} — {it.patient}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Timeline */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '3px solid #111', background: '#111', color: '#FFFDF5' }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>{item.id}</span>
              <span style={{ marginLeft: 12, fontFamily: 'Space Mono', fontSize: 12, color: '#aaa' }}>{item.patient} · {item.quote.med}</span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {item.timeline.map((step, i) => {
                const color = STATES_COLOR[step.state] || '#eee';
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16, position: 'relative' }}>
                    {/* Line */}
                    {i < item.timeline.length - 1 && (
                      <div style={{ position: 'absolute', left: 14, top: 32, width: 3, height: 'calc(100% + 4px)', background: '#ddd' }} />
                    )}
                    {/* Dot */}
                    <div style={{
                      width: 32, height: 32, background: color, border: '3px solid #111',
                      borderRadius: 3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 10, boxShadow: '2px 2px 0 #111', zIndex: 1,
                    }}>
                      {step.state === 'CLOSED' ? '✓' : i + 1}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{step.state}</span>
                        <AgentChip agentKey={step.agent} />
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: '#666' }}>{step.t}</div>
                      <div style={{ fontSize: 13, color: '#444', marginTop: 2 }}>{step.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ flex: 3, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Escrow */}
          <div className="card" style={{ padding: 20 }}>
            <EscrowDiagram item={item} />
          </div>

          {/* Shipment tracker */}
          <div className="card" style={{ padding: 20 }}>
            <ShipTracker stage={item.shipStage} />
          </div>

          {/* Roles card */}
          <div className="card" style={{ padding: 20 }}>
            <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 12 }}>Roles</div>
            {[
              { role: 'Patient', name: item.patient, color: '#FFE14D' },
              { role: 'Owner', name: item.owner, color: '#5CC8FF' },
              { role: 'Payer', name: item.payer, color: '#B28DFF' },
            ].map(r => (
              <div key={r.role} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ background: r.color, border: '2px solid #111', padding: '4px 10px', fontWeight: 800, fontSize: 12, borderRadius: 3, minWidth: 60, textAlign: 'center' }}>
                  {r.role}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
