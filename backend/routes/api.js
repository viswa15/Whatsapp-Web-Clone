const express = require('express');
const router = express.Router();

// Import the controller functions
const messageController = require('../controllers/messageController');
const verifyWebhook = require('../middleware/verifyWebhook');

// Map routes to controller functions
router.post('/webhook',verifyWebhook, messageController.processWebhook);
router.get('/conversations', messageController.getConversations);
router.get('/messages/:wa_id', messageController.getMessagesForConversation);
router.post('/send', messageController.sendMessage);

module.exports = router;