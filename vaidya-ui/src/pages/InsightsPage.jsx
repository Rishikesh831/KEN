import { INSIGHTS_DATA, AGENT_COLORS } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine,
} from 'recharts';

function TakeawayBox({ text }) {
  return (
    <div style={{
      background: '#FFE14D',
      border: '2px solid #111',
      borderRadius: 3,
      padding: '8px 12px',
      fontSize: 13,
      fontWeight: 600,
      marginTop: 12,
    }}>
      ↑ {text}
    </div>
  );
}

function ChartCard({ title, children, takeaway }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{title}</div>
      {children}
      <TakeawayBox text={takeaway} />
    </div>
  );
}

const CustomBar = ({ fill, x, y, width, height }) => (
  <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#111" strokeWidth={2} />
);

export default function InsightsPage() {
  const { daysOutOfStock, actionsPerAgent, verdictHistory, costPerDecision, districtBlocked, holdVsReleased } = INSIGHTS_DATA;

  const totalDistrictBlocked = districtBlocked.reduce((s, d) => s + d.blocked, 0);

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 48, marginBottom: 8, letterSpacing: '-0.03em' }}>Insights</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>
        8 weeks of data. All mock sandbox numbers.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
        {/* Days out of stock */}
        <ChartCard
          title="Days out of stock per patient — 8 weeks"
          takeaway="Papa had 1 day out-of-stock in 8 weeks. Maa had 4 days total."
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={daysOutOfStock} barSize={16} barGap={4}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
              <XAxis dataKey="week" tick={{ fontFamily: 'Space Mono', fontSize: 10 }} />
              <YAxis tick={{ fontFamily: 'Space Mono', fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ border: '3px solid #111', fontFamily: 'Space Mono', fontSize: 11 }} />
              <Bar dataKey="papa" fill="#FFE14D" stroke="#111" strokeWidth={2} name="Papa" />
              <Bar dataKey="maa" fill="#FF6B9D" stroke="#111" strokeWidth={2} name="Maa" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {[['Papa', '#FFE14D'], ['Maa', '#FF6B9D']].map(([n, c]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: c, border: '2px solid #111' }} />
                <span style={{ fontSize: 12 }}>{n}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Actions per agent */}
        <ChartCard
          title="Actions per agent — today"
          takeaway="Ananya (Coord) handles the most actions; Nisha (Records) the fewest — by design."
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={actionsPerAgent} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
              <XAxis type="number" tick={{ fontFamily: 'Space Mono', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontFamily: 'Space Mono', fontSize: 10 }} width={100} />
              <Tooltip contentStyle={{ border: '3px solid #111', fontFamily: 'Space Mono', fontSize: 11 }} />
              <Bar dataKey="value" stroke="#111" strokeWidth={2} label={{ position: 'right', fontSize: 10, fontFamily: 'Space Mono' }}>
                {actionsPerAgent.map((entry, i) => (
                  <rect key={i} fill={AGENT_COLORS[entry.key]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Verdict history */}
        <ChartCard
          title="ACT vs ASK vs STOP over time — 8 weeks"
          takeaway="Over 85% of decisions are straight ACT — no human needed."
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={verdictHistory} barSize={20} barGap={2}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
              <XAxis dataKey="week" tick={{ fontFamily: 'Space Mono', fontSize: 10 }} />
              <YAxis tick={{ fontFamily: 'Space Mono', fontSize: 10 }} />
              <Tooltip contentStyle={{ border: '3px solid #111', fontFamily: 'Space Mono', fontSize: 11 }} />
              <Bar dataKey="act" stackId="v" fill="#4ADE9A" stroke="#111" strokeWidth={1} name="ACT" />
              <Bar dataKey="ask" stackId="v" fill="#FFE14D" stroke="#111" strokeWidth={1} name="ASK" />
              <Bar dataKey="stop" stackId="v" fill="#FF3B30" stroke="#111" strokeWidth={1} name="STOP" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost per decision */}
        <ChartCard
          title="Cost per decision — ₹ per agent action"
          takeaway="₹0.0048 median cost per decision — less than half a paisa."
        >
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={costPerDecision}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
              <XAxis dataKey="week" tick={{ fontFamily: 'Space Mono', fontSize: 10 }} />
              <YAxis tick={{ fontFamily: 'Space Mono', fontSize: 10 }} tickFormatter={v => `₹${v.toFixed(4)}`} />
              <Tooltip
                contentStyle={{ border: '3px solid #111', fontFamily: 'Space Mono', fontSize: 11 }}
                formatter={v => [`₹${v.toFixed(4)}`, 'Cost']}
              />
              <ReferenceLine y={0.0048} stroke="#FFE14D" strokeWidth={2} strokeDasharray="6 3" label={{ value: '₹0.0048', position: 'right', fontSize: 10, fontFamily: 'Space Mono' }} />
              <Line type="monotone" dataKey="cost" stroke="#111" strokeWidth={3} dot={{ fill: '#FFE14D', stroke: '#111', strokeWidth: 2, r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* District blocks */}
        <ChartCard
          title="District blocks prevented — 8 weeks"
          takeaway={`${totalDistrictBlocked} out-of-district shipments blocked. Zero compliance violations.`}
        >
          <div style={{ fontFamily: 'Space Mono', fontSize: 56, fontWeight: 700, textAlign: 'center', lineHeight: 1, marginBottom: 16, color: '#4ADE9A' }}>
            {totalDistrictBlocked}
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={districtBlocked} barSize={20}>
              <XAxis dataKey="week" tick={{ fontFamily: 'Space Mono', fontSize: 10 }} />
              <Bar dataKey="blocked" fill="#5CC8FF" stroke="#111" strokeWidth={2} label={{ position: 'top', fontSize: 10, fontFamily: 'Space Mono' }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Hold vs released */}
        <ChartCard
          title="Money held vs released by week"
          takeaway="All held money is either released (delivered) or refunded (cancelled). Zero leakage."
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={holdVsReleased} barSize={18} barGap={4}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
              <XAxis dataKey="week" tick={{ fontFamily: 'Space Mono', fontSize: 10 }} />
              <YAxis tick={{ fontFamily: 'Space Mono', fontSize: 10 }} tickFormatter={v => `₹${v}`} />
              <Tooltip
                contentStyle={{ border: '3px solid #111', fontFamily: 'Space Mono', fontSize: 11 }}
                formatter={v => [`₹${v}`, '']}
              />
              <Bar dataKey="hold" fill="#B28DFF" stroke="#111" strokeWidth={2} name="Held" />
              <Bar dataKey="released" fill="#4ADE9A" stroke="#111" strokeWidth={2} name="Released" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {[['Held', '#B28DFF'], ['Released', '#4ADE9A']].map(([n, c]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: c, border: '2px solid #111' }} />
                <span style={{ fontSize: 12 }}>{n}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
