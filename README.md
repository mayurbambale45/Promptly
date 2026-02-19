# Promptly - Enterprise AI Architect (Monorepo)

This project is organized into two distinct modules for easy deployment and scaling.

## � Project Structure
- **`/client`**: The React/Vite/Tailwind frontend. Deploy this to Vercel or Netlify.
- **`/server_api`**: The Express/Node.js backend. Deploy this to Render, Heroku, or Vercel (as Serverless Functions).

## 🚀 Quick Start (Local)

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Run Development Mode**:
   ```bash
   npm run dev
   ```
   - Frontend starts on: `http://localhost:5173`
   - Backend starts on: `http://localhost:3000`

## 🌍 Vercel Deployment Instructions

### Frontend (Client)
1. Link your GitHub repo to Vercel.
2. Set the **Root Directory** to `client`.
3. Framework: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.

### Backend (Server API)
1. Use a service like **Render** or **Heroku** for a persistent Node.js server.
2. Set the **Root Directory** to `server_api`.
3. Build Command: `npm install`.
4. Start Command: `node index.js`.

---
Built with ❤️ for the Professional AI Era.
