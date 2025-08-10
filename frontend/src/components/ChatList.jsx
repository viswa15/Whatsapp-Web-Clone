import React,{useEffect} from 'react';
import { formatTime } from '../utils/dateUtils';
import { useChatStore } from '../store/chatStore';

const ChatList = () => {

  const { 
    conversations, 
    selectedChat, 
    searchTerm,
    fetchConversations,
    setSelectedChat,
    setSearchTerm
  } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.lastMessage && conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">WhatsApp</h1>
      </div>

      {/* Search */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.wa_id}
            onClick={() => setSelectedChat(conversation)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
              selectedChat?.wa_id === conversation.wa_id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-whatsapp-primary rounded-full flex items-center justify-center text-white font-medium">
                  {getInitials(conversation.profile_name || conversation.name)}
                </div>
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {conversation.profile_name || conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-whatsapp-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] flex items-center justify-center ml-2">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;