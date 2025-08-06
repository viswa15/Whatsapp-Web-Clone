const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const connectDB = require('./config/db');

const PAYLOADS_DIR = path.join(__dirname, 'payloads');

const processPayload = async (payload) => {
  try {
    const data = payload.metaData;
     if (data.entry && data.entry[0].changes && data.entry[0].changes[0].value) {
      const value = data.entry[0].changes[0].value;

      // Handle new incoming messages
      if (value.messages) {
        const messageData = value.messages[0];
        const contactData = value.contacts[0];

        // Check if message already exists
        const existingMessage = await Message.findOne({ message_id: messageData.id });
        if (!existingMessage) {
            const newMessage = new Message({
                wa_id: messageData.from,
                name: contactData.profile.name,
                message_id: messageData.id,
                body: messageData.text.body,
                timestamp: new Date(messageData.timestamp * 1000),
                status: 'sent',
            });
            await newMessage.save();
            console.log(`Saved new message: ${messageData.id}`);
        }
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
            console.log(`Updated status for message ${statusData.id} to ${statusData.status}`);
        }
      }
    }
  } catch (error) {
    console.error('Error processing payload:', error.message);
  }
};

const runSeed = async () => {
    await connectDB();
    console.log('Reading from directory:', PAYLOADS_DIR);

    const files = fs.readdirSync(PAYLOADS_DIR);

    for (const file of files) {
        if (path.extname(file) === '.json') {
            console.log(`Processing ${file}...`);
            const filePath = path.join(PAYLOADS_DIR, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);
            await processPayload(jsonData);
        }
    }

    console.log('Seeding complete! ✅');
    mongoose.disconnect();
};

runSeed();