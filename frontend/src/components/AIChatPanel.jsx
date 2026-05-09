import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';

const AIChatPanel = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('explain');

  const modes = [
    { id: 'summarize', label: t('aiPanel.summarize') },
    { id: 'writeBriefly', label: t('aiPanel.writeBriefly') },
    { id: 'explain', label: t('aiPanel.explainDetail') },
    { id: 'examples', label: t('aiPanel.useExamples') },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/ai/query', {
        message: input,
        mode: mode,
        userId: localStorage.getItem('userId'),
      });

      const aiMessage = { role: 'assistant', content: response.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-primary-400/30">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <span className="robot-animation">🤖</span>
          {t('aiPanel.title')}
        </h2>
        
        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2 mt-3">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                mode === m.id
                  ? 'bg-accent-500 text-white'
                  : 'bg-primary-700/50 text-gray-300 hover:bg-primary-600/50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <div className="robot-animation text-4xl mb-4">🤖</div>
            <p>Ask PICCO anything about your documents, images, or videos!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`chat-bubble flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-accent-600 text-white'
                  : 'bg-primary-700/50 text-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-primary-700/50 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary-400/30">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('aiPanel.placeholder')}
            className="input-field flex-1 resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn-primary px-6"
          >
            {t('aiPanel.send')}
          </button>
        </div>
        
        {/* File Upload Buttons */}
        <div className="flex gap-2 mt-3">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" />
            <span className="flex items-center gap-1 px-3 py-1 bg-primary-700/50 rounded text-sm hover:bg-primary-600/50 transition-colors">
              📷 Image
            </span>
          </label>
          <label className="cursor-pointer">
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
            <span className="flex items-center gap-1 px-3 py-1 bg-primary-700/50 rounded text-sm hover:bg-primary-600/50 transition-colors">
              📄 Document
            </span>
          </label>
          <label className="cursor-pointer">
            <input type="file" accept="video/*" className="hidden" />
            <span className="flex items-center gap-1 px-3 py-1 bg-primary-700/50 rounded text-sm hover:bg-primary-600/50 transition-colors">
              🎥 Video
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;