const Category = require('../models/Category');
const Subsubcategory = require('../models/Subsubcategory');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const GridFSController = require('./gridfsController');
const gridfs = new GridFSController();

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('category_name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories names and IDs with subcategories and subsubcategories
exports.getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    // Get all top-level categories
    const categories = await Category.find().sort('category_name');
    
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        // Get all subcategories for this category
        const subcategories = await Subcategory.find({ category_id: category._id }).sort('subcategory_name');
        
        const subcategoriesWithSubsubcategories = await Promise.all(
          subcategories.map(async (subcategory) => {
            // Get all subsubcategories for this subcategory
            const subsubcategories = await Subsubcategory.find({ 
              subcategory_id: subcategory._id // Only need subcategory_id here
            }).sort('subsubcategory_name');
            
            return {
              _id: subcategory._id,
              subcategory_name: subcategory.subcategory_name,
              subcategory_url: subcategory.subcategory_url,
              subcategory_image_url: subcategory.subcategory_image_url,
              category_id: category._id, // Include parent category ID
              subsubcategories: subsubcategories.map((subsubcategory) => ({
                _id: subsubcategory._id,
                subsubcategory_name: subsubcategory.subsubcategory_name,
                subsubcategory_url: subsubcategory.subsubcategory_url,
                subsubcategory_image_url: subsubcategory.subsubcategory_image_url,
                category_id: category._id, // Include root category ID
                subcategory_id: subcategory._id // Include parent subcategory ID
              }))
            };
          })
        );
        
        return {
          _id: category._id,
          category_name: category.category_name,
          category_url: category.category_url,
          category_image_url: category.category_image_url,
          subcategories: subcategoriesWithSubsubcategories
        };
      })
    );
    
    res.json(categoriesWithSubcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// search bar fct
exports.searchItem = async (req, res) => {
  const { q } = req.query
  if (!q || q.trim() === '') return res.status(400).json({ error: 'Query required' })

  const regex = new RegExp(q.trim(), 'i') // case-insensitive regex

  try {
    const [categories, subcategories, subsubcategories, products] = await Promise.all([
      Category.find({ category_name: regex }),
      Subcategory.find({ subcategory_name: regex }),
      Subsubcategory.find({ subsubcategory_name: regex }),
      Product.find({ product_name: regex }),
    ])

    res.json({
      categories,
      subcategories,
      subsubcategories,
      products,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Create new category
exports.createCategory = async (req, res) => {
  try {
    if (!req.body.category_image_url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const category = new Category({
      category_name: req.body.category_name,
      category_image_url: req.body.category_image_url
    });

    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { category_name, category_image_url } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { category_name, category_image_url },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update subcategories
    await Subcategory.updateMany(
      { category_id: req.params.id },
      { $set: { category_name } }
    );

    // Update sub-subcategories
    await Subsubcategory.updateMany(
      { category_id: req.params.id },
      { $set: { category_name } }
    );

    // Update products
    await Product.updateMany(
      { category_id: req.params.id },
      { $set: { category_name } }
    );

    res.json(updatedCategory);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  const session = await Category.startSession();
  session.startTransaction();
  try {
    const categoryId = req.params.id;

    // Step 1: Find subcategories
    const subcategories = await Subcategory.find({ category_id: categoryId }).session(session);
    const subcategoryIds = subcategories.map(sub => sub._id);

    // Step 2: Find subsubcategories
    const subsubcategories = await Subsubcategory.find({ subcategory_id: { $in: subcategoryIds } }).session(session);
    const subsubcategoryIds = subsubcategories.map(subsub => subsub._id);

    // Step 3: Delete products
    await Product.deleteMany({
      $or: [
        { category_id: categoryId },
        { subcategory_id: { $in: subcategoryIds } },
        { subsubcategory_id: { $in: subsubcategoryIds } }
      ]
    }).session(session);

    // Step 4: Delete subsubcategories and subcategories
    await Subsubcategory.deleteMany({ _id: { $in: subsubcategoryIds } }).session(session);
    await Subcategory.deleteMany({ _id: { $in: subcategoryIds } }).session(session);

    // Step 5: Delete category
    const deletedCategory = await Category.findByIdAndDelete(categoryId).session(session);
    if (!deletedCategory) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Category not found' });
    }

    await session.commitTransaction();
    res.json({ message: 'Category and all related data deleted successfully.' });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Error deleting category and related data.', error: err.message });
  } finally {
    session.endSession();
  }
};