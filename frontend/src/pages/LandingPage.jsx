import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PricingCard from '../components/PricingCard';
import LanguageSelector from '../components/LanguageSelector';

const LandingPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: '🤖',
      title: t('landing.features.aiqa.title'),
      description: t('landing.features.aiqa.description'),
    },
    {
      icon: '🌐',
      title: t('landing.features.websiteBuilder.title'),
      description: t('landing.features.websiteBuilder.description'),
    },
    {
      icon: '💳',
      title: t('landing.features.payments.title'),
      description: t('landing.features.payments.description'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo Animation */}
            <div className="mb-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="inline-block"
              >
                <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto batman-logo">
                  <defs>
                    <linearGradient id="heroBatmanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#1a237e' }} />
                      <stop offset="50%" style={{ stopColor: '#3949ab' }} />
                      <stop offset="100%" style={{ stopColor: '#2196f3' }} />
                    </linearGradient>
                  </defs>
                  <path 
                    fill="url(#heroBatmanGrad)" 
                    d="M50 10 C20 10 5 30 5 50 C5 55 8 60 15 65 L30 55 C35 53 38 48 38 42 C38 36 35 30 30 28 C35 35 42 38 50 38 C58 38 65 35 70 28 C65 30 62 36 62 42 C62 48 65 53 70 55 L85 65 C92 60 95 55 95 50 C95 30 80 10 50 10 Z M35 42 C35 44 37 46 40 46 C43 46 45 44 45 42 C45 40 43 38 40 38 C37 38 35 40 35 42 Z M55 42 C55 44 57 46 60 46 C63 46 65 44 65 42 C65 40 63 38 60 38 C57 38 55 40 55 42 Z" 
                  />
                </svg>
              </motion.div>
            </div>

            {/* Robot Assistant */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🤖
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-accent-300 mb-6">
              {t('landing.hero.subtitle')}
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              {t('landing.hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="btn-primary text-lg px-8 py-4">
                {t('landing.cta.getStarted')}
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                {t('landing.cta.learnMore')}
              </a>
            </div>

            {/* Language Selector */}
            <div className="mt-8 flex justify-center">
              <LanguageSelector />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-primary-900/50">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-center text-white mb-12"
          >
            {t('landing.features.title')}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="card p-6 text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-display font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-center text-white mb-12"
          >
            {t('pricing.title')}
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard tier="pro" />
            <PricingCard tier="plus" isPopular />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-primary-400/30">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} PICCO COMPANIES. All rights reserved.</p>
          <p className="mt-2">Contact: splenderkimani@gmail.com | 0723525608</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;