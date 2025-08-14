import React, { useState } from 'react';
import { Tunnel, UpdateTunnelData } from '../types/tunnel';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EditTunnelModalProps {
  tunnel: Tunnel;
  onSave: (data: UpdateTunnelData) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

export const EditTunnelModal: React.FC<EditTunnelModalProps> = ({ tunnel, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState<UpdateTunnelData>({
    id: tunnel.id,
    name: tunnel.name,
    serviceType: tunnel.serviceType,
    hostname: tunnel.hostname,
    localPort: tunnel.localPort,
    localHost: tunnel.localHost,
    protocol: tunnel.protocol
  });

  const defaultPorts: Record<string, { port: number; protocol: string }> = {
    rdp: { port: 3389, protocol: 'rdp' },
    ssh: { port: 22, protocol: 'tcp' },
    http: { port: 80, protocol: 'http' },
    https: { port: 443, protocol: 'https' },
    tcp: { port: 8080, protocol: 'tcp' },
    udp: { port: 8080, protocol: 'udp' }
  };

  const handleServiceTypeChange = (serviceType: string) => {
    const defaults = defaultPorts[serviceType];
    setFormData({
      ...formData,
      serviceType,
      localPort: defaults.port,
      protocol: defaults.protocol
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Tunnel Record</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tunnelName" className="block text-sm font-medium text-gray-700 mb-2">
                  Tunnel Name
                </label>
                <input
                  type="text"
                  id="tunnelName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 border"
                  placeholder="my-tunnel"
                  required
                />
              </div>

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => handleServiceTypeChange(e.target.value)}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 border"
                >
                  <option value="rdp">RDP (Remote Desktop)</option>
                  <option value="ssh">SSH</option>
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                  <option value="tcp">TCP</option>
                  <option value="udp">UDP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hostname" className="block text-sm font-medium text-gray-700 mb-2">
                  Hostname
                </label>
                <input
                  type="text"
                  id="hostname"
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 border"
                  placeholder="rdp.example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="localPort" className="block text-sm font-medium text-gray-700 mb-2">
                  Local Port
                </label>
                <input
                  type="number"
                  id="localPort"
                  value={formData.localPort}
                  onChange={(e) => setFormData({ ...formData, localPort: parseInt(e.target.value) })}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 border"
                  placeholder="3389"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="localHost" className="block text-sm font-medium text-gray-700 mb-2">
                  Local Host
                </label>
                <input
                  type="text"
                  id="localHost"
                  value={formData.localHost}
                  onChange={(e) => setFormData({ ...formData, localHost: e.target.value })}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 border"
                  placeholder="localhost"
                />
              </div>

              <div>
                <label htmlFor="protocol" className="block text-sm font-medium text-gray-700 mb-2">
                  Protocol
                </label>
                <select
                  id="protocol"
                  value={formData.protocol}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 border"
                >
                  <option value="rdp">RDP</option>
                  <option value="tcp">TCP</option>
                  <option value="udp">UDP</option>
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};