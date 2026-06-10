const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Hardcoded mock login for MVP
  if (username === 'admin' && password === 'password') {
    res.json({ token: 'mock-jwt-token-12345', user: { id: 1, name: 'Admin Matchmaker' } });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

module.exports = router;
