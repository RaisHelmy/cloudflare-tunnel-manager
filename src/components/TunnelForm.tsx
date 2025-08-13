import React, { useState } from 'react';
import { CreateTunnelData } from '../types/tunnel';

interface TunnelFormProps {
  onSubmit: (data: CreateTunnelData) => Promise<void>;
  loading: boolean;
}

export const TunnelForm: React.FC<TunnelFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<CreateTunnelData>({
    name: '',
    serviceType: 'rdp',
    hostname: '',
    localPort: 3389,
    localHost: 'localhost',
    protocol: 'tcp'
  });

  const defaultPorts: Record<string, { port: number; protocol: string }> = {
    rdp: { port: 3389, protocol: 'tcp' },
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
    await onSubmit(formData);
    setFormData({
      name: '',
      serviceType: 'rdp',
      hostname: '',
      localPort: 3389,
      localHost: 'localhost',
      protocol: 'tcp'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Tunnel Record</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
            {loading ? 'Creating...' : 'Create Tunnel Record'}
          </button>
        </div>
      </form>
    </div>
  );
};