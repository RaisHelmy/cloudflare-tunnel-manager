import React, { useState, useEffect } from 'react';
import { AuthContext, useAuthState } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { Layout } from './components/Layout';
import { TunnelForm } from './components/TunnelForm';
import { TunnelList } from './components/TunnelList';
import { CommandsModal } from './components/CommandsModal';
import { Tunnel, CreateTunnelData } from './types/tunnel';

function App() {
  const auth = useAuthState();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [tunnels, setTunnels] = useState<Tunnel[]>([]);
  const [selectedTunnel, setSelectedTunnel] = useState<Tunnel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.user) {
      fetchTunnels();
    }
  }, [auth.user]);

  const fetchTunnels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tunnels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTunnels(data);
      }
    } catch (error) {
      console.error('Failed to fetch tunnels:', error);
    }
  };

  const handleCreateTunnel = async (data: CreateTunnelData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tunnels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const newTunnel = await response.json();
        setTunnels([newTunnel, ...tunnels]);
        setSelectedTunnel(newTunnel);
      }
    } catch (error) {
      console.error('Failed to create tunnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTunnel = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tunnels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTunnels(tunnels.filter(tunnel => tunnel.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete tunnel:', error);
    }
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <AuthContext.Provider value={auth}>
        <AuthForm
          mode={authMode}
          onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <Layout>
        <TunnelForm onSubmit={handleCreateTunnel} loading={loading} />
        <TunnelList
          tunnels={tunnels}
          onDelete={handleDeleteTunnel}
          onShowCommands={setSelectedTunnel}
        />
        {selectedTunnel && (
          <CommandsModal
            tunnel={selectedTunnel}
            onClose={() => setSelectedTunnel(null)}
          />
        )}
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
