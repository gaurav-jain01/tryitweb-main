import React, { useState } from 'react';
import ChatHeader from './components/ChatHeader';
// import ChatMessage from './components/ChatMessage';
// import ChatInput from './components/ChatInput';
// import SkeletonMessage from './components/SkeletonMessage';
// import { useChat } from './hooks/useChat';
import NewChatBox from './components/NewChatBox';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

const TryIt: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  // const { messages, sendMessage, isLoading, error } = useChat();
  // const [input, setInput] = useState<string>("");

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-text-primary text-2xl font-bold mb-4">Please log in to continue</h2>
          <p className="text-text-secondary">You need to be authenticated to use the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <ChatHeader messages={[]} />
      
      {/* Previous ChatBox Implementation - Commented Out */}
      {/* 
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <div className="flex-1 overflow-y-auto bg-bg-primary">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <div className="text-text-secondary text-lg mb-2">Welcome to Tryit!</div>
                <div className="text-text-secondary text-sm">Start a conversation with the AI assistant.</div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message} 
              />
            ))}
            
            {isLoading && <SkeletonMessage />}
            
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                <div className="text-danger font-medium">Error</div>
                <div className="text-danger/80 text-sm">{error}</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-border-color bg-bg-secondary">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <ChatInput 
              input={input} 
              setInput={setInput} 
              isLoading={isLoading} 
              onSendMessage={() => sendMessage(input)} 
            />
          </div>
        </div>
      </div>
      */}

      {/* New ChatBox Implementation */}
      <div className="h-[calc(100vh-80px)]">
        <NewChatBox />
      </div>
    </div>
  );
};

export default TryIt; 