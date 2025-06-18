import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string | null;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex-1 max-w-4xl ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`flex items-start gap-4 p-4 rounded-lg border shadow-sm ${
          isUser 
            ? 'bg-accent-primary text-white border-accent-primary' 
            : 'bg-bg-secondary text-text-primary border-border-color'
        }`}>
          <ReactMarkdown 
            components={{
              // Customize markdown components for better styling
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              code: ({ children }) => (
                <code className="bg-bg-tertiary text-text-primary px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-bg-tertiary text-text-primary p-3 rounded-lg overflow-x-auto text-sm font-mono">
                  {children}
                </pre>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 