import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import StatsBar from '../components/Dashboard/StatsBar'
import LeadsTable from '../components/Dashboard/LeadsTable'
import BookingsTable from '../components/Dashboard/BookingsTable'
import ConversationsPanel from '../components/Dashboard/ConversationsPanel'
import WhatsAppPanel from '../components/WhatsAppSim/WhatsAppPanel'
import { getAnalytics, getLeads, getBookings, getConversations } from '../services/api'

const TABS = ['Overview', 'Leads', 'Bookings', 'Conversations']

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [leads, setLeads] = useState([])
  const [bookings, setBookings] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s, l, b, c] = await Promise.all([
        getAnalytics(), getLeads(), getBookings(), getConversations()
      ])
      setStats(s); setLeads(l); setBookings(b); setConversations(c)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchAll, 30000)
    return () => clearInterval(interval)
  }, [fetchAll])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-100)' }}>
      {/* Top Nav */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid var(--beige-dark)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        height: '64px',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontSize: '28px' }}>☕</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--brown)', fontWeight: '700' }}>
            LatteLune
          </span>
        </Link>
        <span style={{
          marginLeft: '12px', padding: '2px 10px', borderRadius: '20px',
          background: 'var(--beige)', color: 'var(--brown)', fontSize: '12px', fontWeight: '600',
        }}>Admin Dashboard</span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
            Last updated: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={fetchAll}
            style={{
              padding: '7px 16px', borderRadius: '8px',
              background: 'var(--beige)', color: 'var(--brown)',
              fontSize: '13px', fontWeight: '600',
              border: '1px solid var(--beige-dark)',
              cursor: 'pointer',
            }}
          >
            ↻ Refresh
          </button>
          <Link to="/" style={{
            padding: '7px 16px', borderRadius: '8px',
            background: 'var(--blue)', color: 'white',
            fontSize: '13px', fontWeight: '600',
            textDecoration: 'none',
          }}>
            View Site →
          </Link>
        </div>
      </nav>

      <div style={{ padding: '28px 32px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Page title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', color: 'var(--brown)', marginBottom: '4px' }}>
            Business Overview
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
            Real-time insights from Luna — your AI assistant
          </p>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: '28px' }}>
          <StatsBar stats={stats} loading={loading} />
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left Column — Tabs */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Tabs */}
            <div style={{
              display: 'flex', gap: '4px', marginBottom: '20px',
              background: 'white', padding: '4px', borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)', width: 'fit-content',
            }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 20px', borderRadius: '8px',
                    background: activeTab === tab
                      ? 'linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%)'
                      : 'transparent',
                    color: activeTab === tab ? 'white' : 'var(--gray-600)',
                    fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab === 'Leads' && `Leads (${leads.length})`}
                  {tab === 'Bookings' && `Bookings (${bookings.length})`}
                  {tab === 'Conversations' && `Chats (${conversations.length})`}
                  {tab === 'Overview' && 'Overview'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{
              background: 'white', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
            }}>
              {activeTab === 'Overview' && (
                <div style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px', color: 'var(--brown)', fontSize: '18px' }}>
                    Today's Bookings
                  </h3>
                  <BookingsTable
                    bookings={bookings.filter(b => b.date === new Date().toISOString().slice(0, 10))}
                    loading={loading}
                    onRefresh={fetchAll}
                  />
                  <h3 style={{ margin: '24px 0 16px', color: 'var(--brown)', fontSize: '18px' }}>
                    Recent Leads
                  </h3>
                  <LeadsTable leads={leads.slice(0, 5)} loading={loading} onRefresh={fetchAll} />
                </div>
              )}
              {activeTab === 'Leads' && (
                <div>
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--beige)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--brown)', fontSize: '16px' }}>All Leads</h3>
                    <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{leads.length} total</span>
                  </div>
                  <LeadsTable leads={leads} loading={loading} onRefresh={fetchAll} />
                </div>
              )}
              {activeTab === 'Bookings' && (
                <div>
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--beige)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--brown)', fontSize: '16px' }}>All Bookings</h3>
                    <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{bookings.length} total</span>
                  </div>
                  <BookingsTable bookings={bookings} loading={loading} onRefresh={fetchAll} />
                </div>
              )}
              {activeTab === 'Conversations' && (
                <div style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px', color: 'var(--brown)', fontSize: '16px' }}>
                    Conversation History
                  </h3>
                  <ConversationsPanel conversations={conversations} loading={loading} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column — WhatsApp Panel */}
          <div style={{ width: '420px', flexShrink: 0, height: '700px' }}>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ color: 'var(--brown)', fontSize: '16px' }}>📱 WhatsApp Simulator</h3>
            </div>
            <div style={{ height: '680px' }}>
              <WhatsAppPanel onLeadCreated={fetchAll} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
