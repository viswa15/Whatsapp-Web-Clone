import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';

const MessageInput = () => {
  const {sendMessage} = useChatStore();
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim()); // Call the action from the store
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            rows="1"
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent max-h-32"
            style={{ minHeight: '40px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 rounded-full transition-colors duration-150 ${
            message.trim()
              ? 'bg-whatsapp-primary text-white hover:bg-whatsapp-secondary'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;