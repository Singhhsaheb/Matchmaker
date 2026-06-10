const nodemailer = require('nodemailer');

// Mock email service
const sendMatchEmail = async (to, matchDetails) => {
  console.log(`[Email Service] Simulating sending match email to: ${to}`);
  console.log(`[Email Service] Match Info: ${JSON.stringify(matchDetails)}`);
  
  // In production, we would use transport.sendMail(...)
  return { success: true, message: 'Mock email sent successfully' };
};

module.exports = { sendMatchEmail };
