import React, { useState, useEffect } from 'react';
import { Tunnel, TunnelCommands } from '../types/tunnel';
import { TrashIcon, PencilIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TunnelListProps {
  tunnels: Tunnel[];
  onDelete: (id: string) => void;
  onEdit: (tunnel: Tunnel) => void;
}

export const TunnelList: React.FC<TunnelListProps> = ({ tunnels, onDelete, onEdit }) => {
  const [commands, setCommands] = useState<Record<string, TunnelCommands>>({});
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  useEffect(() => {
    // Fetch commands for ALL tunnels
    const fetchAllCommands = async () => {
      for (const tunnel of tunnels) {
        if (!commands[tunnel.id]) {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/tunnels/${tunnel.id}/commands`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              setCommands(prev => ({
                ...prev,
                [tunnel.id]: data
              }));
            }
          } catch (error) {
            console.error('Failed to fetch commands for tunnel:', tunnel.id, error);
          }
        }
      }
    };

    fetchAllCommands();
  }, [tunnels, commands]);

  const copyToClipboard = async (text: string, commandId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(commandId);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const isRDPTunnel = (tunnel: Tunnel) => tunnel.serviceType === 'rdp' || tunnel.protocol === 'rdp';
  const isTCPTunnel = (tunnel: Tunnel) => tunnel.serviceType === 'tcp' || tunnel.protocol === 'tcp';
  const isAccessTunnel = (tunnel: Tunnel) => isRDPTunnel(tunnel) || isTCPTunnel(tunnel);
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
          <div key={tunnel.id} className="p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-between">
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
                  onClick={() => onEdit(tunnel)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onDelete(tunnel.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Command Display for ALL tunnels */}
            {commands[tunnel.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  {/* Config Command */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-medium text-gray-700">1. Create Tunnel Configuration</h4>
                      <button
                        onClick={() => copyToClipboard(commands[tunnel.id].configCommand, `${tunnel.id}-config`)}
                        className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                      >
                        {copiedCommand === `${tunnel.id}-config` ? (
                          <CheckIcon className="flex-shrink-0 size-3 text-green-500" />
                        ) : (
                          <ClipboardIcon className="flex-shrink-0 size-3" />
                        )}
                        {copiedCommand === `${tunnel.id}-config` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                      <code>{commands[tunnel.id].configCommand}</code>
                    </div>
                  </div>

                  {/* Run/Access Command */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-medium text-gray-700">
                        {isRDPTunnel(tunnel) ? '2. Start RDP Access' : 
                         isTCPTunnel(tunnel) ? '2. Start TCP Access' : '2. Run Tunnel'}
                      </h4>
                      <button
                        onClick={() => copyToClipboard(commands[tunnel.id].runCommand, `${tunnel.id}-run`)}
                        className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                      >
                        {copiedCommand === `${tunnel.id}-run` ? (
                          <CheckIcon className="flex-shrink-0 size-3 text-green-500" />
                        ) : (
                          <ClipboardIcon className="flex-shrink-0 size-3" />
                        )}
                        {copiedCommand === `${tunnel.id}-run` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                      <code>{commands[tunnel.id].runCommand}</code>
                    </div>
                  </div>

                  {/* Setup Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="size-4 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                        </svg>
                      </div>
                      <div className="ms-3">
                        {isAccessTunnel(tunnel) ? (
                          <>
                            <h5 className="text-xs font-semibold text-blue-800">Setup Required</h5>
                            <p className="text-xs text-blue-700 mt-1">
                              1. Add <strong>{tunnel.hostname}</strong> to your Cloudflare Access application<br/>
                              2. Configure your {isRDPTunnel(tunnel) ? 'RDP' : 'TCP'} client to connect to <strong>{tunnel.hostname}</strong>
                            </p>
                          </>
                        ) : (
                          <>
                            <h5 className="text-xs font-semibold text-blue-800">DNS Record Required</h5>
                            <p className="text-xs text-blue-700 mt-1">
                              Don't forget to create a CNAME record in your DNS settings pointing <strong>{tunnel.hostname}</strong> to your tunnel subdomain.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};