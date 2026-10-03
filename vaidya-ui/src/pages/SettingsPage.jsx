import { useState } from 'react';
import { Sticker } from '../components/ui';

const RAILS_HEALTH = [
  { name: 'Gnani (Voice)', status: 'ok', lastCheck: '18:27:09' },
  { name: 'Pine Labs (Payments)', status: 'ok', lastCheck: '18:27:13' },
  { name: 'Delhivery (Logistics)', status: 'warn', lastCheck: '18:27:30' },
];

const CONTACTS = [
  { name: 'Dr. Kapoor', phone: '+91 98xxx xx210', canReceive: true },
];

export default function SettingsPage() {
  const [autonomy, setAutonomy] = useState('act');
  const [quietFrom, setQuietFrom] = useState('22:00');
  const [quietTo, setQuietTo] = useState('07:00');
  const [districtRule, setDistrictRule] = useState(true);
  const [contacts, setContacts] = useState(CONTACTS);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [resetDone, setResetDone] = useState(false);

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts(prev => [...prev, { ...newContact, canReceive: true }]);
      setNewContact({ name: '', phone: '' });
    }
  };

  const removeContact = (name) => {
    setContacts(prev => prev.filter(c => c.name !== name));
  };

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>Settings</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>
        Autonomy, rules and approved contacts.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
        {/* Autonomy level */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Autonomy level</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { key: 'ask', label: 'Ask first', desc: 'Every action needs owner approval before executing.' },
              { key: 'reserve', label: 'Ask above reserve', desc: 'Act on routine refills; ask if cost exceeds the monthly reserve.' },
              { key: 'act', label: 'Act on routine', desc: 'Execute all safety-cleared actions automatically. Only ask on red flags.' },
            ].map(opt => (
              <label key={opt.key} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px 16px',
                border: autonomy === opt.key ? '3px solid #111' : '2px solid #ddd',
                borderRadius: 4,
                background: autonomy === opt.key ? '#FFE14D' : '#FFFDF5',
                cursor: 'pointer',
                boxShadow: autonomy === opt.key ? '4px 4px 0 #111' : 'none',
              }}>
                <input type="radio" name="autonomy" value={opt.key} checked={autonomy === opt.key} onChange={() => setAutonomy(opt.key)} style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Quiet hours */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Quiet hours</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>From</label>
              <input type="time" value={quietFrom} onChange={e => setQuietFrom(e.target.value)} style={{ fontFamily: 'Space Mono', fontSize: 14 }} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, marginTop: 16 }}>→</div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>To</label>
              <input type="time" value={quietTo} onChange={e => setQuietTo(e.target.value)} style={{ fontFamily: 'Space Mono', fontSize: 14 }} />
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
              No outbound messages in this window. Red flags still alert immediately.
            </div>
          </div>
        </div>

        {/* District rule */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>District rule</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Prescription medicines may only be sourced from the patient's own district.
              </div>
            </div>
            <button
              className={`btn ${districtRule ? 'btn-mint' : 'btn-paper'}`}
              style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={() => setDistrictRule(!districtRule)}
            >
              {districtRule ? '✓ Enabled' : '○ Disabled'}
            </button>
          </div>
          {!districtRule && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#fff0ee', border: '2px solid #FF3B30', borderRadius: 3, fontSize: 12, color: '#FF3B30', fontWeight: 600 }}>
              ⚠ Disabling this removes a key compliance guard. This change requires owner confirmation.
            </div>
          )}
        </div>

        {/* Approved contacts */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Approved contacts — record recipients</div>
          {contacts.map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '10px 14px', border: '2px solid #111', borderRadius: 3 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                <div className="mono" style={{ fontSize: 11, color: '#666' }}>{c.phone}</div>
              </div>
              <button className="btn btn-red" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => removeContact(c.name)}>Remove</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <input
              placeholder="Name"
              value={newContact.name}
              onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
              style={{ flex: 1, minWidth: 140 }}
            />
            <input
              placeholder="+91 ..."
              value={newContact.phone}
              onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))}
              style={{ flex: 1, minWidth: 140 }}
            />
            <button className="btn btn-lemon" style={{ padding: '8px 16px', fontSize: 13 }} onClick={addContact}>Add</button>
          </div>
        </div>

        {/* Rails health */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Rails health</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {RAILS_HEALTH.map(rail => (
              <div key={rail.name} style={{
                flex: 1, minWidth: 180,
                border: '3px solid #111', borderRadius: 4, padding: 16,
                boxShadow: '4px 4px 0 #111',
                background: rail.status === 'ok' ? '#f0fff5' : '#fff8ee',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: rail.status === 'ok' ? '#4ADE9A' : '#FF8A3D', border: '2px solid #111' }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{rail.name}</span>
                </div>
                <div className="mono" style={{ fontSize: 10, color: '#666' }}>Last check: {rail.lastCheck}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Demo data</div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
            Reset all mock data back to the hackathon seed values.
          </div>
          <button
            className="btn btn-paper"
            style={{ padding: '10px 20px', fontSize: 13 }}
            onClick={() => { setResetDone(true); setTimeout(() => setResetDone(false), 3000); }}
          >
            Reset demo data
          </button>
          {resetDone && (
            <span style={{ marginLeft: 12, color: '#4ADE9A', fontWeight: 700, fontSize: 13 }}>✓ Reset complete</span>
          )}
        </div>
      </div>
    </div>
  );
}
