import React from 'react';
import { motion } from 'framer-motion';
import './PriceComparison.css';

function PriceComparison({ data }) {
  const { product, best_price, results } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  // Function to handle link click
  const handleViewClick = (link) => {
    if (link && link !== '#') {
      window.open(link, '_blank');
    }
  };

  return (
    <motion.section
      className="comparison-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div
          className="comparison-header"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2>
            Price Comparison for{' '}
            <span className="product-name">"{product}"</span>
          </h2>
          {best_price && (
            <motion.div
              className="best-price-badge"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="badge-label">🏆 Best Price</span>
              <span className="badge-value">₹{best_price.toLocaleString()}</span>
            </motion.div>
          )}
        </motion.div>

        {results && results.length > 0 ? (
          <motion.div
            className="results-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {results.map((item, index) => (
              <motion.div
                key={index}
                className="price-card"
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
              >
                <div className="card-header">
                  <h3 className="platform-name">{item.platform}</h3>
                  {item.savings && item.savings > 0 && (
                    <motion.span
                      className="savings-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      Save ₹{item.savings.toLocaleString()}
                    </motion.span>
                  )}
                </div>

                <motion.div className="price-display" whileHover={{ scale: 1.05 }}>
                  <span className="price">₹{item.original.toLocaleString()}</span>
                </motion.div>

                <motion.button
                  onClick={() => handleViewClick(item.link)}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  View on {item.platform} →
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>❌ No prices found for this product. Try another search!</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

export default PriceComparison;