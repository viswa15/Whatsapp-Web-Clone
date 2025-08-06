const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  wa_id: { // Sender's WhatsApp ID
    type: String,
    required: true,
  },
  name: { // Sender's profile name
    type: String,
    required: true,
  },
  message_id: { // The unique ID of the message from WhatsApp
    type: String,
    required: true,
    unique: true,
  },
  body: { // The text content of the message
    type: String,
    required: true,
  },
  timestamp: { // The timestamp when the message was sent
    type: Date,
    required: true,
  },
  status: { // 'sent', 'delivered', or 'read'
    type: String,
    default: 'sent',
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Message', MessageSchema, 'processed_messages');