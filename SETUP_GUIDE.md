# CHARAK API - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### 2. Clone & Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd charak-api-medical-coding

# One-command setup
npm run setup
```

This will:
- Install all dependencies
- Generate Prisma client
- Create SQLite database
- Seed demo data

### 3. Start the Application

**Option A: Start Everything Together**
```bash
npm run start:all
```

**Option B: Start Separately (Recommended for Development)**

Terminal 1 - API Server:
```bash
npm run server
# Runs on http://localhost:3001
```

Terminal 2 - Frontend:
```bash
npm run dev
# Runs on http://localhost:5173
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001
- **API Docs**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### 5. Demo Login Credentials

**Doctor Account:**
- Username: `demodoctor`
- Password: `123`
- Access: Medical search, patient management, ABHA integration

**Government Account:**
- Username: `GovAgent`
- Password: `123`
- Access: Analytics dashboard, disease trends, EMR reports

---

## 🗄️ Database Management

### View Database (Prisma Studio)
```bash
npm run db:studio
```
Opens GUI at http://localhost:5555

### Reset Database
```bash
npm run db:reset
```
⚠️ Warning: This deletes all data!

### Seed Demo Data
```bash
npm run db:seed
```

---

## 🧪 Testing the API

### Quick Test
```bash
npm run health-check
```

### Complete API Test
```bash
./test-api.sh
```

### Manual API Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demodoctor","password":"123"}'

# Search disorders
curl "http://localhost:3001/api/disorders/search?query=fever"

# Get patient by ABHA
curl "http://localhost:3001/api/patients/abha/12345678901234"
```

---

## 📦 Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run setup` | Complete setup (install + database + seed) |
| `npm run dev` | Start frontend dev server |
| `npm run server` | Start API server |
| `npm run server:dev` | Start API with auto-reload |
| `npm run start:all` | Start both API and frontend |
| `npm run build` | Build for production |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database |
| `npm run db:reset` | Reset database |
| `npm test:db` | Test database connection |

---

## 🏗️ Project Structure

```
charak-api-medical-coding/
├── server.ts                 # Express API server
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Demo data seeding
│   └── dev.db              # SQLite database (auto-generated)
├── src/
│   ├── pages/              # React pages
│   ├── components/         # React components
│   ├── services/           # API client services
│   ├── lib/                # Utilities
│   └── context/            # React context
├── API_DOCUMENTATION.md    # Complete API docs
└── README.md              # Full documentation
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm run server
```

### Database Issues
```bash
# Reset and recreate database
npm run db:reset
npm run db:seed
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run db:generate
```

### API Not Connecting
1. Ensure API server is running on port 3001
2. Check `.env` file exists with `DATABASE_URL`
3. Run `npm run health-check`

---

## 🌐 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create `.env.production`:
```
DATABASE_URL="postgresql://..."  # Use PostgreSQL in production
JWT_SECRET="your-secure-secret-key"
PORT=3001
```

### Deploy Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Render, Heroku, AWS
- **Database**: PostgreSQL (Supabase, Neon, etc.)

---

## 📚 Learning Resources

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [README](./README.md) - Full project documentation
- [Prisma Docs](https://www.prisma.io/docs) - Database ORM
- [React Docs](https://react.dev) - Frontend framework
- [Express Docs](https://expressjs.com) - Backend framework

---

## 🆘 Support

### Common Issues
1. **Database locked**: Stop all servers and restart
2. **Module not found**: Run `npm install`
3. **API errors**: Check server logs in terminal
4. **Port conflicts**: Change ports in `.env` and config

### Getting Help
1. Check error messages in terminal
2. Review API docs for endpoint usage
3. Use Prisma Studio to inspect database
4. Run `./test-api.sh` to verify API

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Database created (`npm run db:push`)
- [ ] Demo data seeded (`npm run db:seed`)
- [ ] API server running (`npm run server`)
- [ ] Frontend running (`npm run dev`)
- [ ] Can login with demo credentials
- [ ] API health check passes
- [ ] Database test passes

---

**You're all set! 🎉**

Start building with CHARAK API - the comprehensive medical coding system bridging traditional Ayurvedic medicine with modern healthcare standards.
