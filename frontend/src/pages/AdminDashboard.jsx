import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data);
      } else if (activeTab === 'transactions') {
        const response = await axios.get('/api/admin/transactions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTransactions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: t('admin.users'), icon: '👥' },
    { id: 'transactions', label: t('admin.transactions'), icon: '💰' },
    { id: 'settings', label: t('admin.settings'), icon: '⚙️' },
    { id: 'surveys', label: t('admin.surveys'), icon: '📋' },
  ];

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: '👥', color: 'text-blue-400' },
    { label: 'Revenue', value: '$12,450', change: '+8%', icon: '💵', color: 'text-green-400' },
    { label: 'Active Subscriptions', value: '456', change: '+5%', icon: '📊', color: 'text-purple-400' },
    { label: 'M-Pesa Transactions', value: '789', change: '+15%', icon: '📱', color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
            🛡️ {t('admin.title')}
          </h1>
          <p className="text-gray-400">Welcome back, {user?.displayName}</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Timezone Clocks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-4 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">🌍 Timezone Clocks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Nairobi', 'New York', 'London', 'Tokyo'].map((city) => (
              <div key={city} className="text-center">
                <p className="text-gray-400 text-sm">{city}</p>
                <p className="text-2xl font-bold text-white">
                  {new Date().toLocaleTimeString('en-US', { timeZone: getTimezone(city) })}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mb-6 overflow-x-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent-500 text-white'
                  : 'bg-primary-800/50 text-gray-300 hover:bg-primary-700/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <span className="animate-spin text-2xl">⚙️</span> Loading...
            </div>
          ) : (
            <>
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">User</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">Email</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">Plan</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">Status</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? users.map((u, idx) => (
                        <tr key={idx} className="border-t border-primary-400/20">
                          <td className="px-4 py-3 text-white">{u.displayName}</td>
                          <td className="px-4 py-3 text-gray-400">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-accent-500/20 text-accent-400 rounded text-sm">
                              {u.plan || 'Free'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-sm ${
                              u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {u.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-accent-400 hover:text-accent-300 text-sm">Edit</button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">ID</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">User</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">Amount</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">Method</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">Status</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-sm">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? transactions.map((tx, idx) => (
                        <tr key={idx} className="border-t border-primary-400/20">
                          <td className="px-4 py-3 text-gray-400 font-mono text-sm">{tx.id}</td>
                          <td className="px-4 py-3 text-white">{tx.user}</td>
                          <td className="px-4 py-3 text-accent-400 font-semibold">{tx.amount}</td>
                          <td className="px-4 py-3 text-gray-400">{tx.method}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-sm ${
                              tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                              tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm">{tx.date}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                            No transactions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">⚙️ Feature Toggles</h2>
                  <div className="space-y-4">
                    {['AI Q&A', 'Website Builder', 'M-Pesa Payments', 'Video Transcription'].map((feature) => (
                      <div key={feature} className="flex items-center justify-between p-4 bg-primary-800/30 rounded-lg">
                        <span className="text-white">{feature}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-6 mt-8">📢 Pop-up Messages</h2>
                  <textarea
                    className="input-field h-32"
                    placeholder="Enter announcement message..."
                  />
                  <button className="btn-primary mt-4">Send Announcement</button>
                </div>
              )}

              {activeTab === 'surveys' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">📋 Survey Management</h2>
                  <div className="space-y-4">
                    <div className="card p-4 bg-primary-800/30">
                      <h3 className="text-white font-medium mb-2">Daily Survey 1</h3>
                      <p className="text-gray-400 text-sm mb-4">5 sub-questions configured</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-primary-700/50 rounded text-sm hover:bg-primary-600/50">Edit</button>
                        <button className="px-4 py-2 bg-primary-700/50 rounded text-sm hover:bg-primary-600/50">Preview</button>
                      </div>
                    </div>
                    <div className="card p-4 bg-primary-800/30">
                      <h3 className="text-white font-medium mb-2">Daily Survey 2</h3>
                      <p className="text-gray-400 text-sm mb-4">5 sub-questions configured</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-primary-700/50 rounded text-sm hover:bg-primary-600/50">Edit</button>
                        <button className="px-4 py-2 bg-primary-700/50 rounded text-sm hover:bg-primary-600/50">Preview</button>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-4">
                    💰 B2C Payout: 5000 Ksh per survey completion
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

function getTimezone(city) {
  const timezones = {
    'Nairobi': 'Africa/Nairobi',
    'New York': 'America/New_York',
    'London': 'Europe/London',
    'Tokyo': 'Asia/Tokyo',
  };
  return timezones[city] || 'UTC';
}

export default AdminDashboard;