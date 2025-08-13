import React from 'react';
import { Tunnel } from '../types/tunnel';
import { TrashIcon } from '@heroicons/react/24/outline';

interface TunnelListProps {
  tunnels: Tunnel[];
  onDelete: (id: string) => void;
  onShowCommands: (tunnel: Tunnel) => void;
}

export const TunnelList: React.FC<TunnelListProps> = ({ tunnels, onDelete, onShowCommands }) => {
  if (tunnels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Tunnel Records</h2>
        <div className="text-gray-500 text-center py-8">
          No tunnel records created yet. Create your first tunnel above!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Tunnel Records</h2>
      <div className="space-y-3">
        {tunnels.map((tunnel) => (
          <div key={tunnel.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{tunnel.name}</h3>
                <p className="text-sm text-gray-500">{tunnel.hostname} → {tunnel.localHost}:{tunnel.localPort}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {tunnel.serviceType.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {tunnel.protocol.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onShowCommands(tunnel)}
                className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
              >
                View Commands
              </button>
              <button 
                onClick={() => onDelete(tunnel.id)}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};