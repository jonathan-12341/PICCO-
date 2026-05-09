import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/dashboard', label: t('nav.dashboard'), requiresAuth: true },
    { path: '/website-builder', label: t('nav.websiteBuilder'), requiresAuth: true },
  ];

  const adminItems = isAdmin ? [
    { path: '/admin', label: t('nav.admin') },
  ] : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-900/80 backdrop-blur-lg border-b border-primary-400/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="batman-logo">
              <svg viewBox="0 0 100 100" className="w-10 h-10">
                <defs>
                  <linearGradient id="batmanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#1a237e' }} />
                    <stop offset="100%" style={{ stopColor: '#2196f3' }} />
                  </linearGradient>
                </defs>
                <path fill="url(#batmanGrad)" d="M50 10 C20 10 5 30 5 50 C5 55 8 60 15 65 L30 55 C35 53 38 48 38 42 C38 36 35 30 30 28 C35 35 42 38 50 38 C58 38 65 35 70 28 C65 30 62 36 62 42 C62 48 65 53 70 55 L85 65 C92 60 95 55 95 50 C95 30 80 10 50 10 Z M35 42 C35 44 37 46 40 46 C43 46 45 44 45 42 C45 40 43 38 40 38 C37 38 35 40 35 42 Z M55 42 C55 44 57 46 60 46 C63 46 65 44 65 42 C65 40 63 38 60 38 C57 38 55 40 55 42 Z" />
              </svg>
            </div>
            <span className="text-2xl font-display font-bold text-white">PICCO</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              (!item.requiresAuth || user) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-accent-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-accent-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-300 hidden sm:block">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="text-sm px-4 py-2 bg-primary-700 hover:bg-primary-800 rounded-lg transition-colors"
                >
                  {t('auth.signOut')}
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary text-sm px-4 py-2"
              >
                {t('auth.signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;