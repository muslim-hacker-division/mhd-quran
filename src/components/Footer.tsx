export function Footer() {
  const socials = [
    { name: 'Facebook', url: 'https://www.facebook.com/RuntimeIman/' },
    { name: 'Telegram', url: 'https://t.me/autoposting_quran' },
    { name: 'Mastodon', url: 'https://mastodon.social/@poster_pengingat' },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-brand">
        <span className="footer-brand-name">MHD</span>
        <span className="footer-brand-sep">|</span>
        <span className="footer-brand-sub">Qur&apos;an Digital</span>
      </div>

      <div className="footer-socials" aria-label="Media sosial">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="footer-social-link"
          >
            {social.name}
          </a>
        ))}
      </div>

      <p className="footer-text">
        Data disediakan oleh equran.id — Semoga bermanfaat
      </p>
    </footer>
  );
}
