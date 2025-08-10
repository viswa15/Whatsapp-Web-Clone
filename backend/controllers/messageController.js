const Message = require('../models/Message');
const { getIO } = require('../socket'); // The controller can now get the io instance

// --- Logic for Processing Webhooks ---
const processWebhook = async (req, res) => {
  const data = req.body.metaData || req.body;
  const io = getIO();

  try {
    if (data.entry && data.entry[0].changes && data.entry[0].changes[0].value) {
      const value = data.entry[0].changes[0].value;

      // Handle new incoming messages
      if (value.messages) {
        const messageData = value.messages[0];
        const contactData = value.contacts[0];

        const newMessage = new Message({
          wa_id: messageData.from,
          name: contactData.profile.name,
          from: messageData.from,
          message_id: messageData.id,
          body: messageData.text.body,
          timestamp: new Date(messageData.timestamp * 1000),
          status: 'delivered',
        });

        const savedMessage = await newMessage.save();
        io.emit('newMessage', savedMessage);
        io.emit('updateConversationList');
      }

      // Handle message status updates
      if (value.statuses) {
        const statusData = value.statuses[0];
        const updatedMessage = await Message.findOneAndUpdate(
          { message_id: statusData.id },
          { status: statusData.status },
          { new: true }
        );
        if (updatedMessage) {
            io.emit('statusUpdate', {
                id: updatedMessage._id,
                message_id: updatedMessage.message_id,
                status: updatedMessage.status
            });
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
};

// --- Logic for Getting All Conversations ---
const getConversations = async (req, res) => {
    try {
        const conversations = await Message.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: {
                _id: "$wa_id",
                name: { $first: "$name" },
                lastMessage: { $first: "$body" },
                lastMessageTimestamp: { $first: "$timestamp" },
            }},
            { $sort: { lastMessageTimestamp: -1 } }
        ]);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Logic for Getting Messages for a Specific Conversation ---
const getMessagesForConversation = async (req, res) => {
    try {
        // 1. Get page and limit from query params, with default values
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 50;
        const skip = (page - 1) * limit;

        const { wa_id } = req.params;

        // 2. Get total number of messages for calculating total pages
        const totalMessages = await Message.countDocuments({ wa_id: wa_id });
        const totalPages = Math.ceil(totalMessages / limit);

        // 3. Fetch the paginated messages, sorted from newest to oldest
        const messages = await Message.find({ wa_id: wa_id })
            .sort({ timestamp: 'desc' }) // Sort by newest first for typical chat UI
            .skip(skip)
            .limit(limit);

        // 4. Send a structured response with pagination metadata
        res.json({
            messages: messages.reverse(), // Reverse to show oldest first in the current batch (chronological)
            totalPages: totalPages,
            currentPage: page,
            totalMessages: totalMessages
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Logic for Sending a Message (UI Demo) ---
const sendMessage = async (req, res) => {
    const { wa_id, name, body } = req.body;
    const io = getIO();

    try {
        const newMessage = new Message({
            wa_id,
            name,
            from: MY_PHONE_WA_ID,
            body,
            message_id: `demo_${new Date().getTime()}`,
            timestamp: new Date(),
            status: 'sent'
        });
        const savedMessage = await newMessage.save();

        io.emit('newMessage', savedMessage);
        io.emit('updateConversationList');
        
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all the functions
module.exports = {
    processWebhook,
    getConversations,
    getMessagesForConversation,
    sendMessage,
};