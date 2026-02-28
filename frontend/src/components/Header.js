import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';

function Header() {
  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div className="header-content">
          <motion.div
            className="logo"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="logo-icon">🛍️</span>
            <h1>Pricetator</h1>
          </motion.div>
          <p className="tagline">Compare prices across all platforms instantly</p>
        </motion.div>
      </div>
    </motion.header>
  );
}

export default Header;