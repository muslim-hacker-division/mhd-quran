export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-brand">
        <span className="footer-brand-name">MHD</span>
        <span className="footer-brand-sep">|</span>
        <span className="footer-brand-sub">Qur&apos;an Digital</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '12px 0' }}>
        <a 
          href="https://facebook.com/RuntimeIman" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          Facebook
        </a>
        <a 
          href="https://t.me/autoposting_quran" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          Telegram
        </a>
        <a 
          href="https://mastodon.social/@poster_pengingat" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          Mastodon
        </a>
      </div>

      <p className="footer-text">
        Data disediakan oleh equran.id — Semoga bermanfaat
      </p>
    </footer>
  );
}
