const { Category } = require('../models/Training');

const CategoryController = {
  createCategory: (req, res) => {
    const category = req.body;
    Category.create(category, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating category' });
      }
      res.status(201).json({ message: 'Category created successfully' });
    });
  },

  getAllCategories: (req, res) => {
    Category.getAll((err, categories) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching categories' });
      }
      res.status(200).json(categories);
    });
  },

  getCategoryById: (req, res) => {
    const { id } = req.params;
    Category.getById(id, (err, category) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching category' });
      }
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json(category);
    });
  },

  updateCategory: (req, res) => {
    const { id } = req.params;
    const updatedCategory = req.body;
    Category.update(id, updatedCategory, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating category' });
      }
      res.status(200).json({ message: 'Category updated successfully' });
    });
  },

  deleteCategory: (req, res) => {
    const { id } = req.params;
    Category.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting category' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    });
  }
};

module.exports = CategoryController;