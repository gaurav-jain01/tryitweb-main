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

// Mock AI responses
const getMockResponse = (userMessage: string): string => {
  const responses = [
    `I understand you're asking about "${userMessage}". This is a mock response since there's no real AI backend connected. In a real application, this would be an AI-generated response based on your input.`,
    `Thanks for your message: "${userMessage}". I'm currently running in demo mode with mock responses. The actual AI functionality would be available when connected to a real backend service.`,
    `Interesting question about "${userMessage}"! This is a placeholder response. In production, this would be processed by an AI model like GPT-4 or similar.`,
    `I received your message: "${userMessage}". Since this is a demo version, I'm providing mock responses. The real chat would connect to an AI service for intelligent responses.`,
    `You said: "${userMessage}". This is a demo response. In a real application, this would be an AI-generated answer tailored to your specific question.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    currentIndex: -1
  });

  // Check if we have API credentials
  const hasApiCredentials = process.env.REACT_APP_API_KEY && process.env.REACT_APP_API_LINK;

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
        // Real API call
        const response = await axios.post(
          process.env.REACT_APP_API_LINK!,
          {
            model: process.env.REACT_APP_MODEL || "gpt-4o",
            messages: [
              ...messages.map(msg => ({ role: msg.role, content: msg.content })),
              { role: 'user', content: content.trim() }
            ],
            max_tokens: parseInt(process.env.REACT_APP_MAX_TOKENS || "1000"),
            temperature: parseFloat(process.env.REACT_APP_TEMPERATURE || "0.7")
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
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
        // Mock response (fallback)
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
      
      if (hasApiCredentials && err.response?.status === 401) {
        setError('API key is invalid. Please check your configuration.');
      } else if (hasApiCredentials && err.response?.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
      } else if (hasApiCredentials) {
        setError(`API Error: ${err.response?.data?.error?.message || err.message}`);
      } else {
        setError('An error occurred while processing your request.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatHistory.messages, saveChatHistory, messages, hasApiCredentials]);

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
  }, [chatHistory]);

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