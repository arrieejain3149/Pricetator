import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TrendingProducts.css';

function TrendingProducts() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/trending')
      .then((res) => res.json())
      .then((data) => setTrending(data.trending))
      .catch((err) => console.error('Failed to fetch trending:', err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      className="trending-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="container">
        <motion.h2
          className="trending-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🔥 Trending Searches
        </motion.h2>
        <motion.div
          className="trending-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {trending.map((item, index) => (
            <motion.div
              key={index}
              className="trending-card"
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="trend-rank"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
              >
                #{index + 1}
              </motion.div>
              <h3 className="trend-name">{item.name}</h3>
              <p className="trend-searches">
                <span className="search-icon">🔍</span>
                {item.searches.toLocaleString()} searches
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default TrendingProducts;