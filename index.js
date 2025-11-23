const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true },
  priority: { type: String, required: true },
  imageUrl: { type: String },
  sellerNumber: { type: String, required: true },
  location: { type: String, required: true }
});

const Product = mongoose.model("Product", ProductSchema);

app.get("/products", async (req, res) => {
  const items = await Product.find();
  res.json(items);
});

app.post("/products", async (req, res) => {
  const item = new Product(req.body);
  await item.save();
  res.json(item);
});

app.get("/products/:id", async (req, res) => {
  const item = await Product.findById(req.params.id);
  res.json(item);
});

app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 4000, () => {
      console.log("Backend running on port", process.env.PORT || 4000);
    });
  })
  .catch((err) => console.log(err));
