const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all active categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = new Category({ name, description, image });
    await category.save();
    
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image, isActive },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
