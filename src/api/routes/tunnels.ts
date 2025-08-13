import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../../utils/database';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get all tunnels for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const tunnels = await prisma.tunnel.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tunnels);
  } catch (error) {
    console.error('Get tunnels error:', error);
    res.status(500).json({ error: 'Failed to fetch tunnels' });
  }
});

// Create new tunnel
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, serviceType, hostname, localPort, localHost, protocol } = req.body;

    if (!name || !serviceType || !hostname || !localPort || !localHost || !protocol) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const tunnel = await prisma.tunnel.create({
      data: {
        name,
        serviceType,
        hostname,
        localPort: parseInt(localPort),
        localHost,
        protocol,
        userId: req.user.userId
      }
    });

    res.status(201).json(tunnel);
  } catch (error) {
    console.error('Create tunnel error:', error);
    res.status(500).json({ error: 'Failed to create tunnel' });
  }
});

// Delete tunnel
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if tunnel belongs to user
    const tunnel = await prisma.tunnel.findFirst({
      where: { 
        id,
        userId: req.user.userId 
      }
    });

    if (!tunnel) {
      return res.status(404).json({ error: 'Tunnel not found' });
    }

    await prisma.tunnel.delete({
      where: { id }
    });

    res.json({ message: 'Tunnel deleted successfully' });
  } catch (error) {
    console.error('Delete tunnel error:', error);
    res.status(500).json({ error: 'Failed to delete tunnel' });
  }
});

// Generate commands for tunnel
router.get('/:id/commands', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const tunnel = await prisma.tunnel.findFirst({
      where: { 
        id,
        userId: req.user.userId 
      }
    });

    if (!tunnel) {
      return res.status(404).json({ error: 'Tunnel not found' });
    }

    const configCommand = `cloudflared tunnel create ${tunnel.name}`;
    
    let service;
    if (tunnel.protocol === 'http' || tunnel.protocol === 'https') {
      service = `${tunnel.protocol}://${tunnel.localHost}:${tunnel.localPort}`;
    } else {
      service = `${tunnel.protocol}://${tunnel.localHost}:${tunnel.localPort}`;
    }
    
    const runCommand = `cloudflared tunnel --hostname ${tunnel.hostname} run ${tunnel.name} --url ${service}`;

    res.json({
      configCommand,
      runCommand
    });
  } catch (error) {
    console.error('Generate commands error:', error);
    res.status(500).json({ error: 'Failed to generate commands' });
  }
});

export default router;