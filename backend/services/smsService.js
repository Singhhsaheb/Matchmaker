// Mock SMS service
const sendMatchSMS = async (phoneNumber, message) => {
  console.log(`[SMS Service] Simulating sending SMS to: ${phoneNumber}`);
  console.log(`[SMS Service] Message: ${message}`);
  
  // In production, we would use twilioClient.messages.create(...)
  return { success: true, message: 'Mock SMS sent successfully' };
};

module.exports = { sendMatchSMS };
