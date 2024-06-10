const { json } = require("express");
const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  try {
    // Extract product data from request body
    const { title, price, category, rating, author, thumbnail } = req.body;

    // Create a new product instance
    const product = new Product({
      title,
      price,
      category,
      rating,
      author,
      thumbnail: req.file.path.replace(/\\/g, "/"), // Save the file path in the database
    });

    // Save the product to the database
    const response = await product.save();

    // Send success response
    res.status(201).json(response);
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: error.message });
  }
};

const path = require("path");

exports.fetchAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Modify each product object to include the image URL
    const productsWithImageURL = products.map((product) => ({
      ...product._doc,
      thumbnail: `${req.protocol}://${req.get("host")}/uploads/${path.basename(
        product.thumbnail
      )}`,
    }));

    // Send the modified product list as the response
    res.status(200).json(productsWithImageURL);
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err.message });
  }
};

exports.getProductImage = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
