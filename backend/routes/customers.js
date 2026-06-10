const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { sendMatchEmail } = require('../services/emailService');
const { sendMatchSMS } = require('../services/smsService');

// Read mock data
const dataPath = path.join(__dirname, '../data/profiles.json');
let profiles = [];
if (fs.existsSync(dataPath)) {
  profiles = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// Get all customers for dashboard
router.get('/', (req, res) => {
  // In a real app, use req.user.id from auth token
  const assignedCustomers = profiles.filter(p => p.assignedMatchmakerId === 1);
  res.json(assignedCustomers);
});

// Get customer by ID
router.get('/:id', (req, res) => {
  const customer = profiles.find(p => p.id === req.params.id);
  if (customer) res.json(customer);
  else res.status(404).json({ message: 'Customer not found' });
});

// Calculate age from DOB
const getAge = (dob) => {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

// Get matches for a customer
router.get('/:id/matches', (req, res) => {
  const customer = profiles.find(p => p.id === req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  const targetGender = customer.gender === 'Male' ? 'Female' : 'Male';
  let potentialMatches = profiles.filter(p => p.gender === targetGender && p.id !== customer.id);

  // Gender-specific matching logic
  if (customer.gender === 'Male') {
    potentialMatches = potentialMatches.filter(match => {
      return getAge(match.dateOfBirth) <= getAge(customer.dateOfBirth) &&
             match.income <= customer.income &&
             match.height <= customer.height &&
             (customer.wantKids === 'Any' || match.wantKids === customer.wantKids);
    });
  } else {
    potentialMatches = potentialMatches.filter(match => {
      // Logic for females: profession/values logic
      return (match.openToRelocate === customer.openToRelocate || match.openToRelocate === 'Yes') &&
             match.income >= customer.income;
    });
  }

  // Mock AI Scoring
  potentialMatches = potentialMatches.map(match => {
    let score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
    let explanation = score > 85 ? "High Potential Match: Strong alignment on lifestyle and values." : "Good Match: Meets basic preferences.";
    return { ...match, matchScore: score, aiExplanation: explanation };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10); // Top 10 matches

  res.json(potentialMatches);
});

// Send a match
router.post('/:id/matches/:matchId/send', async (req, res) => {
  const customer = profiles.find(p => p.id === req.params.id);
  const match = profiles.find(p => p.id === req.params.matchId);
  
  if (!customer || !match) return res.status(404).json({ message: 'Not found' });

  // Generate intro using Mock AI
  const introMessage = `Hi ${customer.firstName}, we found a great match for you: ${match.firstName}. They work as a ${match.designation} and share your values!`;

  // Use Services
  await sendMatchEmail(customer.email, { matchId: match.id, intro: introMessage });
  await sendMatchSMS(customer.phoneNumber, introMessage);

  res.json({ success: true, message: 'Match sent successfully', introMessage });
});

module.exports = router;
