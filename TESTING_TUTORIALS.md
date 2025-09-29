# CHARAK API - Complete Testing & Usage Tutorials

## 🎯 Quick Start Guide

### Prerequisites Check
```bash
# Verify Node.js installation
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher

# Navigate to project directory
cd "c:\Users\rsneg\Desktop\Code projects\Personal Projects\charak api using claude sonnet"

# Install dependencies (if not already done)
npm install
```

## 📊 Tutorial 1: Database Setup & Testing

### Step 1: Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with test data
npm run db:seed
```

### Step 2: Test Database Connection
```bash
# Run comprehensive database tests
npm run test:db

# Test specific components
tsx test-db.ts --connection    # Database connection only
tsx test-db.ts --auth         # Authentication only
```

### Step 3: Open Database GUI
```bash
# Launch Prisma Studio (Visual Database Manager)
npm run db:studio
# Opens at: http://localhost:5555
```

**Expected Output:**
- ✅ 2 users (demodoctor, GovAgent)
- ✅ 10 medical disorders with dual English/Sanskrit names
- ✅ 3 demo patients with medical history
- ✅ Analytics data with trend information

## 🖥️ Tutorial 2: Backend API Testing

### Step 1: Start Backend Server
```bash
# Start Express API server
npm run server
# Server runs at: http://localhost:3000
```

### Step 2: Test API Endpoints

#### Health Check
```bash
# PowerShell method
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get

# Expected response:
{
  "status": "OK",
  "message": "CHARAK API Backend is running",
  "timestamp": "2025-09-29T..."
}
```

#### Database Status
```bash
Invoke-RestMethod -Uri "http://localhost:3000/api/db-test" -Method Get

# Expected response:
{
  "status": "Database Connected",
  "stats": {
    "users": 2,
    "disorders": 10,
    "patients": 3
  }
}
```

#### Authentication Test
```bash
# Test login endpoint
$body = @{
    username = "demodoctor"
    password = "123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"

# Expected response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "username": "demodoctor",
    "role": "DOCTOR",
    "email": "doctor@charak.health"
  }
}
```

#### Medical Disorders Search
```bash
# Search all disorders
Invoke-RestMethod -Uri "http://localhost:3000/api/disorders" -Method Get

# Search specific disorder
Invoke-RestMethod -Uri "http://localhost:3000/api/disorders?search=anxiety" -Method Get
```

#### Patient Data
```bash
# Get all patients
Invoke-RestMethod -Uri "http://localhost:3000/api/patients" -Method Get

# Get specific patient by ABHA ID
Invoke-RestMethod -Uri "http://localhost:3000/api/patients?abhaId=12345678901234" -Method Get
```

#### Analytics Data
```bash
# Get analytics
Invoke-RestMethod -Uri "http://localhost:3000/api/analytics" -Method Get
```

## 🎨 Tutorial 3: Frontend Application Testing

### Step 1: Start Frontend
```bash
# Start React development server
npm run dev
# Opens at: http://localhost:3001 (or next available port)
```

### Step 2: Test User Interface

#### Login Testing
1. **Navigate to**: `http://localhost:3001`
2. **Doctor Login**:
   - Username: `demodoctor`
   - Password: `123`
3. **Government Login**:
   - Username: `GovAgent`  
   - Password: `123`

#### Doctor Dashboard Features
- **Medical Search**: Try searching "anxiety", "asthma", "स्वास" (Sanskrit)
- **ABHA Patient Lookup**: Enter ABHA ID `12345678901234`
- **Dual Language**: Toggle between English/Sanskrit medical terms
- **Diagnosis Addition**: Add disorders to patient diagnosis
- **Medical History**: View patient medical records

#### Government Dashboard Features
- **Disease Analytics**: Search for disease trends
- **Vata Imbalance Reports**: View traditional medicine analytics  
- **Interactive Charts**: Disease distribution and trends
- **Population Health**: Regional health statistics

#### API Documentation
- **Navigate to**: API Docs tab in application
- **Interactive Examples**: Test API endpoints directly
- **Authentication Guide**: JWT token usage examples

## 🔧 Tutorial 4: Development Workflow

### File Structure Check
```
charak-api/
├── src/
│   ├── components/     # React UI components
│   ├── pages/         # Main application pages
│   ├── services/      # API service layer
│   ├── context/       # React context providers
│   └── lib/           # Utility libraries
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── seed.ts        # Database seeding
├── server.ts          # Express backend server
└── test-db.ts         # Database testing utilities
```

### Code Quality Check
```bash
# TypeScript compilation check
npx tsc --noEmit

# ESLint code quality
npm run lint

# Run all tests
npm run test:db
```

### Database Management
```bash
# Reset database (caution: deletes all data)
npm run db:reset

# Re-seed with fresh data
npm run db:seed

# View database schema
npx prisma db pull
```

## 🧪 Tutorial 5: Advanced Testing Scenarios

### Testing Medical Search Functionality
1. **English Terms**: "diabetes", "hypertension", "arthritis"
2. **Sanskrit Terms**: "मधुमेह", "रक्तचाप", "संधिवात" 
3. **ICD-11 Codes**: "5A14", "BA00", "FB30"
4. **Partial Matches**: "anx" should find "Anxiety"

### Testing Patient Management
1. **Valid ABHA IDs**: 
   - `12345678901234` (Priya Patel)
   - `98765432109876` (Rahul Singh)  
   - `11223344556677` (Anjali Reddy)
2. **Add Diagnoses**: Search → Select → Add to patient
3. **Medical History**: View past diagnoses and treatments

### Testing Authentication & Authorization
1. **Role-Based Access**: 
   - Doctor → Medical search & patient management
   - Government → Analytics & population health data
2. **Token Validation**: API requests require valid JWT
3. **Session Management**: Logout and re-login functionality

## 📱 Tutorial 6: Browser Testing Checklist

### Cross-Browser Compatibility
- ✅ Chrome/Edge (Primary)
- ✅ Firefox 
- ✅ Safari (Mac users)

### Responsive Design Testing  
- ✅ Desktop (1920x1080)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

### Performance Testing
1. **Load Time**: Initial page load < 3 seconds
2. **Search Response**: Medical search < 1 second  
3. **API Response**: Backend endpoints < 500ms
4. **Memory Usage**: No memory leaks during extended use

## 🐛 Troubleshooting Guide

### Common Issues & Solutions

#### Database Connection Failed
```bash
# Check database file exists
ls -la dev.db

# Regenerate database
npm run db:push
npm run db:seed
```

#### Backend Server Won't Start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <process_id> /F

# Or use different port
PORT=3001 npm run server
```

#### Frontend Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### TypeScript Errors
```bash
# Check current errors
npx tsc --noEmit

# Regenerate Prisma types
npm run db:generate
```

## 🚀 Production Deployment Checklist

### Pre-Deployment
- [ ] All tests passing: `npm run test:db`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Database schema finalized: `npm run db:push`
- [ ] Environment variables configured
- [ ] Security review completed

### Performance Optimization
- [ ] Frontend build: `npm run build`
- [ ] Database indexes optimized
- [ ] API rate limiting implemented
- [ ] Error monitoring setup

## 📚 Additional Resources

### API Documentation
- **Swagger/OpenAPI**: Available in app at `/api/docs`
- **Postman Collection**: Import API endpoints for testing
- **cURL Examples**: Command-line API testing

### Development Tools
- **Prisma Studio**: Visual database management
- **React DevTools**: Component debugging
- **Redux DevTools**: State management (if applicable)
- **Network Tab**: API request monitoring

### Learning Resources
- **Prisma Docs**: https://prisma.io/docs
- **React TypeScript**: https://react-typescript-cheatsheet.netlify.app
- **Express.js**: https://expressjs.com/guide
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🎯 Quick Command Reference

```bash
# Database
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema changes  
npm run db:seed       # Seed test data
npm run db:studio     # Open database GUI
npm run test:db       # Test database

# Development
npm run dev          # Start frontend
npm run server       # Start backend  
npm run server:dev   # Start backend with auto-reload
npm run build        # Build for production

# Code Quality  
npm run lint         # ESLint check
npx tsc --noEmit    # TypeScript check
```

Happy testing! 🎉
