import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ChatWidget from '../components/ChatWidget'

const MENU_ITEMS = [
  { name: 'Signature LatteLune Latte', price: '₹220', tag: 'Fan Favourite', emoji: '☕' },
  { name: 'Iced Matcha Latte', price: '₹250', tag: 'Bestseller', emoji: '🍵' },
  { name: 'Blue Butterfly Lemonade', price: '₹220', tag: 'Aesthetic', emoji: '💙' },
  { name: 'Waffle Stack', price: '₹320', tag: 'Must Try', emoji: '🧇' },
  { name: 'Avocado Toast', price: '₹280', tag: 'Healthy', emoji: '🥑' },
  { name: 'Lotus Biscoff Cheesecake', price: '₹260', tag: 'Dreamy', emoji: '🍰' },
]

const GALLERY = [
  { emoji: '☕', label: 'Artisan Coffee', bg: '#A8C8E8' },
  { emoji: '🧇', label: 'Waffle Stacks', bg: '#F9C74F' },
  { emoji: '🍰', label: 'Dreamy Cakes', bg: '#F5E6D3' },
  { emoji: '💙', label: 'Aesthetic Drinks', bg: '#5B8DB8' },
]

export default function Home() {
  const [activeNav, setActiveNav] = useState('home')

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveNav(id)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(253,250,246,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--beige-dark)',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', height: '68px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>☕</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--brown)', fontWeight: '700' }}>
            LatteLune
          </span>
        </div>

        <div style={{ marginLeft: '48px', display: 'flex', gap: '4px' }}>
          {[['home', 'Home'], ['menu', 'Menu'], ['about', 'About'], ['contact', 'Contact']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              padding: '7px 16px', borderRadius: '8px',
              background: 'transparent',
              color: activeNav === id ? 'var(--blue)' : 'var(--gray-600)',
              fontSize: '14px', fontWeight: activeNav === id ? '600' : '400',
              cursor: 'pointer', transition: 'all 0.2s',
              borderBottom: activeNav === id ? '2px solid var(--blue)' : '2px solid transparent',
            }}>{label}</button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => scrollTo('menu')}
            style={{
              padding: '8px 20px', borderRadius: '20px',
              background: 'var(--yellow)', color: 'var(--brown)',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              border: '2px solid var(--yellow-dark)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--yellow-dark)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--yellow)'}
          >
            Order Now
          </button>
          <Link to="/dashboard" style={{
            padding: '8px 16px', borderRadius: '20px',
            background: 'transparent', color: 'var(--gray-600)',
            fontSize: '13px', border: '1px solid var(--gray-200)',
            textDecoration: 'none',
          }}>Admin →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, var(--beige) 0%, var(--off-white) 50%, #EBF4FB 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '100px 40px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[
          { size: 400, top: '-100px', right: '-80px', color: 'rgba(91,141,184,0.08)' },
          { size: 250, bottom: '40px', left: '10%', color: 'rgba(249,199,79,0.12)' },
          { size: 150, top: '30%', right: '30%', color: 'rgba(107,66,38,0.05)' },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.size, height: c.size, borderRadius: '50%',
            background: c.color, top: c.top, bottom: c.bottom, left: c.left, right: c.right,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--yellow)', color: 'var(--brown)',
            padding: '6px 16px', borderRadius: '20px',
            fontSize: '13px', fontWeight: '600', marginBottom: '24px',
            border: '1.5px solid var(--yellow-dark)',
          }}>
            <span>✨</span> Now open in Indiranagar, Bengaluru
          </div>

          <h1 style={{
            fontSize: '58px', lineHeight: '1.15',
            color: 'var(--brown)', marginBottom: '20px',
            fontFamily: 'var(--font-display)',
          }}>
            Where every sip<br />
            <span style={{ color: 'var(--blue)' }}>feels like moonlight</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'var(--gray-600)', lineHeight: '1.7',
            marginBottom: '36px', maxWidth: '480px',
          }}>
            A cozy aesthetic café in the heart of Bengaluru.
            Artisan coffee, dreamy interiors, and baked goods that'll make your day ☁️
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                // trigger chat widget
                document.querySelector('[aria-label="Open chat"]')?.click()
              }}
              style={{
                padding: '14px 32px', borderRadius: '28px',
                background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%)',
                color: 'white', fontSize: '16px', fontWeight: '600',
                boxShadow: '0 4px 20px rgba(91,141,184,0.35)',
                cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                border: 'none',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(91,141,184,0.45)' }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(91,141,184,0.35)' }}
            >
              ☕ Reserve a Table
            </button>
            <button
              onClick={() => scrollTo('menu')}
              style={{
                padding: '14px 32px', borderRadius: '28px',
                background: 'white', color: 'var(--brown)',
                fontSize: '16px', fontWeight: '600',
                border: '2px solid var(--beige-dark)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--brown)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--beige-dark)'}
            >
              View Menu
            </button>
          </div>

          {/* Hours badge */}
          <div style={{
            marginTop: '40px', display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: 'var(--gray-600)', fontSize: '14px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            Open today · 8:00 AM – 10:00 PM
            <span style={{ margin: '0 6px', color: 'var(--gray-200)' }}>|</span>
            📍 Indiranagar, Bengaluru
          </div>
        </div>

        {/* Hero visual */}
        <div style={{
          position: 'absolute', right: '5%', top: '50%',
          transform: 'translateY(-50%)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
        }}>
          {GALLERY.map((g, i) => (
            <div key={i} style={{
              width: '160px', height: '160px',
              borderRadius: '20px',
              background: g.bg,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px',
              transform: i % 2 === 0 ? 'translateY(0)' : 'translateY(20px)',
              boxShadow: 'var(--shadow-md)',
              animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
            }}>
              <span style={{ fontSize: '48px' }}>{g.emoji}</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{g.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section style={{
        background: 'var(--blue-dark)', color: 'white',
        padding: '20px 40px',
        display: 'flex', justifyContent: 'center', gap: '48px',
        flexWrap: 'wrap',
      }}>
        {[
          ['🌐', 'Free WiFi'],
          ['🐾', 'Pet Friendly'],
          ['🎵', 'Live Music Weekends'],
          ['🎂', 'Private Events'],
          ['🏷️', 'LunaStars Loyalty'],
        ].map(([icon, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
            <span style={{ fontSize: '18px' }}>{icon}</span> {label}
          </div>
        ))}
      </section>

      {/* Menu Section */}
      <section id="menu" style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--blue)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Our Menu
          </div>
          <h2 style={{ fontSize: '40px', color: 'var(--brown)' }}>Crafted with love ☕</h2>
          <p style={{ color: 'var(--gray-600)', marginTop: '12px', fontSize: '16px' }}>
            Every item is made fresh daily — no compromises, no shortcuts.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {MENU_ITEMS.map((item) => (
            <div key={item.name} style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--beige)',
              transition: 'all 0.25s',
              cursor: 'default',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{item.emoji}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--brown)', fontFamily: 'var(--font-display)' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--blue)', flexShrink: 0 }}>
                  {item.price}
                </div>
              </div>
              <span style={{
                display: 'inline-block', marginTop: '10px',
                padding: '3px 10px', borderRadius: '20px',
                background: 'var(--beige)', color: 'var(--brown)',
                fontSize: '11px', fontWeight: '600',
              }}>{item.tag}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button
            onClick={() => document.querySelector('[aria-label="Open chat"]')?.click()}
            style={{
              padding: '12px 28px', borderRadius: '24px',
              background: 'var(--beige)', color: 'var(--brown)',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              border: '2px solid var(--beige-dark)',
            }}
          >
            ☕ Ask Luna about the full menu
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        background: 'linear-gradient(135deg, var(--brown) 0%, #8B5E3C 100%)',
        padding: '80px 40px', color: 'white', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '40px', color: 'white', marginBottom: '16px' }}>
          Our Story 🌙
        </h2>
        <p style={{ fontSize: '17px', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 32px', opacity: 0.9 }}>
          LatteLune was born from a simple dream — to create a space where people could slow down,
          sip something beautiful, and feel at home. Every corner of our café tells a story,
          and every cup is poured with intention.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', marginTop: '40px' }}>
          {[['500+', 'Happy regulars'], ['3', 'Signature blends'], ['8am', 'Open daily'], ['🏆', 'Best café award 2024']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--yellow)' }}>{num}</div>
              <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '80px 40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '40px', color: 'var(--brown)', marginBottom: '16px' }}>
          Find Us ☕
        </h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '40px', fontSize: '16px' }}>
          Come say hello, or chat with Luna to book a table!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { icon: '📍', title: 'Address', detail: '12th Main Rd, Indiranagar\nBengaluru 560008' },
            { icon: '⏰', title: 'Hours', detail: 'Mon–Fri: 8am–10pm\nSat–Sun: 9am–11pm' },
            { icon: '📞', title: 'Phone', detail: '+91 98765 43210' },
            { icon: '📧', title: 'Email', detail: 'hello@lattelune.in' },
          ].map(card => (
            <div key={card.title} style={{
              background: 'white', borderRadius: 'var(--radius-md)',
              padding: '28px 32px', minWidth: '180px',
              boxShadow: 'var(--shadow-sm)', border: '1px solid var(--beige)',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{card.icon}</div>
              <div style={{ fontWeight: '700', color: 'var(--brown)', marginBottom: '6px', fontSize: '15px' }}>{card.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-600)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{card.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--brown)', color: 'rgba(255,255,255,0.7)',
        padding: '28px 40px', textAlign: 'center', fontSize: '13px',
      }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'white' }}>LatteLune ☕🌙</span>
        </div>
        © 2025 LatteLune. Made with love in Bengaluru.
        <span style={{ margin: '0 12px', opacity: 0.4 }}>|</span>
        <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Admin Dashboard</Link>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
