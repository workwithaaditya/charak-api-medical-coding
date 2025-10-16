# 🚀 CHARAK API - Complete Setup & Usage Guide

## ✅ Enhanced Integration Complete!

Your CHARAK API medical coding system now has **full backend integration** with comprehensive CRUD operations, authentication, and database management.

## 🎯 Quick Start Commands

### **1. Start All Services**
```bash
# Terminal 1: Install dependencies (if not done)
npm install

# Terminal 2: Start Backend API Server
npm run server

# Terminal 3: Start Frontend Development Server  
npm run dev

# Terminal 4: Open Prisma Studio (Database Management)
npm run db:studio
```

### **2. Alternative: Single Command Setup**
```bash
# Install dependencies and start everything
npm install && npm run server & npm run dev & npm run db:studio
```

## 🔗 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend App** | http://localhost:5173 | React application with login portal |
| **Backend API** | http://localhost:3000 | Express.js REST API server |
| **Prisma Studio** | http://localhost:5555 | Visual database management |
| **API Health** | http://localhost:3000/api/health | Backend health check |
| **Database Test** | http://localhost:3000/api/db-test | Database connection test |

## 🔑 Login Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Doctor** | `demodoctor` | `123` | Medical search, patient management |
| **Government** | `GovAgent` | `123` | Analytics, reports, data management |
| **Admin** | *Create via API* | *Custom* | Full system administration |

## 🛠️ Enhanced Features Now Available

### **🔥 NEW: Full CRUD Operations**

#### **User Management**
- ✅ Create new users (Doctor/Government/Admin roles)
- ✅ View all users with details
- ✅ Edit user information
- ✅ Delete users
- ✅ Role-based permissions

#### **Disorder Management**  
- ✅ Add new medical disorders
- ✅ Edit existing disorders
- ✅ Delete disorders
- ✅ Search by English/Sanskrit names
- ✅ ICD-11 and NAMASTE coding support
- ✅ Category-based filtering

#### **Patient Management**
- ✅ Create patient records with ABHA ID
- ✅ Update patient information
- ✅ Delete patient records
- ✅ Search by name, ABHA ID, contact details
- ✅ Medical history tracking
- ✅ Diagnosis management

### **🔥 NEW: Advanced API Endpoints**

#### **Authentication**
```http
POST /api/auth/login - User login with JWT tokens
```

#### **Users**
```http
GET    /api/users        - List all users
POST   /api/users        - Create new user
DELETE /api/users/:id    - Delete user
```

#### **Disorders**
```http
GET    /api/disorders              - List disorders (with search/pagination)
POST   /api/disorders              - Create new disorder
PUT    /api/disorders/:id          - Update disorder
DELETE /api/disorders/:id          - Delete disorder
```

#### **Patients**
```http
GET    /api/patients               - List patients (with search/pagination)
POST   /api/patients               - Create new patient
PUT    /api/patients/:id           - Update patient
DELETE /api/patients/:id           - Delete patient
POST   /api/patients/:id/diagnoses - Add diagnosis
```

#### **Analytics**
```http
GET /api/analytics           - Get analytics data
GET /api/analytics/dashboard - Get dashboard metrics
```

## 🧪 Test Your Setup

### **1. Quick Health Check**
```bash
npm run health-check
```

### **2. API Tests**
```bash
# Test API health
curl http://localhost:3000/api/health

# Test database connection
curl http://localhost:3000/api/db-test

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demodoctor", "password": "123"}'
```

### **3. Frontend Tests**
1. Go to http://localhost:5173
2. Login with demo credentials
3. Test search functionality
4. Navigate between dashboards
5. Access data management (Government role)

## 📊 Database Operations

### **Via Prisma Studio** (http://localhost:5555)
- Visual interface to browse all tables
- Add/edit/delete records directly
- View relationships between data
- Export/import data

### **Via Frontend UI**
- Data Management tab (Government/Admin roles)
- Add/edit/delete users, disorders, patients
- Search and filter capabilities
- Form-based data entry

### **Via API Calls**
- RESTful endpoints for all operations
- JWT authentication required
- JSON request/response format
- Pagination and filtering support

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start React development server |
| `npm run server` | Start Express API server |
| `npm run server:dev` | Start API server with auto-reload |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Populate database with sample data |
| `npm run db:reset` | Reset database and reseed |
| `npm run build` | Build production frontend |
| `npm run health-check` | Run system health checks |

## 📈 Usage Examples

### **Create a New Disorder**
```javascript
const newDisorder = {
  englishName: "Hypertension",
  sanskritName: "उच्च रक्तचाप",
  icd11Code: "BA00",
  namasteCode: "HTN001",
  category: "Cardiovascular",
  description: "High blood pressure condition"
};

// Via API
fetch('http://localhost:3000/api/disorders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify(newDisorder)
});

// Via Frontend: Login as Government -> Data Management -> Disorders -> Add New
```

### **Create a New Patient**
```javascript
const newPatient = {
  abhaId: "12-3456-7890-1234",
  firstName: "Priya",
  lastName: "Sharma",
  dateOfBirth: "1985-03-15",
  gender: "FEMALE",
  phone: "+91-9876543210",
  email: "priya.sharma@email.com",
  address: "123 Main Street, Mumbai",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001"
};

// Via API or Frontend Data Management
```

### **Search Medical Data**
```javascript
// Search disorders by name or code
const searchResults = await fetch(
  'http://localhost:3000/api/disorders?search=diabetes&limit=10'
);

// Search patients by ABHA ID
const patientResults = await fetch(
  'http://localhost:3000/api/patients?abhaId=12-3456-7890-1234'
);
```

## 🎯 Next Steps

1. **Login** to the application at http://localhost:5173
2. **Test** both Doctor and Government dashboards
3. **Explore** data management features (Government role)
4. **Add** new disorders, patients, or users
5. **View** database changes in Prisma Studio
6. **Monitor** API calls and responses

## 🆘 Troubleshooting

### **Port Conflicts**
```bash
# Kill processes on ports
npx kill-port 3000 5173 5555
```

### **Database Issues**
```bash
# Reset and reseed database
npm run db:reset
npm run db:seed
```

### **API Connection Issues**
```bash
# Check if server is running
curl http://localhost:3000/api/health

# Restart server
npm run server
```

Your CHARAK API system is now **fully integrated** with complete backend functionality, database operations, and comprehensive CRUD capabilities! 🎉