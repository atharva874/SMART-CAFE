const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all available foods
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isAvailable: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const foods = await Food.find(query).populate('category').sort({ name: 1 });
    res.json({ foods });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all foods (Admin - including unavailable)
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const foods = await Food.find().populate('category').sort({ createdAt: -1 });
    res.json({ foods });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('category');
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ food });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create food item (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, image, category, isVeg, preparationTime } = req.body;
    
    const food = new Food({
      name,
      description,
      price,
      image,
      category,
      isVeg,
      preparationTime
    });
    
    await food.save();
    await food.populate('category');
    
    res.status(201).json({ message: 'Food item created successfully', food });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update food item (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, image, category, isAvailable, isVeg, preparationTime } = req.body;
    
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category, isAvailable, isVeg, preparationTime },
      { new: true }
    ).populate('category');
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    res.json({ message: 'Food item updated successfully', food });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food item (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
