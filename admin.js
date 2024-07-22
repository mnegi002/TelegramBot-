const express = require('express');
const User = require('./user'); // Ensure this path is correct
const router = express.Router();

// API to get all users
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// API to block a user
router.post('/block', async (req, res) => {
  const { id } = req.body;
  await User.updateOne({ _id: id }, { $set: { blocked: true } });
  res.status(200).send('User blocked');
});

// API to delete a user
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  await User.deleteOne({ _id: id });
  res.status(200).send('User deleted');
});

// API to update settings (example route, update based on your requirements)
router.post('/settings', (req, res) => {
  // Handle settings update
  res.status(200).send('Settings updated');
});

module.exports = router;
