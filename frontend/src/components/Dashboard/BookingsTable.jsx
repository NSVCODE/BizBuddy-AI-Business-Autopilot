import React, { useState } from 'react'
import { updateBookingStatus, cancelBooking } from '../../services/api'

const STATUS_STYLES = {
  pending:   { bg: '#FFF7ED', text: '#C2410C', label: 'Pending' },
  confirmed: { bg: '#F0FDF4', text: '#15803D', label: 'Confirmed' },
  cancelled: { bg: '#FEF2F2', text: '#B91C1C', label: 'Cancelled' },
  completed: { bg: '#F0F9FF', text: '#0369A1', label: 'Completed' },
}

export default function BookingsTable({ bookings, loading, onRefresh }) {
  const [updating, setUpdating] = useState(null)

  const handleConfirm = async (id) => {
    setUpdating(id)
    try { await updateBookingStatus(id, 'confirmed'); onRefresh?.() }
    finally { setUpdating(null) }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    setUpdating(id)
    try { await cancelBooking(id); onRefresh?.() }
    finally { setUpdating(null) }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>Loading bookings...</div>
  if (!bookings?.length) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
      <div style={{ fontSize: '40px', marginBottom: '8px' }}>📅</div>
      <div>No bookings yet. Chat to make one!</div>
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--beige)', background: 'var(--gray-100)' }}>
            {['Guest', 'Phone', 'Date & Time', 'Party', 'Status', 'Requests', 'Actions'].map(h => (
              <th key={h} style={{
                padding: '10px 14px', textAlign: 'left',
                color: 'var(--gray-600)', fontWeight: '600',
                fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => {
            const st = STATUS_STYLES[b.status] || STATUS_STYLES.pending
            const isToday = b.date === new Date().toISOString().slice(0, 10)
            return (
              <tr key={b.id} style={{
                borderBottom: '1px solid var(--beige)',
                background: isToday ? '#FFFBEB' : i % 2 === 0 ? 'white' : 'var(--off-white)',
              }}>
                <td style={{ padding: '12px 14px', fontWeight: '500', color: 'var(--brown)' }}>
                  {isToday && <span style={{ fontSize: '10px', background: 'var(--yellow)', color: 'var(--brown)', padding: '1px 6px', borderRadius: '10px', marginRight: '6px', fontWeight: '700' }}>TODAY</span>}
                  {b.customer_name}
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--gray-600)' }}>{b.phone}</td>
                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                    {new Date(b.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ color: 'var(--blue)', fontSize: '13px' }}>⏰ {b.time?.slice(0,5)}</div>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <span style={{ fontSize: '18px' }}>{'👤'.repeat(Math.min(b.party_size, 4))}</span>
                  <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{b.party_size} guests</div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    background: st.bg, color: st.text,
                    padding: '3px 10px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: '600',
                  }}>{st.label}</span>
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--gray-600)', fontSize: '13px', maxWidth: '180px' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>
                    {b.special_requests || '—'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleConfirm(b.id)}
                        disabled={updating === b.id}
                        style={{
                          padding: '5px 12px', borderRadius: '8px',
                          background: '#10B981', color: 'white',
                          fontSize: '12px', fontWeight: '600',
                          opacity: updating === b.id ? 0.6 : 1,
                        }}
                      >Confirm</button>
                    )}
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={updating === b.id}
                        style={{
                          padding: '5px 12px', borderRadius: '8px',
                          background: '#FEE2E2', color: '#B91C1C',
                          fontSize: '12px', fontWeight: '600',
                          opacity: updating === b.id ? 0.6 : 1,
                        }}
                      >Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
