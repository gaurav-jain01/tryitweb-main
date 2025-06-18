import React, { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled = false }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          onTranscript(transcript);
          setError(null);
          setShowError(false);
          setShowTips(false);
        }
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Voice recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking louder or check your microphone.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access in your browser.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not available.';
            break;
          case 'bad-grammar':
            errorMessage = 'Speech recognition grammar error.';
            break;
          case 'language-not-supported':
            errorMessage = 'Language not supported.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        
        setError(errorMessage);
        setShowError(true);
        setIsListening(false);
        setShowTips(false);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setShowTips(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognitionRef.current.onstart = () => {
        setError(null);
        setShowError(false);
        setIsListening(true);
        setShowTips(true);
        
        // Show tips for 3 seconds
        timeoutRef.current = setTimeout(() => {
          setShowTips(false);
        }, 3000);
      };
    } else {
      setIsSupported(false);
      setError('Voice input is not supported in this browser');
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onTranscript]);

  const startListening = () => {
    if (!isSupported || disabled) return;
    
    setError(null);
    setShowError(false);
    setIsListening(true);
    
    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Failed to start voice recognition');
      setShowError(true);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setShowTips(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearError = () => {
    setError(null);
    setShowError(false);
  };

  if (!isSupported) {
    return (
      <button
        className="bg-bg-tertiary text-text-muted border-none rounded-md w-7 h-7 flex items-center justify-center cursor-not-allowed opacity-50"
        title="Voice input not supported"
        disabled
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1A3 3 0 0 0 9 4V8A3 3 0 0 0 12 11A3 3 0 0 0 15 8V4A3 3 0 0 0 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 10V9A7 7 0 0 0 5 9V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
          isListening 
            ? 'bg-danger text-white animate-pulse' 
            : 'bg-bg-tertiary text-text-secondary hover:bg-accent-primary hover:text-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1A3 3 0 0 0 9 4V8A3 3 0 0 0 12 11A3 3 0 0 0 15 8V4A3 3 0 0 0 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 10V9A7 7 0 0 0 5 9V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      
      {/* Tips for better voice recognition */}
      {showTips && isListening && (
        <div className="absolute bottom-full right-0 mb-2 bg-accent-primary text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 max-w-64 shadow-lg">
          <div className="flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 flex-shrink-0">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex-1">
              <div className="font-medium mb-1">Speak now!</div>
              <div className="text-xs opacity-90">
                Speak clearly and at a normal volume. Make sure your microphone is working.
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error messages */}
      {showError && error && (
        <div className="absolute bottom-full right-0 mb-2 bg-danger text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 max-w-64 shadow-lg">
          <div className="flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex-1">
              <div className="font-medium mb-1">Voice Input Error</div>
              <div className="text-xs opacity-90">{error}</div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={startListening}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={clearError}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isListening && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default VoiceInput; 