import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SearchBar.css';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.section
      className="search-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <form className="search-form" onSubmit={handleSubmit}>
          <motion.div
            className="search-input-wrapper"
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="text"
              placeholder="Search products... e.g., iPhone 15, Samsung Galaxy"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="search-input"
            />
            <motion.button
              type="submit"
              className="search-button"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? '⏳ Searching...' : '🔍 Search'}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.section>
  );
}

export default SearchBar;