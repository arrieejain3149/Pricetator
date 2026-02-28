import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PriceComparison from '../components/PriceComparison';
import TrendingProducts from '../components/TrendingProducts';
import './Home.css';

function Home({ token, user }) {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (productName) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_name: productName }),
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />
      <SearchBar onSearch={handleSearch} loading={loading} />
      {searchResults && <PriceComparison data={searchResults} />}
      {!searchResults && <TrendingProducts />}
    </motion.div>
  );
}

export default Home;