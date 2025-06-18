import React, { useState, useEffect, useRef } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import VoiceInput from './VoiceInput';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, isLoading, onSendMessage }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentInput, setCurrentInput] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load input history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatInputHistory');
    if (savedHistory) {
      setInputHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save input history to localStorage whenever it changes
  useEffect(() => {
    if (inputHistory.length > 0) {
      localStorage.setItem('chatInputHistory', JSON.stringify(inputHistory));
    }
  }, [inputHistory]);

  const addToHistory = (message: string) => {
    if (message.trim() && !inputHistory.includes(message.trim())) {
      const newHistory = [message.trim(), ...inputHistory.slice(0, 9)]; // Keep last 10 messages
      setInputHistory(newHistory);
    }
    setHistoryIndex(-1);
    setCurrentInput('');
  };

  const handleSend = () => {
    if (!isLoading && input.trim() !== "") {
      addToHistory(input);
      onSendMessage();
      setInput(""); // Clear the input after sending the message
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    // Auto-send after voice input (optional - you can remove this if you want manual send)
    // setTimeout(() => handleSend(), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "ArrowUp" && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex < inputHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(inputHistory[newIndex]);
        setCurrentInput(inputHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown" && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(inputHistory[newIndex]);
        setCurrentInput(inputHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput(currentInput);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (historyIndex === -1) {
      setCurrentInput(value);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  return (
    <div className="relative bg-bg-primary border-2 border-border-color rounded-xl p-1 transition-all duration-300 shadow-lg focus-within:border-accent-primary focus-within:shadow-xl focus-within:-translate-y-0.5">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? "Thinking..." : "Ask Tryit! (Use ↑↓ arrows for history)"}
        disabled={isLoading}
        className="w-full min-h-12 max-h-32 p-3 pr-24 border-none outline-none bg-transparent text-text-primary text-base font-inherit resize-none leading-relaxed transition-all duration-300"
        style={{ 
          filter: isVisible ? 'none' : 'blur(4px)',
        }}
        rows={1}
      />

      <div className="absolute right-2 bottom-2 flex items-center gap-2">
        {/* Voice Input */}
        <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />

        {inputHistory.length > 0 && (
          <button
            onClick={() => {
              if (historyIndex < inputHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(inputHistory[newIndex]);
              }
            }}
            className="bg-bg-tertiary text-text-secondary border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-accent-primary hover:text-white hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            title="Previous message (↑)"
            disabled={isLoading || historyIndex >= inputHistory.length - 1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <button
          onClick={toggleVisibility}
          className="bg-bg-tertiary text-text-secondary border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-accent-primary hover:text-white hover:scale-105 active:scale-95"
          type="button"
          title={isVisible ? "Hide text" : "Show text"}
        >
          {isVisible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2 12 2 12C2 12 4.5 7.5 8.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 22 12 22 12C22 12 21.5 13.5 20.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <button
          onClick={handleSend}
          className="bg-accent-primary text-white border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-accent-secondary hover:scale-105 active:scale-95 disabled:bg-text-muted disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <ThreeDots 
              height="20" 
              width="20" 
              radius="9"
              color="#ffffff" 
              ariaLabel="three-dots-loading"
              visible={true}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput; 