import React from 'react'

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-md)',
      padding: '20px 24px',
      boxShadow: 'var(--shadow-sm)',
      borderLeft: `4px solid ${color}`,
      flex: 1,
      minWidth: '160px',
    }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--gray-800)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '4px', fontWeight: '500' }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: color, marginTop: '3px', fontWeight: '600' }}>{sub}</div>}
    </div>
  )
}

export default function StatsBar({ stats, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            flex: 1, minWidth: '160px', height: '110px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gray-100)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <StatCard icon="👥" label="Total Leads" value={stats?.total_leads} color="var(--blue)" sub={`+${stats?.new_leads_today ?? 0} today`} />
      <StatCard icon="📅" label="Bookings Today" value={stats?.bookings_today} color="var(--yellow-dark)" sub={`${stats?.total_bookings ?? 0} total`} />
      <StatCard icon="💬" label="Conversations" value={stats?.active_conversations} color="var(--brown)" />
      <StatCard icon="✅" label="Confirmed" value={stats?.confirmed_bookings} color="#10B981" sub={`${stats?.pending_bookings ?? 0} pending`} />
      <StatCard icon="📱" label="WhatsApp Leads" value={stats?.whatsapp_leads} color={WA_GREEN} sub={`${stats?.missed_call_leads ?? 0} missed calls`} />
    </div>
  )
}

const WA_GREEN = '#25D366'
