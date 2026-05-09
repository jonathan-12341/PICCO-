import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 border-t border-primary-400/30 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 100 100" className="w-8 h-8">
                <defs>
                  <linearGradient id="footerBatmanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#1a237e' }} />
                    <stop offset="100%" style={{ stopColor: '#2196f3' }} />
                  </linearGradient>
                </defs>
                <path fill="url(#footerBatmanGrad)" d="M50 10 C20 10 5 30 5 50 C5 55 8 60 15 65 L30 55 C35 53 38 48 38 42 C38 36 35 30 30 28 C35 35 42 38 50 38 C58 38 65 35 70 28 C65 30 62 36 62 42 C62 48 65 53 70 55 L85 65 C92 60 95 55 95 50 C95 30 80 10 50 10 Z M35 42 C35 44 37 46 40 46 C43 46 45 44 45 42 C45 40 43 38 40 38 C37 38 35 40 35 42 Z M55 42 C55 44 57 46 60 46 C63 46 65 44 65 42 C65 40 63 38 60 38 C57 38 55 40 55 42 Z" />
              </svg>
              <span className="text-xl font-display font-bold text-white">PICCO</span>
            </div>
            <p className="text-gray-400 text-sm">
              Educational AI Platform with SaaS Website Builder
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: splenderkimani@gmail.com</li>
              <li>Phone: 0723525608</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-400/30 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} PICCO COMPANIES. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;