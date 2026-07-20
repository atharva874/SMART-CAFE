import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import './MenuManagement.css';

const MenuManagement = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('foods'); // 'foods' or 'categories'
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isVeg: true,
    isAvailable: true,
    preparationTime: 15
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [foodsRes, categoriesRes] = await Promise.all([
        axios.get('/api/foods/admin/all'),
        axios.get('/api/categories')
      ]);
      
      console.log('Categories fetched:', categoriesRes.data);
      
      setFoods(foodsRes.data.foods || []);
      setCategories(categoriesRes.data.categories || []);
      
      if (!categoriesRes.data.categories || categoriesRes.data.categories.length === 0) {
        toast.warning('No categories found. Please add categories first.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 500) {
        toast.error('Database connection error. Please ensure MongoDB is connected.');
      } else {
        toast.error('Failed to load menu data: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFood) {
        await axios.put(`/api/foods/${editingFood._id}`, formData);
        toast.success('Food item updated successfully');
      } else {
        await axios.post('/api/foods', formData);
        toast.success('Food item added successfully');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving food:', error);
      toast.error(error.response?.data?.message || 'Failed to save food item');
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      category: food.category._id,
      isVeg: food.isVeg,
      isAvailable: food.isAvailable,
      preparationTime: food.preparationTime
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) {
      return;
    }

    try {
      await axios.delete(`/api/foods/${id}`);
      toast.success('Food item deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Failed to delete food item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      isVeg: true,
      isAvailable: true,
      preparationTime: 15
    });
    setEditingFood(null);
    setShowModal(false);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: '',
      isActive: true
    });
    setEditingCategory(null);
    setShowCategoryModal(false);
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory._id}`, categoryFormData);
        toast.success('Category updated successfully');
      } else {
        await axios.post('/api/categories', categoryFormData);
        toast.success('Category added successfully');
      }
      
      resetCategoryForm();
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? All food items in this category will be affected.')) {
      return;
    }

    try {
      await axios.delete(`/api/categories/${id}`);
      toast.success('Category deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="loading-container">Loading menu...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      
      <div className="menu-management-container">
        <div className="menu-management-header">
          <div>
            <h1>Menu Management</h1>
            <p>Add, edit, and manage food items and categories</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {activeTab === 'categories' && (
              <button onClick={() => setShowCategoryModal(true)} className="add-food-btn">
                <Plus size={20} />
                Add Category
              </button>
            )}
            {activeTab === 'foods' && (
              <button onClick={() => setShowModal(true)} className="add-food-btn">
                <Plus size={20} />
                Add Food Item
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container" style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button 
            onClick={() => setActiveTab('foods')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'foods' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'foods' ? 'white' : '#64748b',
              border: 'none',
              borderBottom: activeTab === 'foods' ? '3px solid #8b5cf6' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            Food Items ({foods.length})
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'categories' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'categories' ? 'white' : '#64748b',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '3px solid #8b5cf6' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            Categories ({categories.length})
          </button>
        </div>

        {activeTab === 'foods' && (
          <>
            {/* Search */}
            <div className="search-bar-admin">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Food Items Grid */}
            <div className="food-items-grid">
              {filteredFoods.length === 0 ? (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#64748b'
                }}>
                  {foods.length === 0 ? 'No food items yet. Click "Add Food Item" to get started!' : 'No food items match your search.'}
                </div>
              ) : (
                filteredFoods.map(food => (
                  <div key={food._id} className="food-card-admin">
                    <div className="food-image-admin">
                      <img src={food.image || 'https://via.placeholder.com/300x200'} alt={food.name} />
                      {!food.isAvailable && (
                        <div className="unavailable-overlay">Unavailable</div>
                      )}
                    </div>
                    
                    <div className="food-card-body">
                      <div className="food-card-header-admin">
                        <h3>{food.name}</h3>
                        <span className="food-type-badge">
                          {food.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </span>
                      </div>
                      
                      <p className="food-category-admin">{food.category?.name}</p>
                      <p className="food-description-admin">{food.description}</p>
                      
                      <div className="food-card-footer-admin">
                        <span className="food-price-admin">₹{food.price}</span>
                        <div className="food-actions">
                          <button onClick={() => handleEdit(food)} className="edit-btn">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(food._id)} className="delete-btn">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'categories' && (
          <div className="categories-list" style={{ marginTop: '20px' }}>
            {categories.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#64748b',
                background: '#f8fafc',
                borderRadius: '8px'
              }}>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>No categories yet</p>
                <p>Click "Add Category" to create your first category</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {categories.map(category => (
                  <div key={category._id} style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1f2937' }}>
                        {category.name}
                        {!category.isActive && (
                          <span style={{ 
                            marginLeft: '10px', 
                            padding: '2px 8px', 
                            background: '#fee2e2', 
                            color: '#dc2626',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            Inactive
                          </span>
                        )}
                      </h3>
                      <p style={{ margin: 0, color: '#64748b' }}>{category.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEditCategory(category)} className="edit-btn">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteCategory(category._id)} className="delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</h2>
                <button onClick={resetForm} className="close-btn">×</button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-grid-two">
                  <div className="form-group">
                    <label>Food Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter food name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        {categories.length === 0 
                          ? 'No categories available - Please add categories first'
                          : 'Select category'
                        }
                      </option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <small style={{ color: '#f59e0b', display: 'block', marginTop: '5px' }}>
                        ⚠️ You need to create categories before adding food items
                      </small>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Preparation Time (minutes)</label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter food description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Image URL *</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isVeg"
                        checked={formData.isVeg}
                        onChange={handleInputChange}
                      />
                      Vegetarian
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleInputChange}
                      />
                      Available for Order
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={resetForm} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingFood ? 'Update Food Item' : 'Add Food Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {showCategoryModal && (
          <div className="modal-overlay" onClick={resetCategoryForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <button onClick={resetCategoryForm} className="close-btn">×</button>
              </div>

              <form onSubmit={handleCategorySubmit} className="modal-body">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={categoryFormData.name}
                    onChange={handleCategoryInputChange}
                    placeholder="e.g., Beverages, Main Course, Desserts"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={categoryFormData.description}
                    onChange={handleCategoryInputChange}
                    placeholder="Brief description of the category"
                    rows={3}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={categoryFormData.isActive}
                      onChange={handleCategoryInputChange}
                    />
                    Active (visible to customers)
                  </label>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={resetCategoryForm} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
