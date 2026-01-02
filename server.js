const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


let products = [
  { id: 1, name: "Lenovo", price: 49999, image: "/laptop.jpg" },
  { id: 2, name: "Iphone", price: 150000, image: "/mobile.jpg" },
  { id: 3, name: "boult Headphones", price: 6000, image: "/headphones.jpg" },
  { id: 4, name: "T-shirt", price: 599, image: "/T-shirt.jpg" },
  { id: 5, name: "sneakers", price: 4999, image: "/sneakers.jpg" },
  { id: 6, name: "smartwatch", price: 5999, image: "/smartwatch.jpg" },
];


let cart = [];
//apiw
app.get("/products", (req, res) => res.json(products));

app.post("/cart", (req, res) => {
  console.log('POST /cart body =', req.body);
  const product = products.find(p => p.id === req.body.id);
  if (!product) {
    console.log('Product not found for id', req.body.id);
    return res.status(404).json({ message: "Product not found" });
  }
  console.log('Adding to cart:', product);
  cart.push(product);
  res.json({ message: "Added to cart" });
});

app.get("/cart", (req, res) => res.json(cart));

app.delete("/cart/:index", (req, res) => {
  cart.splice(req.params.index, 1);
  res.json({ message: "Removed" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
