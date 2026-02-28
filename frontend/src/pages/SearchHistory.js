import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchHistory.css';

function SearchHistory({ token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/search-history', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      console.error('Fetch history error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (searchId) => {
    try {
      await fetch(`http://localhost:5000/api/user/search-history/${searchId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setHistory(history.filter((h) => h.id !== searchId));
    } catch (error) {
      alert('Failed to delete search');
    }
  };

  const clearAll = async () => {
    if (window.confirm('Clear all search history?')) {
      try {
        await fetch('http://localhost:5000/api/user/search-history/clear', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setHistory([]);
      } catch (error) {
        alert('Failed to clear history');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="history-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div
          className="history-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>📜 Search History</h1>
          {history.length > 0 && (
            <motion.button
              className="btn btn-outline"
              onClick={clearAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Clear All
            </motion.button>
          )}
        </motion.div>

        {loading ? (
          <motion.div
            className="loading"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading...
          </motion.div>
        ) : history.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon">🔍</div>
            <h2>No searches yet</h2>
            <p>Start comparing prices to see your search history</p>
          </motion.div>
        ) : (
          <motion.div
            className="history-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {history.map((search) => (
                <motion.div
                  key={search.id}
                  className="history-item"
                  variants={itemVariants}
                  exit="exit"
                  whileHover={{ x: 5, boxShadow: 'var(--shadow-md)' }}
                >
                  <div className="history-content">
                    <h3 className="history-product">{search.product}</h3>
                    <p className="history-meta">
                      📅 {new Date(search.timestamp).toLocaleDateString()} • 🔍 Found {search.results_count} results
                    </p>
                  </div>
                  <motion.button
                    className="btn btn-small btn-secondary"
                    onClick={() => deleteSearch(search.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default SearchHistory;