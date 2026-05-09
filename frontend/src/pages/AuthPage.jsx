import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';

const AuthPage = () => {
  const { t } = useTranslation();
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'Only Gmail accounts are allowed') {
        setError('Only Gmail accounts are allowed. Please use your @gmail.com email.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
                className="inline-block"
              >
                <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto batman-logo">
                  <defs>
                    <linearGradient id="authBatmanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#1a237e' }} />
                      <stop offset="50%" style={{ stopColor: '#3949ab' }} />
                      <stop offset="100%" style={{ stopColor: '#2196f3' }} />
                    </linearGradient>
                  </defs>
                  <path 
                    fill="url(#authBatmanGrad)" 
                    d="M50 10 C20 10 5 30 5 50 C5 55 8 60 15 65 L30 55 C35 53 38 48 38 42 C38 36 35 30 30 28 C35 35 42 38 50 38 C58 38 65 35 70 28 C65 30 62 36 62 42 C62 48 65 53 70 55 L85 65 C92 60 95 55 95 50 C95 30 80 10 50 10 Z M35 42 C35 44 37 46 40 46 C43 46 45 44 45 42 C45 40 43 38 40 38 C37 38 35 40 35 42 Z M55 42 C55 44 57 46 60 46 C63 46 65 44 65 42 C65 40 63 38 60 38 C57 38 55 40 55 42 Z" 
                  />
                </svg>
              </motion.div>
              <h1 className="text-3xl font-display font-bold text-white mt-4">PICCO</h1>
              <p className="text-gray-400 mt-2">{t('auth.signIn')}</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-spin">⚙️</span>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? 'Signing in...' : t('auth.signInWithGoogle')}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-400/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">{t('auth.orContinueWith')}</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-primary-800/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">
                Only <span className="text-accent-400 font-semibold">@gmail.com</span> accounts are allowed for sign in.
              </p>
            </div>

            {/* Language Selector */}
            <div className="mt-6 flex justify-center">
              <LanguageSelector />
            </div>
          </motion.div>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;