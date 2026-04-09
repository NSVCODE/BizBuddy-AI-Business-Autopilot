import React, { useState, useRef, useEffect } from 'react'
import { simulateWhatsApp, simulateMissedCall } from '../../services/api'
import { v4 as uuidv4 } from 'uuid'

const WA_GREEN = '#25D366'
const WA_DARK = '#128C7E'
const WA_BG = '#ECE5DD'
const WA_BUBBLE_OUT = '#DCF8C6'

const DEMO_PHONES = [
  { label: 'Priya (+91 98765 11111)', phone: '+91 98765 11111' },
  { label: 'Arjun (+91 98765 22222)', phone: '+91 98765 22222' },
  { label: 'New Customer', phone: '+91 90000 00001' },
]

function WaMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '6px',
      animation: 'fadeInUp 0.2s ease-out',
    }}>
      <div style={{
        maxWidth: '78%',
        padding: '7px 10px 5px',
        borderRadius: isUser ? '8px 8px 2px 8px' : '8px 8px 8px 2px',
        background: isUser ? WA_BUBBLE_OUT : 'white',
        boxShadow: '0 1px 2px rgba(0,0,0,0.13)',
        fontSize: '13.5px',
        lineHeight: '1.5',
        color: '#111',
        position: 'relative',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
        <div style={{ fontSize: '10px', color: '#999', textAlign: 'right', marginTop: '2px' }}>
          {msg.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isUser && ' ✓✓'}
        </div>
      </div>
    </div>
  )
}

export default function WhatsAppPanel({ onLeadCreated }) {
  const [selectedPhone, setSelectedPhone] = useState(DEMO_PHONES[0].phone)
  const [customPhone, setCustomPhone] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [conversations, setConversations] = useState({}) // keyed by phone
  const [sessions, setSessions] = useState({}) // phone -> session_id
  const [isLoading, setIsLoading] = useState(false)
  const [missedCallLoading, setMissedCallLoading] = useState(false)
  const bottomRef = useRef(null)

  const activePhone = customPhone || selectedPhone
  const currentConv = conversations[activePhone] || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, activePhone])

  const getSession = (phone) => {
    if (!sessions[phone]) {
      const sid = `wa_${phone.replace(/\D/g, '').slice(-8)}_${uuidv4().slice(0, 6)}`
      setSessions(prev => ({ ...prev, [phone]: sid }))
      return sid
    }
    return sessions[phone]
  }

  const addMessage = (phone, role, content) => {
    setConversations(prev => ({
      ...prev,
      [phone]: [...(prev[phone] || []), { id: uuidv4(), role, content, time: new Date() }]
    }))
  }

  const handleSend = async () => {
    const text = messageInput.trim()
    if (!text || isLoading) return
    setMessageInput('')
    addMessage(activePhone, 'user', text)
    setIsLoading(true)
    try {
      const session_id = getSession(activePhone)
      const data = await simulateWhatsApp(activePhone, text, session_id)
      addMessage(activePhone, 'assistant', data.reply)
    } catch {
      addMessage(activePhone, 'assistant', 'Hi there! ☕ Thanks for reaching out to LatteLune. How can I help?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMissedCall = async () => {
    setMissedCallLoading(true)
    try {
      const data = await simulateMissedCall(activePhone)
      addMessage(activePhone, 'assistant', data.follow_up_message)
      onLeadCreated?.()
    } catch {
      addMessage(activePhone, 'assistant', "Hey! 👋 Sorry we missed your call. We're LatteLune café — how can we help you today?")
    } finally {
      setMissedCallLoading(false)
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Panel Header */}
      <div style={{
        background: WA_DARK,
        color: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '24px' }}>📱</span>
        <div>
          <div style={{ fontWeight: '600', fontSize: '15px' }}>WhatsApp Simulator</div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>Simulate incoming messages & missed calls</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${WA_BG}`, background: '#f0f0f0' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedPhone}
            onChange={e => { setSelectedPhone(e.target.value); setCustomPhone('') }}
            style={{
              flex: 1, padding: '7px 10px', borderRadius: '8px',
              border: '1px solid #ddd', fontSize: '13px', background: 'white',
              color: '#333', minWidth: '160px',
            }}
          >
            {DEMO_PHONES.map(p => (
              <option key={p.phone} value={p.phone}>{p.label}</option>
            ))}
          </select>
          <input
            placeholder="Or type a phone number"
            value={customPhone}
            onChange={e => setCustomPhone(e.target.value)}
            style={{
              flex: 1, padding: '7px 10px', borderRadius: '8px',
              border: '1px solid #ddd', fontSize: '13px', minWidth: '160px',
            }}
          />
        </div>
        <button
          onClick={handleMissedCall}
          disabled={missedCallLoading}
          style={{
            width: '100%',
            padding: '9px',
            borderRadius: '8px',
            background: missedCallLoading ? '#ccc' : '#FF6B6B',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          📞 {missedCallLoading ? 'Sending follow-up...' : 'Simulate Missed Call → Auto WhatsApp Follow-up'}
        </button>
      </div>

      {/* Phone Mockup / Chat Area */}
      <div style={{
        flex: 1,
        background: WA_BG,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        padding: '12px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* WhatsApp contact header */}
        <div style={{
          background: WA_DARK,
          color: 'white',
          padding: '10px 14px',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '0',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: WA_GREEN,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>
            ☕
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>LatteLune</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              {activePhone} · {isLoading ? 'typing...' : 'online'}
            </div>
          </div>
        </div>

        <div style={{
          flex: 1,
          background: WA_BG,
          padding: '10px',
          minHeight: '200px',
          overflowY: 'auto',
        }}>
          {currentConv.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#888',
              fontSize: '13px',
              marginTop: '40px',
              padding: '20px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
              <div>Type a message below or click "Simulate Missed Call" to start</div>
            </div>
          ) : (
            currentConv.map(msg => <WaMessage key={msg.id} msg={msg} />)
          )}
          {isLoading && (
            <div style={{
              display: 'inline-block',
              background: 'white',
              borderRadius: '8px 8px 8px 2px',
              padding: '8px 12px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.13)',
            }}>
              <span style={{ color: WA_GREEN, fontSize: '18px', letterSpacing: '2px' }}>•••</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* WA Input */}
        <div style={{
          background: '#f0f0f0',
          padding: '8px 10px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          borderRadius: '0 0 8px 8px',
        }}>
          <input
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a WhatsApp message..."
            style={{
              flex: 1,
              padding: '9px 14px',
              borderRadius: '20px',
              border: 'none',
              background: 'white',
              fontSize: '13px',
              color: '#111',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!messageInput.trim() || isLoading}
            style={{
              width: '40px', height: '40px',
              borderRadius: '50%',
              background: messageInput.trim() && !isLoading ? WA_GREEN : '#ccc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
