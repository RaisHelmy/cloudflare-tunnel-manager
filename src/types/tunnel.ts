export interface Tunnel {
  id: string;
  name: string;
  serviceType: string;
  hostname: string;
  localPort: number;
  localHost: string;
  protocol: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTunnelData {
  name: string;
  serviceType: string;
  hostname: string;
  localPort: number;
  localHost: string;
  protocol: string;
}

export interface UpdateTunnelData extends CreateTunnelData {
  id: string;
}

export interface TunnelCommands {
  configCommand: string;
  runCommand: string;
}