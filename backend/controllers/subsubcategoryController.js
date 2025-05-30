const Subsubcategory = require('../models/Subsubcategory');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const Product = require('../models/Product')

// Get all subsubcategories
exports.getAllSubsubcategories = async (req, res) => {
  try {
    const subsubcategories = await Subsubcategory.find();
    res.json(subsubcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get subsubcategories by subcategory ID
exports.getSubsubcategoriesBySubcategory = async (req, res) => {
  try {

    const { subcategoryId } = req.params;

    // 1. Get subsubcategories for the given subcategory
    const subsubcategories = await Subsubcategory.find({ subcategory_id: subcategoryId })
      .populate('category_id', 'category_name');

    // 2. Get products that are under the current subcategory
    //    but not nested under any subsubcategory
    const productsAtSubCategoryLevel = await Product.find({
      subcategory_id: subcategoryId,
      $or: [
        { subsubcategory_id: null },
        { subsubcategory_id: { $exists: false } }
      ]
    });
    
    res.json({
      subsubcategories,
      products: productsAtSubCategoryLevel
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single subsubcategory by ID
exports.getSubsubcategoryById = async (req, res) => {
  try {
    const subsubcategory = await Subsubcategory.findById(req.params.id)
      .populate('category_id', 'category_name')
      .populate('subcategory_id', 'subcategory_name');
    if (!subsubcategory) {
      return res.status(404).json({ message: 'Subsubcategory not found' });
    }
    res.json(subsubcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new subsubcategory
exports.createSubsubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category_id);
    const subcategory = await Subcategory.findById(req.body.subcategory_id);

    if (!category || !subcategory) {
      return res.status(404).json({ message: 'Category or Subcategory not found' });
    }

    const subsubcategory = new Subsubcategory({
      subsubcategory_name: req.body.subsubcategory_name,
      category_id: req.body.category_id,
      category_name: category.category_name,
      subcategory_id: req.body.subcategory_id,
      subcategory_name: subcategory.subcategory_name,
      subsubcategory_image_url: req.body.image_url
    });

    const newSubsubcategory = await subsubcategory.save();
    res.status(201).json(newSubsubcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update subsubcategory
exports.updateSubsubcategory = async (req, res) => {
  try {
    const updatedSubsubcategory = await Subsubcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSubsubcategory) {
      return res.status(404).json({ message: 'Subsubcategory not found' });
    }
    res.json(updatedSubsubcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete subsubcategory
exports.deleteSubsubcategory = async (req, res) => {
  try {
    const subsubcategory = await Subsubcategory.findByIdAndDelete(req.params.id);
    if (!subsubcategory) {
      return res.status(404).json({ message: 'Subsubcategory not found' });
    }
    res.json({ message: 'Subsubcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};