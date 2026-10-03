import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useVaidya } from '../context/VaidyaContext';
import { Sticker } from './ui';

const NAV = [
  { to: '/',          label: '🏠 Desk' },
  { to: '/live',      label: '⚡ Live run' },
  { to: '/team',      label: '👥 Team' },
  { to: '/refill',    label: '💊 Refill detail' },
  { to: '/money',     label: '💰 Money' },
  { to: '/safety',    label: '🛡 Safety' },
  { to: '/records',   label: '📋 Records' },
  { to: '/family',    label: '❤️ Family' },
  { to: '/insights',  label: '📊 Insights' },
  { to: '/arch',      label: '🏗 Architecture' },
  { to: '/settings',  label: '⚙️ Settings' },
];

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="mono" style={{ fontSize: 12, color: '#666' }}>
      {t.toLocaleTimeString('en-IN', { hour12: false })}
    </span>
  );
}

function MarqueeTicker() {
  const { ledger } = useVaidya();
  const last8 = ledger.slice(0, 8);
  const text = last8.map(r => `${r.t} · [${r.agent.toUpperCase()}] ${r.msg}`).join('   ·   ');
  return (
    <div style={{
      background: '#111',
      borderBottom: '3px solid #111',
      overflow: 'hidden',
      height: 32,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="marquee-inner mono" style={{ color: '#4ADE9A', fontSize: 12, padding: '0 20px' }}>
        {text}
      </div>
    </div>
  );
}

export function Layout({ children }) {
  const { demoMode, setDemoMode, isLive, playDemo, demoPlaying, stopDemo } = useVaidya();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{
        borderBottom: '3px solid #111',
        background: '#FFFDF5',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 20px',
        height: 56,
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        {/* Logo */}
        <div
          style={{
            background: '#111',
            color: '#FFE14D',
            fontWeight: 800,
            fontSize: 20,
            fontFamily: 'Space Grotesk',
            padding: '4px 14px',
            border: '3px solid #111',
            boxShadow: '4px 4px 0 #FFE14D',
            letterSpacing: '-0.02em',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          Vaidya
        </div>

        {/* Household */}
        <div style={{ border: '2px solid #111', padding: '4px 12px', fontWeight: 700, fontSize: 13, borderRadius: 4 }}>
          Sharma family
        </div>

        <div style={{ flex: 1 }} />

        {/* Live sticker + clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sticker label={isLive ? 'LIVE' : 'MOCK'} kind={isLive ? 'live' : 'sandbox'} rotate={1} />
          <Clock />
        </div>

        {/* Demo mode toggle */}
        <button
          className={`btn ${demoMode ? 'btn-lemon' : 'btn-paper'}`}
          style={{ padding: '6px 14px', fontSize: 13 }}
          onClick={setDemoMode}
        >
          {demoMode ? '✦ Demo on' : '○ Demo mode'}
        </button>

        {/* Revoke all */}
        <button
          className="btn btn-red"
          style={{ padding: '6px 14px', fontSize: 13 }}
          onClick={() => alert('Revoke all: This would cancel all open orders. In production this triggers immediately.')}
        >
          Revoke all
        </button>
      </header>

      {/* Marquee */}
      <MarqueeTicker />

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left rail */}
        <nav style={{
          width: 200,
          borderRight: '3px solid #111',
          background: '#FFFDF5',
          flexShrink: 0,
          padding: '16px 0',
          overflowY: 'auto',
        }}>
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 16px',
                margin: '4px 10px',
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
                color: '#111',
                border: isActive ? '3px solid #111' : '3px solid transparent',
                borderRadius: 4,
                background: isActive ? '#FFE14D' : 'transparent',
                boxShadow: isActive ? '4px 4px 0 #111' : 'none',
                transition: 'all 0.1s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
