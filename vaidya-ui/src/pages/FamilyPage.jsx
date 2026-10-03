import { useState } from 'react';
import { FAMILY_MEMBERS } from '../data/mockData';
import { Sticker } from '../components/ui';

const CHAT_MESSAGES = [
  { from: 'vaidya', text: "Papa's Metformin refill is due in 4 days. Sharma Medicos, Amritsar has it in stock for Rs 840. Shall I go ahead?" },
  { from: 'family', name: 'Rishikesh', text: "Yes, please go ahead." },
  { from: 'vaidya', text: "Done — Rs 840 held in escrow. Shipment DL-772310 created, pickup is tomorrow morning." },
  { from: 'family', name: 'Rishikesh', text: "Great, thanks!" },
  { from: 'vaidya', text: "Delivered ✓ — Rs 840 released to Sharma Medicos. Papa has 34 days of stock." },
  {
    from: 'vaidya',
    text: "Papa has paused this refill. Nothing was charged. Ask again tomorrow, or will you talk to them?",
    heart: true,
  },
  { from: 'family', name: 'Neha', text: "I'll call him. Thanks for the gentle wording." },
];

const QUICK_REPLIES = ['Accept', 'Pass to Neha', 'Snooze'];

function MemberCard({ member }) {
  const [role, payer] = member.role.split(' · ');
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{member.name}</div>
          <div className="mono" style={{ fontSize: 11, color: '#666' }}>{member.phone}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          {member.role.split(' · ').map((r, i) => (
            <Sticker
              key={r}
              label={r}
              kind={r === 'patient' ? 'ask' : r === 'owner' ? 'act' : r === 'payer' ? 'sandbox' : 'live'}
              rotate={i % 2 === 0 ? -1 : 1}
            />
          ))}
        </div>
      </div>
      <div style={{
        width: 48, height: 48,
        background: member.color,
        border: '3px solid #111',
        borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 20, boxShadow: '3px 3px 0 #111',
      }}>
        {member.name[0]}
      </div>
    </div>
  );
}

function ChatBubble({ msg }) {
  const isVaidya = msg.from === 'vaidya';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isVaidya ? 'flex-start' : 'flex-end',
      marginBottom: 12,
    }}>
      <div style={{
        maxWidth: '80%',
        background: isVaidya ? '#4ADE9A' : '#5CC8FF',
        border: '3px solid #111',
        borderRadius: isVaidya ? '4px 12px 12px 4px' : '12px 4px 4px 12px',
        padding: '10px 14px',
        boxShadow: '3px 3px 0 #111',
        position: 'relative',
      }}>
        {!isVaidya && (
          <div style={{ fontSize: 11, fontWeight: 800, color: '#333', marginBottom: 4 }}>{msg.name}</div>
        )}
        {isVaidya && (
          <div style={{ fontSize: 11, fontWeight: 800, color: '#333', marginBottom: 4 }}>Vaidya</div>
        )}
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>{msg.text}</div>
        {msg.heart && (
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>❤️</span>
            <span style={{ fontSize: 11, color: '#555', fontStyle: 'italic' }}>dignity-first wording</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FamilyPage() {
  const [replies, setReplies] = useState([]);

  const sendReply = (text) => {
    setReplies(prev => [...prev, { from: 'family', name: 'Rishikesh', text }]);
  };

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>Family</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>
        Members, roles and the WhatsApp-style group channel.
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Member cards */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, borderBottom: '3px solid #111', paddingBottom: 8 }}>
            Members
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {FAMILY_MEMBERS.map(m => <MemberCard key={m.name} member={m} />)}
          </div>
        </div>

        {/* Chat panel */}
        <div style={{ flex: 3, minWidth: 300 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, borderBottom: '3px solid #111', paddingBottom: 8 }}>
            Group: Sharma family
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Chat header */}
            <div style={{ background: '#111', color: '#4ADE9A', padding: '12px 16px', fontFamily: 'Space Mono', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700 }}>Vaidya family group</span>
              <Sticker label="LIVE" kind="live" rotate={1} />
            </div>

            {/* Messages */}
            <div style={{ padding: 16, minHeight: 360, maxHeight: 480, overflowY: 'auto', background: '#f5f3ea' }}>
              {CHAT_MESSAGES.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
              {replies.map((msg, i) => <ChatBubble key={`r-${i}`} msg={msg} />)}
            </div>

            {/* Quick replies */}
            <div style={{ padding: '12px 16px', borderTop: '3px solid #111', display: 'flex', gap: 10, flexWrap: 'wrap', background: '#FFFDF5' }}>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 600, alignSelf: 'center' }}>Quick reply:</span>
              {QUICK_REPLIES.map(r => (
                <button
                  key={r}
                  className="btn btn-lemon"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => sendReply(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
