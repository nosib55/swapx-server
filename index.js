const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ------------------------
// PRODUCT SCHEMA / MODEL
// ------------------------
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true },
  priority: { type: String, required: true },
  imageUrl: { type: String },
  sellerNumber: { type: String, required: true },
  location: { type: String, required: true },

  // ⭐ User email added
  email: { type: String, required: true }
});

const Product = mongoose.model("Product", ProductSchema);

// ------------------------
// GET ALL PRODUCTS or FILTER BY EMAIL
// ------------------------
app.get("/products", async (req, res) => {
  try {
    const { email } = req.query;

    let items;
    if (email) {
      // ⭐ Only logged user products
      items = await Product.find({ email });
    } else {
      items = await Product.find();
    }

    res.json(items);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ------------------------
// CREATE PRODUCT
// ------------------------
app.post("/products", async (req, res) => {
  try {
    const item = new Product(req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: "Failed to add product" });
  }
});

// ------------------------
// GET PRODUCT BY ID
// ------------------------
app.get("/products/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Product not found" });

    res.json(item);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ------------------------
// DELETE PRODUCT BY ID
// ------------------------
app.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ------------------------
// START SERVER
// ------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 4000, () => {
      console.log("Backend running on port", process.env.PORT || 4000);
    });
  })
  .catch((err) => console.log(err));
