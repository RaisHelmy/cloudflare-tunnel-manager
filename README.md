# Cloudflare Tunnel Manager

A React-based web application for managing Cloudflare tunnel records with user authentication. Users can sign up, create tunnel configurations, and generate the exact cloudflared commands needed to set up their tunnels.

## ✨ Features

- **User Authentication**: Secure signup/signin with JWT tokens
- **Tunnel Management**: Create, edit, view, and delete tunnel records
- **Terminal Chat Interface**: Quick tunnel creation via floating terminal popup
- **Command Generation**: Automatically generate cloudflared commands for all tunnel types
- **Inline Commands**: View and copy commands directly from tunnel listings
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Secure Backend**: Express.js API with SQLite database using Prisma ORM
- **Docker Support**: Containerized deployment with Docker Compose

## 🚀 Quick Start

### Option 1: Docker (Recommended)

**Using Docker Compose:**
```bash
# Clone the repository
git clone <repository-url>
cd cloudflare-tunnel-manager

# Start with Docker Compose
docker-compose up -d

# Access the application
open http://localhost:3001
```

**Using Docker Hub Image:**
```bash
# Run the pre-built image from Docker Hub
docker run -d \
  --name cloudflare-tunnel-manager \
  -p 3001:3001 \
  -v tunnel_data:/app/data \
  -e JWT_SECRET=your-super-secret-jwt-key-change-this \
  raishelmy/cloudflare-tunnel-manager:latest

# Access the application
open http://localhost:3001
```

### Option 2: Local Development

**Prerequisites:**
- Node.js 16+ 
- npm

**Installation:**

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up the database:**
   ```bash
   npm run db:push
   npm run db:generate
   ```

3. **Start the development servers:**
   ```bash
   # Option 1: Run both servers with one command
   npm run dev
   
   # Option 2: Run servers separately
   # Terminal 1 - Backend API (port 3001)
   npm run server
   
   # Terminal 2 - React frontend (use custom port if 3000 is busy)
   PORT=3002 npm start
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3002 (or 3000 if available)
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
├── backend/               # Express.js backend
│   ├── middleware/       # Authentication middleware
│   ├── routes/          # API routes (auth, tunnels)
│   ├── utils/           # Database & auth utilities
│   └── server.ts        # Main server file
├── src/                 # React frontend
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
├── prisma/             # Database schema
└── public/             # Static assets
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login

### Tunnels (Protected)
- `GET /api/tunnels` - Get user's tunnel records
- `POST /api/tunnels` - Create new tunnel record
- `DELETE /api/tunnels/:id` - Delete tunnel record
- `GET /api/tunnels/:id/commands` - Generate cloudflared commands

## 🛠 Available Scripts

- `npm start` - Start React development server
- `npm run server` - Start backend API server
- `npm run dev` - Start both servers concurrently
- `npm run build` - Build React app for production
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate Prisma client

## 💾 Database

The application uses SQLite with Prisma ORM. The database file is created as `dev.db` in the project root.

### Models:
- **User**: User accounts with email/password authentication
- **Tunnel**: Tunnel configuration records linked to users

## 🎨 UI Components

Built with:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Heroicons** for icons

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation

## 🚇 Tunnel Types Supported

- **RDP** (Remote Desktop Protocol)
- **SSH** (Secure Shell)
- **HTTP/HTTPS** (Web services)
- **TCP/UDP** (Custom protocols)

## 📝 Environment Variables

The `.env` file is already configured with:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## 🌐 Usage

### Web Interface
1. **Sign Up/Sign In**: Create an account or log in
2. **Create Tunnel**: Fill out the tunnel configuration form
3. **View Commands**: Commands are displayed inline for each tunnel record
4. **Copy Commands**: Use the copy buttons to get the cloudflared commands
5. **Edit/Delete**: Use the pencil/trash icons to manage tunnel records

### Terminal Chat Interface
1. **Click the Chat Button**: Blue floating chat button in the bottom-right corner
2. **Type Commands**: Use terminal-style commands to create tunnels quickly
3. **Available Commands**:
   - `help` - Show available commands and examples
   - `clear` - Clear terminal history
   - `create --name <name> --hostname <hostname> [options]` - Create tunnels

**Terminal Examples:**
```bash
# Create an RDP tunnel
$ create --name rdp-server --hostname rdp.example.com --type rdp

# Create a web application tunnel
$ create --name web-app --hostname app.example.com --type http --port 3000

# Create an SSH tunnel
$ create --name ssh-server --hostname ssh.example.com --type ssh --port 2222
```

### Generated Commands
The application generates appropriate commands for each tunnel type:
- **RDP**: `cloudflared access rdp --hostname hostname --url rdp://localhost:port`
- **TCP**: `cloudflared access tcp --hostname hostname --url localhost:port`
- **Standard**: `cloudflared tunnel --hostname hostname run name --url protocol://localhost:port`

## 🔧 Development Notes

- Backend uses `--transpile-only` flag for faster TypeScript compilation
- Frontend includes hot reloading and proxies API requests to backend
- Database models are automatically synced with Prisma

## 📦 Production Deployment

### Docker Deployment (Recommended)

**Environment Variables for Production:**
```bash
# Create .env file or export variables
export JWT_SECRET="your-super-secure-jwt-secret-key"
export DATABASE_URL="file:/app/data/production.db"
export NODE_ENV="production"
```

**Docker Compose Production Setup:**
```yaml
version: '3.8'
services:
  cloudflare-tunnel-manager:
    image: raishelmy/cloudflare-tunnel-manager:latest
    ports:
      - "80:3001"
    volumes:
      - tunnel_data:/app/data
      - ./backups:/app/backups
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=file:/app/data/production.db
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  tunnel_data:
```

### Manual Deployment

1. Build the React app: `npm run build`
2. Serve the built files and run the backend server
3. Configure environment variables for production
4. Set up a production database (PostgreSQL/MySQL recommended)

## 🐳 Docker Information

### Available Images
- **Docker Hub**: `raishelmy/cloudflare-tunnel-manager:latest` ✅ **READY FOR PRODUCTION**
- **Multi-architecture**: ✅ Supports both AMD64 and ARM64
- **Auto Database Setup**: ✅ Automatically initializes SQLite database on first run
- **Versioned**: `raishelmy/cloudflare-tunnel-manager:v1.2` (latest with database auto-init)

### Building Locally
```bash
# Single platform build
docker build -t cloudflare-tunnel-manager:latest .

# Multi-platform build (requires buildx)
docker buildx build --platform linux/amd64,linux/arm64 -t cloudflare-tunnel-manager:latest .

# Run locally
docker run -p 3001:3001 cloudflare-tunnel-manager:latest
```

### Image Details
- **Base Image**: node:18-alpine (lightweight Alpine Linux)
- **Architecture Support**: AMD64 (x86_64) + ARM64 (Apple Silicon, ARM servers)
- **Size**: Optimized multi-stage build (~200MB compressed)
- **Security**: Non-root user, health checks included
- **Data Persistence**: SQLite database stored in `/app/data`

### Health Check
The container includes a health check endpoint at `/api/health` that monitors application status.
