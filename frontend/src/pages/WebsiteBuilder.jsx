import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';

const WebsiteBuilder = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Website</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #1a237e, #0d47a1);
      color: white;
      min-height: 100vh;
    }
    h1 { color: #2196f3; }
    .btn {
      background: #2196f3;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Welcome to PICCO</h1>
  <p>Start building your dream website!</p>
  <button class="btn">Get Started</button>
</body>
</html>`);
  const [preview, setPreview] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null);

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const response = await axios.post('/api/deploy', {
        code,
        userId: localStorage.getItem('userId'),
      });
      setDeployStatus({ success: true, url: response.data.url });
    } catch (error) {
      setDeployStatus({ success: false, message: 'Deployment failed. Please try again.' });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            🌐 {t('nav.websiteBuilder')}
          </h1>
          <p className="text-gray-400">Build, preview, and deploy your website with one click.</p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card p-4 mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex gap-2">
            <button
              onClick={() => setPreview(true)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                preview ? 'bg-accent-500 text-white' : 'bg-primary-700/50 text-gray-300 hover:bg-primary-600/50'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setPreview(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !preview ? 'bg-accent-500 text-white' : 'bg-primary-700/50 text-gray-300 hover:bg-primary-600/50'
              }`}
            >
              Code
            </button>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary-700/50 text-gray-300 rounded-lg hover:bg-primary-600/50 transition-colors">
              📁 Save
            </button>
            <button className="px-4 py-2 bg-primary-700/50 text-gray-300 rounded-lg hover:bg-primary-600/50 transition-colors">
              📂 GitHub
            </button>
            <button
              onClick={handleDeploy}
              disabled={deploying}
              className="btn-primary flex items-center gap-2"
            >
              {deploying ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Deploying...
                </>
              ) : (
                <>
                  🚀 Deploy
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Deploy Status */}
        {deployStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card p-4 mb-6 ${
              deployStatus.success ? 'border-green-500/50' : 'border-red-500/50'
            }`}
          >
            {deployStatus.success ? (
              <div>
                <p className="text-green-400 font-semibold">✅ Deployment Successful!</p>
                <a href={deployStatus.url} target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline">
                  {deployStatus.url}
                </a>
              </div>
            ) : (
              <p className="text-red-400 font-semibold">❌ {deployStatus.message}</p>
            )}
          </motion.div>
        )}

        {/* Editor/Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Code Editor */}
          <div className="card overflow-hidden">
            <div className="bg-primary-800/50 px-4 py-2 border-b border-primary-400/30">
              <span className="text-gray-400 text-sm">HTML Editor</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[500px] bg-primary-900/50 text-gray-200 p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div className="card overflow-hidden">
            <div className="bg-primary-800/50 px-4 py-2 border-b border-primary-400/30 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Preview</span>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-white text-sm">🖥️ Desktop</button>
                <button className="text-gray-400 hover:text-white text-sm">📱 Mobile</button>
              </div>
            </div>
            <div className="bg-white h-[500px] overflow-auto">
              <iframe
                srcDoc={code}
                title="Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </motion.div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <div className="card p-6 text-center">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="text-white font-semibold mb-2">GitHub Integration</h3>
            <p className="text-gray-400 text-sm">Connect your repositories and sync your code automatically.</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-white font-semibold mb-2">Netlify Deploy</h3>
            <p className="text-gray-400 text-sm">One-click deployment to global CDN with automatic SSL.</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-white font-semibold mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm">Track visitors, performance, and engagement metrics.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;