const crypto = require('crypto');
require('dotenv').config();

const verifyWebhook = (req, res, next) => {
  // 1. Get the signature from the request header
  const signature = req.get('X-Hub-Signature-256');

  if (!signature) {
    console.warn('Request is missing X-Hub-Signature-256 header.');
    return res.status(403).send('Request signature is missing.');
  }

  // 2. Create our own signature using the app secret
  const generatedSignature = 'sha256=' + crypto
    .createHmac('sha256', process.env.APP_SECRET)
    .update(req.rawBody, 'utf-8') // Use the raw body we captured
    .digest('hex');

  // 3. Compare the two signatures
  if (signature !== generatedSignature) {
    console.error('Signatures do not match! Request rejected.');
    return res.status(403).send('Invalid signature.');
  }

  // If signatures match, proceed to the next handler
  console.log('Webhook signature verified successfully! ✅');
  next();
};

module.exports = verifyWebhook;