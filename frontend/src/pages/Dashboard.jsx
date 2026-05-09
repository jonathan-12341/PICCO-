import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIChatPanel from '../components/AIChatPanel';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();

  const quickActions = [
    { icon: '🤖', label: t('aiPanel.title'), path: '#ai-panel', color: 'from-purple-500 to-pink-500' },
    { icon: '🌐', label: t('nav.websiteBuilder'), path: '/website-builder', color: 'from-blue-500 to-cyan-500' },
    { icon: '💳', label: t('pricing.title'), path: '#pricing', color: 'from-green-500 to-emerald-500' },
    { icon: '📊', label: t('admin.transactions'), path: '/admin', color: 'from-orange-500 to-amber-500', adminOnly: true },
  ];

  const recentActivity = [
    { type: 'login', message: 'Welcome back!', time: 'Just now' },
    { type: 'ai_query', message: 'AI Query processed', time: '2 mins ago' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            {t('dashboard.welcome')}, {user?.displayName?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-400">Ready to learn something new today?</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Questions Asked</p>
                <p className="text-3xl font-bold text-white">24</p>
              </div>
              <div className="text-4xl">🤖</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Documents Analyzed</p>
                <p className="text-3xl font-bold text-white">12</p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Subscription Status</p>
                <p className="text-3xl font-bold text-accent-400">PRO</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Panel - Takes up 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
            id="ai-panel"
          >
            <AIChatPanel />
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('dashboard.quickActions')}
              </h2>
              <div className="space-y-3">
                {quickActions.filter(a => !a.adminOnly || isAdmin).map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.path.startsWith('#') ? '#' : action.path}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r hover:opacity-80 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${action.color.split(' ')[1]}, ${action.color.split(' ')[3]})` }}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-white font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('dashboard.recentActivity')}
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-primary-400/20 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
                      <span className="text-gray-300">{activity.message}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Subscription Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="card p-6 border-accent-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⭐</span>
                <div>
                  <h3 className="text-white font-semibold">PRO Plan</h3>
                  <p className="text-gray-400 text-sm">$10/week</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Next billing</span>
                  <span className="text-gray-300">6 days</span>
                </div>
              </div>
              <button className="w-full mt-4 text-sm text-accent-400 hover:text-accent-300 transition-colors">
                Manage Subscription →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;