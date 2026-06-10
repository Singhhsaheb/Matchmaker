const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/profiles.json');
let profiles = [];
if (fs.existsSync(dataPath)) {
  profiles = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

router.post('/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const query = message.toLowerCase();
  
  // Keyword-based search logic (Simulated AI)
  let bestMatch = null;
  let highestScore = 0;

  for (const profile of profiles) {
    let score = 0;
    
    // Check gender preference logic
    let targetGender = null;

    // If the user says they ARE a male or female, find the opposite
    if (query.match(/\bi (am|m) a (male|man|guy)\b/) || query.match(/\b(male|man) (searching|looking)\b/)) {
      targetGender = 'female';
    } else if (query.match(/\bi (am|m) a (female|woman|girl)\b/) || query.match(/\b(female|woman) (searching|looking)\b/)) {
      targetGender = 'male';
    } 
    // Otherwise, assume they are asking FOR that gender directly
    else if (query.match(/\b(female|woman|girl)\b/)) {
      targetGender = 'female';
    } else if (query.match(/\b(male|man|guy)\b/)) {
      targetGender = 'male';
    }

    // Apply strict scoring for gender
    if (targetGender && profile.gender.toLowerCase() === targetGender) {
      score += 15;
    } else if (targetGender && profile.gender.toLowerCase() !== targetGender) {
      score -= 100; // Heavily penalize the wrong gender to ensure correct matching
    }
    
    // City
    if (query.includes(profile.city.toLowerCase())) score += 10;
    
    // Profession/Company
    if (query.includes(profile.designation.toLowerCase()) || 
        profile.designation.toLowerCase().split(' ').some(w => query.includes(w))) score += 5;
        
    // Income
    if (query.includes('rich') && profile.income >= 3000000) score += 5;
    if (query.match(/\b\d+ lakhs?\b/) && profile.income >= parseInt(query.match(/\b(\d+) lakhs?\b/)[1]) * 100000) score += 5;

    // Height
    if (query.includes('tall') && profile.height >= 175) score += 5;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = profile;
    }
  }

  // Generate response
  let botReply = "I couldn't find a perfect match based on that criteria. Could you provide more specific details?";
  if (bestMatch && highestScore > 0) {
    botReply = `I found a highly compatible match! **${bestMatch.firstName} ${bestMatch.lastName}** is a ${bestMatch.designation} from ${bestMatch.city}. They earn ₹${bestMatch.income.toLocaleString()} and strongly fit your description. Would you like to view their profile? [View Profile](/customer/${bestMatch.id})`;
  } else if (bestMatch) {
      // Fallback recommendation
      botReply = `How about **${bestMatch.firstName} ${bestMatch.lastName}** from ${bestMatch.city}?`;
  }

  res.json({ reply: botReply, matchId: bestMatch ? bestMatch.id : null });
});

module.exports = router;
