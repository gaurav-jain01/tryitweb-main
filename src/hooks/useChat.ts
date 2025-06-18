import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string | null;
  timestamp: Date;
}

interface ChatHistory {
  messages: string[];
  currentIndex: number;
}

interface UseChatReturn {
  messages: Message[];
  sendMessage: (input: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  navigateHistory: (direction: 'up' | 'down') => string;
  clearHistory: () => void;
  chatHistory: ChatHistory;
}

// Mock AI responses for fallback mode
const getMockResponse = (userMessage: string): string => {
  const responses = [
    `I understand you're asking about "${userMessage}". Let me help you with that. This is a thoughtful question that deserves a detailed response.`,
    `Thanks for sharing that with me! Regarding "${userMessage}", I think there are several interesting perspectives to consider.`,
    `That's a great question about "${userMessage}"! Let me provide you with some insights on this topic.`,
    `I appreciate you asking about "${userMessage}". This is an important topic that many people are curious about.`,
    `You've raised an interesting point about "${userMessage}". Let me share some thoughts on this with you.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    currentIndex: -1
  });

  // Force demo mode for chatbot
  const hasApiCredentials = false;

  // Update ref when messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setChatHistory(parsed);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((newHistory: ChatHistory) => {
    setChatHistory(newHistory);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(scrollToBottom, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Add to chat history
    const newHistory = {
      messages: [...chatHistory.messages, content.trim()],
      currentIndex: -1
    };
    saveChatHistory(newHistory);

    try {
      if (hasApiCredentials) {
        // Real API call - OpenRouter format
        const apiUrl = process.env.REACT_APP_API_LINK === 'https://openrouter.ai/api/v1' 
          ? 'https://openrouter.ai/api/v1/chat/completions'
          : process.env.REACT_APP_API_LINK!;
          
        const response = await axios.post(
          apiUrl,
          {
            model: process.env.REACT_APP_MODEL || "openai/gpt-3.5-turbo",
            messages: [
              ...messagesRef.current.map(msg => ({ role: msg.role, content: msg.content })),
              { role: 'user', content: content.trim() }
            ],
            max_tokens: parseInt(process.env.REACT_APP_MAX_TOKENS || "1000"),
            temperature: parseFloat(process.env.REACT_APP_TEMPERATURE || "0.7")
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
              "HTTP-Referer": window.location.origin, // Required by OpenRouter
              "X-Title": "TryIt Chat App" // Optional: your app name
            },
          }
        );

        const responseContent = response.data.choices[0].message.content;
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: responseContent,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback mode - Mock response
        console.log('Chat: Using fallback mode - no API configured');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockResponse = getMockResponse(content.trim());
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: mockResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (err: any) {
      console.error('Chat error:', err);
      
      if (err.response?.status === 401) {
        setError('API key is invalid. Please check your configuration.');
      } else if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
      } else {
        setError(`API Error: ${err.response?.data?.error?.message || err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatHistory.messages, saveChatHistory, hasApiCredentials]);

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    if (chatHistory.messages.length === 0) return '';

    let newIndex = chatHistory.currentIndex;
    
    if (direction === 'up') {
      newIndex = Math.min(newIndex + 1, chatHistory.messages.length - 1);
    } else {
      newIndex = Math.max(newIndex - 1, -1);
    }

    setChatHistory(prev => ({ ...prev, currentIndex: newIndex }));
    
    return newIndex >= 0 ? chatHistory.messages[chatHistory.messages.length - 1 - newIndex] : '';
  }, [chatHistory.messages, chatHistory.currentIndex]);

  const clearHistory = useCallback(() => {
    setChatHistory({ messages: [], currentIndex: -1 });
    localStorage.removeItem('chatHistory');
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    messagesEndRef,
    navigateHistory,
    clearHistory,
    chatHistory
  };
}; 