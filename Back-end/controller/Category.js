const { Category } = require("../model/Category");

exports.fetchCategories = async (req, res) => {
  try {
    let category = await Category.find({}).exec();
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const response = await category.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};
