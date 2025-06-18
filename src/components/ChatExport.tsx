import React, { useState } from 'react';
import { exportChatAsTxt, exportChatAsJson, exportChatAsCsv, exportChatAsHtml } from '../utils/chatExport';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatExportProps {
  messages: Message[];
}

const ChatExport: React.FC<ChatExportProps> = ({ messages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (exportFunction: (messages: Message[]) => void, format: string) => {
    if (messages.length === 0) {
      alert('No messages to export');
      return;
    }

    setIsExporting(true);
    try {
      exportFunction(messages);
      console.log(`Chat exported as ${format}`);
    } catch (error) {
      console.error(`Export failed:`, error);
      alert(`Failed to export as ${format}`);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const exportOptions = [
    { label: 'Text (.txt)', action: () => handleExport(exportChatAsTxt, 'TXT') },
    { label: 'JSON (.json)', action: () => handleExport(exportChatAsJson, 'JSON') },
    { label: 'CSV (.csv)', action: () => handleExport(exportChatAsCsv, 'CSV') },
    { label: 'HTML (.html)', action: () => handleExport(exportChatAsHtml, 'HTML') },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="bg-accent-primary text-white border-none px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? 'Exporting...' : 'Export Chat'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-color rounded-md shadow-lg z-50">
          <div className="py-1">
            {exportOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                disabled={isExporting}
                className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatExport; 