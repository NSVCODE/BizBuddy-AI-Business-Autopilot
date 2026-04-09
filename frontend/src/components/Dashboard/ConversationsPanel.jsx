import React, { useState } from 'react'
import { getMessages } from '../../services/api'

const CHANNEL_ICONS = {
  web_chat: '💬',
  whatsapp: '📱',
}

export default function ConversationsPanel({ conversations, loading }) {
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [msgLoading, setMsgLoading] = useState(false)

  const handleSelect = async (conv) => {
    if (selected?.id === conv.id) { setSelected(null); return }
    setSelected(conv)
    setMsgLoading(true)
    try {
      const msgs = await getMessages(conv.session_id)
      setMessages(msgs)
    } catch {
      setMessages([])
    } finally {
      setMsgLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>Loading...</div>
  if (!conversations?.length) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
      <div style={{ fontSize: '40px', marginBottom: '8px' }}>💬</div>
      <div>No conversations yet.</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: '16px', minHeight: '300px' }}>
      {/* List */}
      <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => handleSelect(conv)}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: selected?.id === conv.id ? 'var(--beige)' : 'white',
              border: `1px solid ${selected?.id === conv.id ? 'var(--beige-dark)' : 'var(--gray-200)'}`,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px' }}>{CHANNEL_ICONS[conv.channel] || '💬'}</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--brown)', flex: 1 }}>
                {conv.channel === 'whatsapp' ? 'WhatsApp' : 'Web Chat'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
                {new Date(conv.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <div style={{
              fontSize: '12.5px', color: 'var(--gray-600)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {conv.last_message || 'No messages'}
            </div>
          </div>
        ))}
      </div>

      {/* Messages */}
      {selected && (
        <div style={{
          flex: 1,
          background: 'var(--off-white)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--beige-dark)',
          padding: '16px',
          overflowY: 'auto',
          maxHeight: '400px',
          animation: 'fadeInUp 0.2s ease-out',
        }}>
          {msgLoading ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', paddingTop: '40px' }}>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', paddingTop: '40px' }}>No messages found.</div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? 'var(--blue)' : 'white',
                  color: msg.role === 'user' ? 'white' : 'var(--gray-800)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                  <div style={{ fontSize: '10px', opacity: 0.6, textAlign: 'right', marginTop: '2px' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
