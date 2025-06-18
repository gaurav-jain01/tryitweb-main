interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Helper function to trigger download
const triggerDownload = (blob: Blob, filename: string, mimeType: string): void => {
  try {
    // Method 1: Create object URL and trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    console.log('Triggering download:', filename, 'Size:', blob.size, 'bytes');
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('Download triggered successfully');
  } catch (error) {
    console.error('Download failed:', error);
    
    // Fallback: Open in new window/tab
    try {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      console.log('Fallback: Opened in new window');
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw new Error('Download failed and fallback also failed');
    }
  }
};

export const exportChatAsTxt = (messages: Message[], filename?: string): void => {
  try {
    console.log('Exporting as TXT, messages:', messages.length);
    
    const content = messages.map(msg => {
      const timestamp = msg.timestamp.toLocaleString();
      const role = msg.role === 'user' ? 'You' : 'Tryit';
      return `[${timestamp}] ${role}: ${msg.content}`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const downloadFilename = filename || `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    
    triggerDownload(blob, downloadFilename, 'text/plain');
  } catch (error) {
    console.error('Error in TXT export:', error);
    throw error;
  }
};

export const exportChatAsJson = (messages: Message[], filename?: string): void => {
  try {
    console.log('Exporting as JSON, messages:', messages.length);
    
    const content = JSON.stringify({
      exportDate: new Date().toISOString(),
      totalMessages: messages.length,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    }, null, 2);

    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const downloadFilename = filename || `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    
    triggerDownload(blob, downloadFilename, 'application/json');
  } catch (error) {
    console.error('Error in JSON export:', error);
    throw error;
  }
};

export const exportChatAsCsv = (messages: Message[], filename?: string): void => {
  try {
    console.log('Exporting as CSV, messages:', messages.length);
    
    const headers = ['Timestamp', 'Role', 'Content'];
    const rows = messages.map(msg => [
      msg.timestamp.toLocaleString(),
      msg.role,
      `"${msg.content.replace(/"/g, '""')}"` // Escape quotes in CSV
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const downloadFilename = filename || `chat-export-${new Date().toISOString().split('T')[0]}.csv`;
    
    triggerDownload(blob, downloadFilename, 'text/csv');
  } catch (error) {
    console.error('Error in CSV export:', error);
    throw error;
  }
};

export const exportChatAsHtml = (messages: Message[], filename?: string): void => {
  try {
    console.log('Exporting as HTML, messages:', messages.length);
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Export - ${new Date().toLocaleDateString()}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
            color: #1e293b;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .message {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .user {
            background: #3b82f6;
            color: white;
            margin-left: 50px;
        }
        .assistant {
            background: white;
            color: #1e293b;
            margin-right: 50px;
        }
        .timestamp {
            font-size: 0.8em;
            opacity: 0.7;
            margin-bottom: 5px;
        }
        .role {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .content {
            line-height: 1.5;
            white-space: pre-wrap;
        }
        .stats {
            background: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Tryit Chat Export</h1>
        <p>Exported on ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="stats">
        <strong>Total Messages:</strong> ${messages.length}<br>
        <strong>User Messages:</strong> ${messages.filter(m => m.role === 'user').length}<br>
        <strong>Assistant Messages:</strong> ${messages.filter(m => m.role === 'assistant').length}
    </div>
    
    ${messages.map(msg => `
        <div class="message ${msg.role}">
            <div class="timestamp">${msg.timestamp.toLocaleString()}</div>
            <div class="role">${msg.role === 'user' ? 'You' : 'Tryit'}</div>
            <div class="content">${msg.content.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const downloadFilename = filename || `chat-export-${new Date().toISOString().split('T')[0]}.html`;
    
    triggerDownload(blob, downloadFilename, 'text/html');
  } catch (error) {
    console.error('Error in HTML export:', error);
    throw error;
  }
}; 