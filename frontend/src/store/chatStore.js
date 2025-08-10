import { create } from 'zustand';
import api from '../services/api';
import socket from '../services/socket';

// This is your business's WhatsApp ID. We use it to determine if a message is outgoing.
// You can get this from the sample payloads ('display_phone_number').
const MY_PHONE_WA_ID = '918329446654';

export const useChatStore = create((set, get) => ({
  // --- STATE ---
  conversations: [],
  selectedChat: null,
  messages: [],
  searchTerm: '',

  // --- ACTIONS ---

  setSearchTerm: (term) => set({ searchTerm: term }),

  fetchConversations: async () => {
    try {
      const response = await api.get('/api/conversations');
      // The API returns wa_id as _id. We map it to wa_id for consistency with your components.
      const formattedConversations = response.data.map(c => ({
        ...c,
        wa_id: c._id,
        lastMessage: c.lastMessage,
        lastMessageTime: c.lastMessageTimestamp,
        profile_name: c.name
      }));
      set({ conversations: formattedConversations });
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  },

  fetchMessages: async (chatId) => {
  try {
    const response = await api.get(`/api/messages/${chatId}?limit=100`);
    const formattedMessages = response.data.messages.map(m => {
      console.log(`Comparing | From: "${m.from}" | My ID: "${MY_PHONE_WA_ID}" | Match: ${m.from === MY_PHONE_WA_ID}`);
      return {
        ...m,
        message: m.body,
        is_outgoing: m.from === MY_PHONE_WA_ID
      };
    });
    set({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    set({ messages: [] });
  }
},

  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    if (chat) {
      get().fetchMessages(chat.wa_id);
    } else {
      set({ messages: [] });
    }
  },

  sendMessage: async (messageText) => {
    const { selectedChat } = get();
    if (!selectedChat) return;
    try {
      await api.post('/api/send', {
        body: messageText,
        wa_id: selectedChat.wa_id,
        name: selectedChat.name,
      });
      // UI will update via WebSocket 'newMessage' event
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },
  
  initializeSocketListeners: () => {
    // Clear existing listeners to prevent duplicates
    socket.off('newMessage');
    socket.off('statusUpdate');
    socket.off('updateConversationList');

    socket.on('newMessage', (newMessage) => {
      const { selectedChat, fetchConversations } = get();
      const formattedMessage = {
          ...newMessage,
          message: newMessage.body,
          is_outgoing: newMessage.from === MY_PHONE_WA_ID
      };

      if (selectedChat && formattedMessage.wa_id === selectedChat.wa_id) {
        set((state) => ({ messages: [...state.messages, formattedMessage] }));
      }
      // Always refresh conversation list to show new last message
      fetchConversations();
    });

    socket.on('statusUpdate', (statusUpdate) => {
        set((state) => ({
            messages: state.messages.map(msg => 
                msg._id === statusUpdate.id ? { ...msg, status: statusUpdate.status } : msg
            )
        }));
    });

    socket.on('updateConversationList', () => {
      get().fetchConversations();
    });
  },
}));