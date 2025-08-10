import React, { useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatWindow = () => {
  // CORRECT: Get selectedChat and messages from the Zustand store
  const { selectedChat, messages } = useChatStore();
  const messagesEndRef = useRef(null);

  // This is the only scrolling effect you need.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // It runs whenever the messages array changes.

  // This is the only placeholder you need.
  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-8 opacity-20">
            {/* Placeholder SVG */}
            <svg viewBox="0 0 303 172" width="360" height="200" className="text-gray-400">
              <path fill="currentColor" d="M233.063 151.496c1.262-1.616 2.005-3.633 2.005-5.819v-8.301c0-4.418-3.582-8-8-8s-8 3.582-8 8v8.301c0 .339.027.673.08 1h-36.16c.053-.327.08-.661.08-1v-8.301c0-4.418-3.582-8-8-8s-8 3.582-8 8v8.301c0 2.186.743 4.203 2.005 5.819l-2.964 3.777c-1.262 1.608-2.005 3.616-2.005 5.791v8.51c0 4.418 3.582 8 8 8h47.008c4.418 0 8-3.582 8-8v-8.51c0-2.175-.743-4.183-2.005-5.791l-2.964-3.777z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-light text-gray-600 mb-2">WhatsApp Web</h3>
          <p className="text-gray-500 max-w-md">
            Send and receive messages without keeping your phone online.<br/>
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }

  // The getInitials function needs to be inside the component body to be used.
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center space-x-3">
        <div className="w-10 h-10 bg-whatsapp-primary rounded-full flex items-center justify-center text-white font-medium">
          {/* CORRECT: Use selectedChat here */}
          {getInitials(selectedChat.profile_name || selectedChat.name)}
        </div>
        <div className="flex-1">
          <h2 className="font-medium text-gray-900">
            {/* CORRECT: Use selectedChat here */}
            {selectedChat.profile_name || selectedChat.name}
          </h2>
          <p className="text-sm text-gray-500">
            {/* CORRECT: Use selectedChat here */}
            +{selectedChat.wa_id}
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Header buttons */}
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin"
        style={{ backgroundColor: '#e5ddd5' }}
      >
        {/* CORRECT: Map over the messages array from the store */}
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;