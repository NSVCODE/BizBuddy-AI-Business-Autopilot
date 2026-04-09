import React, { useState } from 'react'
import { updateLead } from '../../services/api'

const STATUS_COLORS = {
  new:       { bg: '#EFF6FF', text: '#1D4ED8', label: 'New' },
  contacted: { bg: '#FFF7ED', text: '#C2410C', label: 'Contacted' },
  converted: { bg: '#F0FDF4', text: '#15803D', label: 'Converted' },
  lost:      { bg: '#FEF2F2', text: '#B91C1C', label: 'Lost' },
}

const SOURCE_ICONS = {
  web_chat:    { icon: '💬', label: 'Web Chat', color: 'var(--blue)' },
  whatsapp:    { icon: '📱', label: 'WhatsApp', color: '#25D366' },
  missed_call: { icon: '📞', label: 'Missed Call', color: '#F59E0B' },
}

function Badge({ type, value }) {
  if (type === 'status') {
    const s = STATUS_COLORS[value] || STATUS_COLORS.new
    return (
      <span style={{
        background: s.bg, color: s.text,
        padding: '2px 10px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '600',
      }}>{s.label}</span>
    )
  }
  if (type === 'source') {
    const s = SOURCE_ICONS[value] || { icon: '🔗', label: value, color: 'var(--gray-600)' }
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 10px', borderRadius: '20px',
        background: 'var(--gray-100)', color: s.color,
        fontSize: '12px', fontWeight: '600',
        border: `1px solid ${s.color}30`,
      }}>
        {s.icon} {s.label}
      </span>
    )
  }
}

export default function LeadsTable({ leads, loading, onRefresh }) {
  const [updating, setUpdating] = useState(null)

  const handleStatusChange = async (id, status) => {
    setUpdating(id)
    try {
      await updateLead(id, { status })
      onRefresh?.()
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>Loading leads...</div>
  if (!leads?.length) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
      <div style={{ fontSize: '40px', marginBottom: '8px' }}>📭</div>
      <div>No leads yet. Start a conversation!</div>
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--beige)', background: 'var(--gray-100)' }}>
            {['Name', 'Phone', 'Source', 'Inquiry', 'Status', 'Notes', 'Time'].map(h => (
              <th key={h} style={{
                padding: '10px 14px', textAlign: 'left',
                color: 'var(--gray-600)', fontWeight: '600',
                fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr key={lead.id} style={{
              borderBottom: '1px solid var(--beige)',
              background: i % 2 === 0 ? 'white' : 'var(--off-white)',
              transition: 'background 0.15s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--beige)'}
            onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : 'var(--off-white)'}
            >
              <td style={{ padding: '12px 14px', fontWeight: '500', color: 'var(--brown)' }}>
                {lead.name || <span style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>Unknown</span>}
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--gray-600)', fontFamily: 'monospace', fontSize: '13px' }}>
                {lead.phone || '—'}
              </td>
              <td style={{ padding: '12px 14px' }}>
                <Badge type="source" value={lead.source} />
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--gray-600)', textTransform: 'capitalize' }}>
                {lead.inquiry_type || '—'}
              </td>
              <td style={{ padding: '12px 14px' }}>
                <select
                  value={lead.status}
                  onChange={e => handleStatusChange(lead.id, e.target.value)}
                  disabled={updating === lead.id}
                  style={{
                    padding: '3px 8px', borderRadius: '20px',
                    border: '1px solid var(--beige-dark)',
                    fontSize: '12px', cursor: 'pointer',
                    background: STATUS_COLORS[lead.status]?.bg || 'white',
                    color: STATUS_COLORS[lead.status]?.text || 'var(--gray-800)',
                    fontWeight: '600',
                  }}
                >
                  {Object.entries(STATUS_COLORS).map(([v, s]) => (
                    <option key={v} value={v}>{s.label}</option>
                  ))}
                </select>
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--gray-600)', fontSize: '13px', maxWidth: '200px' }}>
                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.notes || '—'}
                </span>
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--gray-400)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
