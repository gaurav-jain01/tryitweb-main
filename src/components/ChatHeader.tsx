import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import ChatExport from './ChatExport';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHeaderProps {
  messages: Message[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ messages }) => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-bg-secondary border-b border-border-color px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-text-primary text-2xl font-bold">Tryit</h1>
          <span className="text-text-secondary text-sm">AI Chat Assistant</span>
        </div>
        
        <div className="flex items-center gap-6">
          <ChatExport messages={messages} />
          <ThemeToggle />
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-text-secondary text-sm">
                Welcome, {user.name || user.email}
              </span>
              <button 
                onClick={logout}
                className="bg-danger text-white border-none px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader; 