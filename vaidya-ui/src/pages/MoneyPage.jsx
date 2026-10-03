import { useState } from 'react';
import { useVaidya } from '../context/VaidyaContext';
import { TRANSACTIONS, RESERVE_HISTORY } from '../data/mockData';
import { Sticker } from '../components/ui';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid
} from 'recharts';

function ReserveBar({ reserve }) {
  const total = reserve.available + reserve.hold + reserve.released;
  const pctAvail   = (reserve.available / total) * 100;
  const pctHold    = (reserve.hold / total) * 100;
  const pctReleased = (reserve.released / total) * 100;

  return (
    <div>
      <div style={{ display: 'flex', height: 32, border: '3px solid #111', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ width: `${pctAvail}%`, background: '#4ADE9A', borderRight: '2px solid #111', position: 'relative' }}>
          {/* diagonal stripes */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)',
          }} />
        </div>
        <div style={{ width: `${pctHold}%`, background: '#B28DFF', borderRight: '2px solid #111' }} />
        <div style={{ width: `${pctReleased}%`, background: '#5CC8FF' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Available', val: reserve.available, color: '#4ADE9A' },
          { label: 'On hold', val: reserve.hold, color: '#B28DFF' },
          { label: 'Released', val: reserve.released, color: '#5CC8FF' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, background: item.color, border: '2px solid #111' }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</span>
            <span className="mono" style={{ fontSize: 12 }}>₹{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TxnStatus({ status }) {
  const map = {
    HELD:     { color: '#B28DFF', label: 'HELD' },
    RELEASED: { color: '#4ADE9A', label: 'RELEASED' },
    REFUNDED: { color: '#FFE14D', label: 'REFUNDED' },
  };
  const m = map[status] || { color: '#eee', label: status };
  return (
    <span style={{ background: m.color, border: '2px solid #111', padding: '2px 8px', fontSize: 11, fontWeight: 800, borderRadius: 2 }}>
      {m.label}
    </span>
  );
}

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ padding: 32, maxWidth: 400, width: '90%' }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 12 }}>Revoke now?</h2>
        <p style={{ color: '#444', marginBottom: 24, lineHeight: 1.6 }}>
          This will cancel all held payments and pause all open orders immediately. Escrowed money returns to the reserve.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-red" style={{ padding: '10px 20px', flex: 1 }} onClick={onConfirm}>Revoke now</button>
          <button className="btn btn-paper" style={{ padding: '10px 20px', flex: 1 }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function MoneyPage() {
  const { reserve } = useVaidya();
  const [limit, setLimit] = useState(5000);
  const [showConfirm, setShowConfirm] = useState(false);
  const [revoked, setRevoked] = useState(false);

  const handleRevoke = () => {
    setRevoked(true);
    setShowConfirm(false);
  };

  const CustomDot = ({ cx, cy, payload }) => {
    if (!payload.event) return null;
    return (
      <circle cx={cx} cy={cy} r={6} fill="#FF3B30" stroke="#111" strokeWidth={2} />
    );
  };

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>Money</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <Sticker label="SANDBOX" kind="sandbox" rotate={-1} />
        <span style={{ fontSize: 13, color: '#666' }}>All transactions are mock data</span>
      </div>

      {/* Reserve card */}
      <div className="card" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Care reserve — available</div>
            <div style={{ fontFamily: 'Space Mono', fontSize: 56, fontWeight: 700, lineHeight: 1 }}>
              ₹{reserve.available.toLocaleString('en-IN')}
            </div>
          </div>
          {revoked && (
            <div style={{ background: '#FF3B30', color: '#fff', border: '3px solid #111', padding: '8px 16px', fontWeight: 800 }}>
              ⚠ ALL ORDERS REVOKED
            </div>
          )}
        </div>
        <ReserveBar reserve={reserve} />
      </div>

      {/* Reserve history chart */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Reserve balance — last 14 days</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={RESERVE_HISTORY}>
            <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
            <XAxis dataKey="date" tick={{ fontFamily: 'Space Mono', fontSize: 10 }} tickLine={false} />
            <YAxis tick={{ fontFamily: 'Space Mono', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ border: '3px solid #111', boxShadow: '4px 4px 0 #111', fontFamily: 'Space Mono', fontSize: 11 }}
            />
            <Line
              type="stepAfter"
              dataKey="balance"
              stroke="#111"
              strokeWidth={3}
              dot={<CustomDot />}
            />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, background: '#FF3B30', borderRadius: '50%', border: '2px solid #111' }} />
            <span style={{ fontSize: 11, color: '#666' }}>Hold / release / refund events</span>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '14px 20px', borderBottom: '3px solid #111', fontWeight: 800, fontSize: 16 }}>
          Transactions
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Time</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Pharmacy</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map(txn => (
                <tr key={txn.id}>
                  <td><span className="mono" style={{ fontSize: 12 }}>{txn.id}</span> <Sticker label="SANDBOX" kind="sandbox" rotate={-1} /></td>
                  <td><span className="mono" style={{ fontSize: 12 }}>{txn.t}</span></td>
                  <td><span style={{ fontWeight: 700, fontSize: 12 }}>{txn.type}</span></td>
                  <td><span className="mono" style={{ fontWeight: 700 }}>₹{txn.amount}</span></td>
                  <td><TxnStatus status={txn.status} /></td>
                  <td style={{ fontSize: 13 }}>{txn.pharmacy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Controls</div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontWeight: 600, fontSize: 13 }}>Monthly limit</label>
            <span className="mono" style={{ fontWeight: 700 }}>₹{limit.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range" min={1000} max={10000} step={100}
            value={limit} onChange={e => setLimit(Number(e.target.value))}
          />
        </div>
        <button
          className="btn btn-red"
          style={{ padding: '12px 24px', fontSize: 14 }}
          onClick={() => setShowConfirm(true)}
        >
          Revoke now
        </button>
      </div>

      {showConfirm && <ConfirmDialog onConfirm={handleRevoke} onCancel={() => setShowConfirm(false)} />}
    </div>
  );
}
