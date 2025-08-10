import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import { useChatStore } from './store/chatStore';
import socket from './services/socket';

function App() {
  const { selectedChat, initializeSocketListeners } = useChatStore();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    socket.connect();
    initializeSocketListeners();
    return () => {
      socket.disconnect();
    };
  }, [initializeSocketListeners]);

  return (
    <div className="h-screen flex bg-gray-100">
      {isMobileView ? (
        <div className="w-full">
          {!selectedChat ? <ChatList /> : <ChatWindow />}
        </div>
      ) : (
        <>
          <ChatList />
          <ChatWindow />
        </>
      )}
    </div>
  );
}

export default App;