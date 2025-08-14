import React from 'react';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

interface ChatButtonProps {
  onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 group"
    >
      <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Quick Add Tunnel
      </div>
    </button>
  );
};