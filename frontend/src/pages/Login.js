import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import './Login.css';

function Login({ onLogin }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user, data.token);
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  const handleGoogleError = () => {
    alert('Login failed');
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="login-header" variants={itemVariants}>
          <motion.div
            className="login-logo"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🛍️
          </motion.div>
          <motion.h1 variants={itemVariants}>Pricetator</motion.h1>
          <motion.p className="login-subtitle" variants={itemVariants}>
            Compare prices across all platforms instantly
          </motion.p>
        </motion.div>

        <motion.div className="login-content" variants={itemVariants}>
          <h2>Welcome Back! 👋</h2>
          <p>Sign in with your Google account to get started</p>

          <motion.div
            className="google-login-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="large"
              text="signin_with"
            />
          </motion.div>

          <motion.div className="login-benefits" variants={itemVariants}>
            <h3>Why sign in?</h3>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                'Save your search history',
                'Track price drops',
                'Compare products easily',
                'Personalized recommendations',
              ].map((benefit, i) => (
                <motion.li key={i} variants={itemVariants}>
                  ✅ {benefit}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        <motion.div className="login-footer" variants={itemVariants}>
          <p>Your privacy is important to us. We never share your data.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;