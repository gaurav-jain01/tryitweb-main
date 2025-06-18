import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface NewChatBoxProps {
  className?: string;
}

const NewChatBox: React.FC<NewChatBoxProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentInput, setCurrentInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Dummy responses for demo
  const dummyResponses = [
    "That's an interesting question! Let me think about that for a moment. I believe there are several perspectives to consider here.",
    "Thanks for sharing that with me. I find your perspective quite thought-provoking. Have you considered the alternative viewpoint?",
    "I understand what you're asking. This is a complex topic that deserves careful consideration. Let me break it down for you.",
    "That's a great point! I think there's definitely merit to what you're saying. It reminds me of a similar situation I encountered.",
    "I appreciate you bringing this up. It's an important discussion that many people are having these days. What are your thoughts on the matter?",
    "That's a fascinating question! I'd love to explore this topic further with you. What aspects are you most interested in?",
    "I see what you mean. This is definitely something worth discussing. Have you thought about the long-term implications?",
    "That's a valid concern. I think it's important to consider all the factors involved. What do you think would be the best approach?",
    "I understand your perspective. This is a nuanced issue that requires careful thought. Let's explore it together.",
    "That's an excellent observation! I think you're onto something important here. How do you think this could be improved?"
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Load input history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('newChatInputHistory');
    if (savedHistory) {
      setInputHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save input history to localStorage
  useEffect(() => {
    if (inputHistory.length > 0) {
      localStorage.setItem('newChatInputHistory', JSON.stringify(inputHistory));
    }
  }, [inputHistory]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-scroll during loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(scrollToBottom, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const addToHistory = (message: string) => {
    if (message.trim() && !inputHistory.includes(message.trim())) {
      const newHistory = [message.trim(), ...inputHistory.slice(0, 9)]; // Keep last 10 messages
      setInputHistory(newHistory);
    }
    setHistoryIndex(-1);
    setCurrentInput('');
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    addToHistory(inputValue.trim());
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Get random dummy response
    const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'ArrowUp' && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex < inputHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(inputHistory[newIndex]);
        setCurrentInput(inputHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown' && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(inputHistory[newIndex]);
        setCurrentInput(inputHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue(currentInput);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (historyIndex === -1) {
      setCurrentInput(value);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInputValue('');
    setHistoryIndex(-1);
    setCurrentInput('');
  };

  return (
    <div className={`flex flex-col h-full bg-bg-primary ${className}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-text-secondary py-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm">Type a message or use voice input to begin chatting</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-secondary text-text-primary border border-border-color'
              }`}
            >
              <ReactMarkdown className="prose prose-sm max-w-none">
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-bg-secondary text-text-primary border border-border-color rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-primary"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border-color bg-bg-secondary">
        <div className="relative bg-bg-primary border-2 border-border-color rounded-xl p-1 transition-all duration-300 shadow-lg focus-within:border-accent-primary focus-within:shadow-xl">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Thinking..." : "Type your message... (Use ↑↓ for history)"}
            disabled={isLoading}
            className="w-full min-h-12 max-h-32 p-3 pr-24 border-none outline-none bg-transparent text-text-primary text-base font-inherit resize-none leading-relaxed"
            rows={1}
          />

          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            {/* Voice Input */}
            <button
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isListening
                  ? 'bg-danger text-white animate-pulse'
                  : 'bg-bg-tertiary text-text-secondary hover:bg-accent-primary hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1A3 3 0 0 1 15 4V8A3 3 0 0 1 12 11A3 3 0 0 1 9 8V4A3 3 0 0 1 12 1Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 10V9A7 7 0 0 0 5 9V10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 19V23" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 23H16" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
            </button>

            {/* History Navigation */}
            {inputHistory.length > 0 && (
              <button
                onClick={() => {
                  if (historyIndex < inputHistory.length - 1) {
                    const newIndex = historyIndex + 1;
                    setHistoryIndex(newIndex);
                    setInputValue(inputHistory[newIndex]);
                  }
                }}
                className="bg-bg-tertiary text-text-secondary border-none rounded-lg w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-accent-primary hover:text-white hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={isLoading || historyIndex >= inputHistory.length - 1}
                title="Previous message (↑)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-accent-primary text-white border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-accent-secondary hover:scale-105 active:scale-95 disabled:bg-text-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatBox; 