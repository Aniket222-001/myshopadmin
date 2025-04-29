// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('./models/product'); // Import the model
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://aniketkushwahadtu0408:8447566570@cluster0.gkunqim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));


// MongoDB Schema
const ImageSchema = new mongoose.Schema({
    imageUrl: [String], // now an array of strings
  });
const Image = mongoose.model('Image', ImageSchema);

// Cloudinary config
cloudinary.config({
  cloud_name: 'drucd7zae',
  api_key: '415875169632918',
  api_secret: 'k_uawV6dG64MyA37o_Dmqn9gUPs',
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mern_uploads', // optional
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

app.post('/add-product', upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path); // Cloudinary URLs

    const {
      brand,
      model,
      price,
      category,
      description,
      specs,
      rating,
      stock,
    } = req.body;

    const product = new Product({
      brand,
      model,
      price,
      category,
      description,
      specs: JSON.parse(specs), // specs comes as stringified JSON
      rating,
      stock,
      images: imageUrls,
    });

    await product.save();
    res.json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});
// Get all images
// app.get('/images', async (req, res) => {
//   const images = await Image.find();
//   res.json(images);
// });

app.get('/products', async (req, res) => {
    try {
      const allProducts = await Product.find();
      res.json(allProducts);
    } catch (err) {
      res.status(500).json({ error: 'Could not fetch products' });
    }
  });

  // Update a product by ID
app.put('/update-product/:id', upload.array('images', 5), async (req, res) => {
    try {
      const productId = req.params.id;
      const {
        brand,
        model,
        price,
        category,
        description,
        specs,
        rating,
        stock,
      } = req.body;
  
      // Check if images are uploaded
      const imageUrls = req.files.length ? req.files.map(file => file.path) : [];
  
      // Parse specs JSON from request
      const parsedSpecs = JSON.parse(specs);
  
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          brand,
          model,
          price,
          category,
          description,
          specs: parsedSpecs,
          rating,
          stock,
          images: imageUrls.length ? imageUrls : undefined, // Only update images if new ones are uploaded
        },
        { new: true } // Return the updated document
      );
  
      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  // Delete a product by ID
app.delete('/delete-product/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      await Product.findByIdAndDelete(productId);
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });
 


// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
