// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Admin');

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with your actual secret key

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ msg: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  await newUser.save();
  res.json({ msg: 'User created successfully' });
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
  
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }
  
//     const user = await User.findOne({ username: username});
//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }
  
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
  
//     const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
//     res.json({ token });
//   });
  

module.exports = router;

