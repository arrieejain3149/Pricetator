import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="nav-logo">
              🛍️ Pricetator
            </Link>
          </motion.div>

          <motion.div
            className={`nav-menu ${showMenu ? 'active' : ''}`}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Link to="/" className="nav-link">
                🔍 Search
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link to="/history" className="nav-link">
                📜 History
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link to="/profile" className="nav-link">
                👤 Profile
              </Link>
            </motion.div>
            <motion.button
              className="nav-logout"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚪 Logout
            </motion.button>
          </motion.div>

          <motion.button
            className="nav-toggle"
            onClick={() => setShowMenu(!showMenu)}
            whileTap={{ scale: 0.9 }}
          >
            ☰
          </motion.button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;