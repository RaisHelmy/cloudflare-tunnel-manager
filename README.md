# Cloudflare Tunnel Manager

A React-based web application for managing Cloudflare tunnel records with user authentication. Users can sign up, create tunnel configurations, and generate the exact cloudflared commands needed to set up their tunnels.

## ✨ Features

- **User Authentication**: Secure signup/signin with JWT tokens
- **Tunnel Management**: Create, view, and delete tunnel records
- **Command Generation**: Automatically generate cloudflared commands
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Secure Backend**: Express.js API with SQLite database using Prisma ORM

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm

### Installation

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

1. **Sign Up/Sign In**: Create an account or log in
2. **Create Tunnel**: Fill out the tunnel configuration form
3. **Generate Commands**: Click "View Commands" on any tunnel record
4. **Copy Commands**: Use the copy buttons to get the cloudflared commands
5. **Run Cloudflare Tunnel**: Execute the generated commands in your terminal

## 🔧 Development Notes

- Backend uses `--transpile-only` flag for faster TypeScript compilation
- Frontend includes hot reloading and proxies API requests to backend
- Database models are automatically synced with Prisma

## 📦 Production Deployment

1. Build the React app: `npm run build`
2. Serve the built files and run the backend server
3. Configure environment variables for production
4. Set up a production database (PostgreSQL/MySQL recommended)
