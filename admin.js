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

// API to get settings
router.get('/settings', (req, res) => {
  const settings = {
    apiKey: process.env.WEATHER_API_KEY || 'default_api_key', // Provide a default value if the environment variable is not set
  };
  res.json(settings);
});

module.exports = router;
