import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Search, Filter } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Menu.css';

const Menu = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foods, selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      const [categoriesRes, foodsRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/foods')
      ]);

      setCategories(categoriesRes.data.categories);
      setFoods(foodsRes.data.foods);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFoods = () => {
    let filtered = [...foods];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(food => food.category._id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFoods(filtered);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">Loading menu...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="menu-container">
        <div className="menu-header">
          <h1>Our Menu</h1>
          <p>Explore our delicious offerings</p>
        </div>

        <div className="menu-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <Filter size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="menu-content">
          {filteredFoods.length === 0 ? (
            <div className="no-results">
              <p>No items found</p>
            </div>
          ) : (
            <div className="food-grid">
              {filteredFoods.map(food => (
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
                    <p className="food-category">{food.category.name}</p>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
