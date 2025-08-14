import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { CreateTunnelData } from '../types/tunnel';

interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

interface ChatTerminalProps {
  onClose: () => void;
  onCreateTunnel: (data: CreateTunnelData) => Promise<void>;
}

export const ChatTerminal: React.FC<ChatTerminalProps> = ({ onClose, onCreateTunnel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Tunnel Terminal! Type "help" for available commands.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addMessage = (type: ChatMessage['type'], content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const parseCommand = (command: string): CreateTunnelData | null => {
    const parts = command.trim().split(' ');
    
    if (parts[0] !== 'create') return null;

    const args: Record<string, string> = {};
    for (let i = 1; i < parts.length; i += 2) {
      if (parts[i].startsWith('--')) {
        const key = parts[i].substring(2);
        const value = parts[i + 1];
        if (value) args[key] = value;
      }
    }

    const serviceType = args.type || args.service || 'http';
    const defaultPorts: Record<string, { port: number; protocol: string }> = {
      rdp: { port: 3389, protocol: 'rdp' },
      ssh: { port: 22, protocol: 'tcp' },
      http: { port: 80, protocol: 'http' },
      https: { port: 443, protocol: 'https' },
      tcp: { port: 8080, protocol: 'tcp' },
      udp: { port: 8080, protocol: 'udp' }
    };

    const defaults = defaultPorts[serviceType] || { port: 8080, protocol: 'http' };

    if (!args.name || !args.hostname) {
      return null;
    }

    return {
      name: args.name,
      serviceType,
      hostname: args.hostname,
      localPort: parseInt(args.port) || defaults.port,
      localHost: args.host || 'localhost',
      protocol: args.protocol || defaults.protocol
    };
  };

  const handleCommand = async (command: string) => {
    setIsProcessing(true);
    addMessage('user', `$ ${command}`);

    const cmd = command.trim().toLowerCase();

    if (cmd === 'help') {
      addMessage('system', `Available commands:
• help - Show this help message
• create --name <name> --hostname <hostname> [options] - Create a new tunnel
• clear - Clear terminal

Create tunnel options:
--name <name>        Tunnel name (required)
--hostname <host>    Public hostname (required)
--type <type>        Service type (rdp, ssh, http, https, tcp, udp)
--port <port>        Local port number
--host <host>        Local host (default: localhost)
--protocol <proto>   Protocol override

Examples:
$ create --name rdp-server --hostname rdp.example.com --type rdp
$ create --name web-app --hostname app.example.com --type http --port 3000
$ create --name ssh-server --hostname ssh.example.com --type ssh --port 2222`);
    } else if (cmd === 'clear') {
      setMessages([{
        id: Date.now().toString(),
        type: 'system',
        content: 'Terminal cleared. Type "help" for available commands.',
        timestamp: new Date()
      }]);
    } else if (command.startsWith('create ')) {
      const tunnelData = parseCommand(command);
      
      if (!tunnelData) {
        addMessage('error', 'Invalid command syntax. Use: create --name <name> --hostname <hostname> [options]');
      } else {
        try {
          await onCreateTunnel(tunnelData);
          addMessage('success', `✓ Tunnel "${tunnelData.name}" created successfully!`);
          addMessage('system', 'You can close this terminal or create another tunnel.');
        } catch (error) {
          addMessage('error', 'Failed to create tunnel. Please check your input and try again.');
        }
      }
    } else if (cmd === '') {
      // Empty command, do nothing
    } else {
      addMessage('error', `Unknown command: ${command}. Type "help" for available commands.`);
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  const getMessageStyle = (type: ChatMessage['type']) => {
    switch (type) {
      case 'user':
        return 'text-green-400';
      case 'system':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-300';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-300 text-sm font-mono ml-2">tunnel-terminal</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-900 font-mono text-sm">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${getMessageStyle(message.type)}`}>
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        ))}
        {isProcessing && (
          <div className="text-yellow-400 mb-2">
            <span className="animate-pulse">Processing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <span className="text-green-400 font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-gray-300 font-mono outline-none placeholder-gray-500"
            placeholder="Type a command..."
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};