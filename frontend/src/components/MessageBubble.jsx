import React from 'react';
// import { formatTime } from '../utils/dateUtils';
import StatusIndicator from './StatusIndicator';

const MessageBubble = ({ message }) => {
  const { is_outgoing } = message;

  
  return (
    <div className={`flex ${is_outgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`message-bubble px-4 py-2 rounded-lg shadow-sm ${
          is_outgoing
            ? 'bg-whatsapp-message-out text-gray-800 rounded-br-none'
            : 'bg-whatsapp-message-in text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-5 mb-1">{message.message}</p>
        <div className={`flex items-center space-x-1 ${is_outgoing ? 'justify-end' : 'justify-start'}`}>
          {/* <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span> */}
          {is_outgoing && <StatusIndicator status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;