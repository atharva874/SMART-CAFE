import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Search, ChevronRight, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, foodsRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/foods')
      ]);

      setCategories(categoriesRes.data.categories);
      setFoods(foodsRes.data.foods.slice(0, 8)); // Show first 8 items
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    navigate(`/menu?search=${searchQuery}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Premium Cafe</h1>
          <p>Delicious food delivered to your doorstep</p>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for your favorite food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-button">
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <div
                key={category._id}
                className="category-card"
                onClick={() => handleCategoryClick(category._id)}
              >
                <div className="category-icon">🍽️</div>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Items</h2>
            <button onClick={() => navigate('/menu')} className="view-all-btn">
              View All <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="food-grid">
            {foods.map(food => (
              <div key={food._id} className="food-card">
                <div className="food-image">
                  <img src={food.image || 'https://via.placeholder.com/300x200?text=Food'} alt={food.name} />
                  {!food.isAvailable && <div className="unavailable-badge">Unavailable</div>}
                </div>
                <div className="food-info">
                  <div className="food-header">
                    <h3>{food.name}</h3>
                    <div className="food-badge">{food.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</div>
                  </div>
                  <p className="food-description">{food.description}</p>
                  <div className="food-footer">
                    <span className="food-price">₹{food.price}</span>
                    <button
                      onClick={() => addToCart(food)}
                      disabled={!food.isAvailable}
                      className="add-to-cart-btn"
                    >
                      {food.isAvailable ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
