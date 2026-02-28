import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Profile.css';

function Profile({ token, user }) {
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setProfile(data.user);
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profile.name }),
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        setEditing(false);
        alert('Profile updated!');
      }
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <div className="profile-container">
        <div className="loading">Loading...</div>
      </div>
    );

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="profile-header"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring' }}
          >
            <motion.img
              src={profile.picture}
              alt={profile.name}
              className="profile-pic"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            />
            <div className="profile-info">
              {editing ? (
                <motion.input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="profile-name-input"
                  autoFocus
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ) : (
                <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {profile.name}
                </motion.h1>
              )}
              <motion.p className="profile-email" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {profile.email}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="profile-stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="stat" whileHover={{ scale: 1.05 }}>
              <motion.div className="stat-value">
                {profile.total_searches || 0}
              </motion.div>
              <div className="stat-label">Total Searches</div>
            </motion.div>
            <motion.div className="stat" whileHover={{ scale: 1.05 }}>
              <div className="stat-value">📅</div>
              <div className="stat-label">Member since {new Date(profile.created_at).toLocaleDateString()}</div>
            </motion.div>
          </motion.div>

          <motion.div
            className="profile-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {editing ? (
              <>
                <motion.button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </>
            ) : (
              <motion.button
                className="btn btn-primary"
                onClick={() => setEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✏️ Edit Profile
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Profile;