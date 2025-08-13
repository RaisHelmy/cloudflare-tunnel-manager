import React, { useState, useEffect } from 'react';
import { Tunnel, TunnelCommands } from '../types/tunnel';
import { XMarkIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CommandsModalProps {
  tunnel: Tunnel;
  onClose: () => void;
}

export const CommandsModal: React.FC<CommandsModalProps> = ({ tunnel, onClose }) => {
  const [commands, setCommands] = useState<TunnelCommands | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tunnels/${tunnel.id}/commands`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCommands(data);
        }
      } catch (error) {
        console.error('Failed to fetch commands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommands();
  }, [tunnel.id]);

  const copyToClipboard = async (text: string, commandType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(commandType);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Generated Commands</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Generating commands...</p>
            </div>
          ) : commands ? (
            <div className="space-y-6">
              {/* Configuration Command */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">1. Create Tunnel Configuration</h3>
                  <button
                    onClick={() => copyToClipboard(commands.configCommand, 'config')}
                    className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                  >
                    {copiedCommand === 'config' ? (
                      <CheckIcon className="flex-shrink-0 size-3 text-green-500" />
                    ) : (
                      <ClipboardIcon className="flex-shrink-0 size-3" />
                    )}
                    {copiedCommand === 'config' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>{commands.configCommand}</code>
                </div>
              </div>

              {/* Tunnel Run Command */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">2. Run Tunnel</h3>
                  <button
                    onClick={() => copyToClipboard(commands.runCommand, 'run')}
                    className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                  >
                    {copiedCommand === 'run' ? (
                      <CheckIcon className="flex-shrink-0 size-3 text-green-500" />
                    ) : (
                      <ClipboardIcon className="flex-shrink-0 size-3" />
                    )}
                    {copiedCommand === 'run' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>{commands.runCommand}</code>
                </div>
              </div>

              {/* DNS Record Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="size-4 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                  </div>
                  <div className="ms-3">
                    <h3 className="text-sm font-semibold text-blue-800">DNS Record Required</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Don't forget to create a CNAME record in your DNS settings pointing <strong>{tunnel.hostname}</strong> to your tunnel subdomain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-500">
              Failed to generate commands. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};