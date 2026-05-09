import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const PricingCard = ({ tier, isPopular = false }) => {
  const { t } = useTranslation();
  
  const features = t(`pricing.${tier}.features`, { returnObjects: true });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card p-6 relative ${
        isPopular ? 'border-accent-500 ring-2 ring-accent-500/20' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            POPULAR
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display font-bold text-white mb-2">
          {t(`pricing.${tier}.name`)}
        </h3>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-accent-400">
            {t(`pricing.${tier}.priceWeekly`)}
          </p>
          <p className="text-gray-400 text-sm">
            or {t(`pricing.${tier}.priceMonthly`)}
          </p>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-gray-300">
            <svg className="w-5 h-5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full ${isPopular ? 'btn-primary' : 'btn-secondary'}`}>
        {t('pricing.subscribe')}
      </button>
    </motion.div>
  );
};

export default PricingCard;