# CHARAK API - Quick Testing Checklist ✅

## 🚀 Essential Commands to Check Everything

### 1. Quick Health Check (Fastest)
```bash
npm run test:quick
```
**Checks**: Node.js, dependencies, database connection

### 2. Complete System Check  
```bash
npm run health-check
```
**Checks**: All components, APIs, frontend, backend

### 3. Database Only
```bash
npm run test:db
```
**Checks**: Database connection, users, disorders, patients, analytics

---

## 📋 Manual Testing Checklist

### Prerequisites ✅
- [ ] Node.js v18+ installed (`node --version`)
- [ ] NPM installed (`npm --version`)
- [ ] Dependencies installed (`npm install`)

### Database Testing ✅
- [ ] Generate Prisma client: `npm run db:generate`
- [ ] Push schema: `npm run db:push`
- [ ] Seed data: `npm run db:seed`
- [ ] Test connection: `npm run test:db`
- [ ] Open GUI: `npm run db:studio` → http://localhost:5555

### Backend API Testing ✅
- [ ] Start server: `npm run server` → http://localhost:3000
- [ ] Health check: `GET /api/health`
- [ ] Database status: `GET /api/db-test`
- [ ] Login test: `POST /api/auth/login` (demodoctor/123)
- [ ] Disorders: `GET /api/disorders`
- [ ] Patients: `GET /api/patients`
- [ ] Analytics: `GET /api/analytics`

### Frontend Testing ✅  
- [ ] Start app: `npm run dev` → http://localhost:3001
- [ ] Login as Doctor: demodoctor/123
- [ ] Login as Government: GovAgent/123
- [ ] Test medical search: "anxiety", "asthma"
- [ ] Test Sanskrit search: "चित्तोद्वेग", "श्वास रोग"
- [ ] Test patient lookup: ABHA ID 12345678901234
- [ ] Navigate between dashboards
- [ ] Check API documentation tab

### Code Quality ✅
- [ ] TypeScript check: `npx tsc --noEmit`
- [ ] Linting: `npm run lint`
- [ ] Build test: `npm run build`

---

## 🔧 PowerShell API Testing Commands

### Test Backend Health
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
```

### Test Authentication
```powershell
$body = @{
    username = "demodoctor"
    password = "123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

### Test Medical Search
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/disorders?search=anxiety" -Method Get
```

### Test Patient Data
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/patients?abhaId=12345678901234" -Method Get
```

---

## 🎯 Expected Test Results

### Database (npm run test:db)
```
✅ Database Connected Successfully!
   Users: 2
   Disorders: 10
   Patients: 3

✅ Test user found:
   Username: demodoctor
   Role: DOCTOR
   Email: doctor@charak.health

✅ Found 5 disorders:
   1. Anxiety (6B00)
      Sanskrit: Chittodvega
   2. Arthritis (FB30)
      Sanskrit: Sandhivata
   ...

✅ All tests completed!
```

### API Health Check
```json
{
  "status": "OK",
  "message": "CHARAK API Backend is running",
  "timestamp": "2025-09-29T..."
}
```

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "username": "demodoctor",
    "role": "DOCTOR",
    "email": "doctor@charak.health"
  }
}
```

---

## 🚨 Troubleshooting Quick Fixes

### Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run server
```

### Database Connection Failed
```bash
npm run db:push
npm run db:seed
```

### TypeScript Errors
```bash
npm run db:generate
npx tsc --noEmit
```

### Frontend Won't Start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📱 Browser Testing URLs

- **Frontend**: http://localhost:3001
- **Backend Health**: http://localhost:3000/api/health  
- **Database GUI**: http://localhost:5555
- **API Docs**: http://localhost:3001 → API Docs tab

## 🔑 Test Credentials

- **Doctor**: demodoctor / 123
- **Government**: GovAgent / 123

## 📊 Success Indicators

✅ **Green checkmarks** in terminal output  
✅ **No TypeScript errors**  
✅ **APIs responding with 200 status**  
✅ **Frontend loading without console errors**  
✅ **Login working with valid tokens**  
✅ **Database queries returning data**  

---

*Quick Reference: Save this file for instant access to all testing commands! 🎯*