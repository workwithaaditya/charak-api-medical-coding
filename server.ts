import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Middleware
app.use(cors());
app.use(express.json());

// API usage logging middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', async () => {
    const responseTime = Date.now() - startTime;
    try {
      await prisma.aPIUsage.create({
        data: {
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        }
      });
    } catch (error) {
      // Silent fail - don't break the API if logging fails
    }
  });
  
  next();
});

// ==================== HEALTH & STATUS ENDPOINTS ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CHARAK API Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const disorderCount = await prisma.disorder.count();
    const patientCount = await prisma.patient.count();
    
    res.json({
      status: 'Database Connected',
      stats: {
        users: userCount,
        disorders: disorderCount,
        patients: patientCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'Database Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Direct password comparison for demo (in production, use bcrypt)
    const validPassword = password === user.password;
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ==================== DISORDER ENDPOINTS ====================

// Search disorders
app.get('/api/disorders/search', async (req, res) => {
  try {
    const { query, limit = '10', confidence = '0' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const searchTerm = query.toString();
    
    // Get all active disorders and filter in JavaScript (SQLite doesn't support case-insensitive contains)
    const allDisorders = await prisma.disorder.findMany({
      where: {
        AND: [
          { isActive: true },
          { confidence: { gte: parseInt(confidence.toString()) } }
        ]
      },
      orderBy: { confidence: 'desc' }
    });
    
    const disorders = allDisorders
      .filter(disorder => 
        disorder.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disorder.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disorder.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disorder.icd11Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disorder.namasteCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, parseInt(limit.toString()));
    
    res.json(disorders);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get all disorders
app.get('/api/disorders', async (req, res) => {
  try {
    const { category, limit = '50' } = req.query;
    
    const disorders = await prisma.disorder.findMany({
      where: category ? { category: category.toString() } : { isActive: true },
      orderBy: { englishName: 'asc' },
      take: parseInt(limit.toString())
    });
    
    res.json(disorders);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get disorder by ID
app.get('/api/disorders/:id', async (req, res) => {
  try {
    const disorder = await prisma.disorder.findUnique({
      where: { id: req.params.id },
      include: {
        symptoms: {
          include: { symptom: true }
        }
      }
    });
    
    if (!disorder) {
      return res.status(404).json({ error: 'Disorder not found' });
    }
    
    res.json(disorder);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get disorder categories
app.get('/api/disorders/categories/list', async (req, res) => {
  try {
    const disorders = await prisma.disorder.findMany({
      where: { isActive: true },
      select: { category: true }
    });
    
    const categories = Array.from(new Set(disorders.map(d => d.category)));
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get disorder by code
app.get('/api/disorders/code/:code', async (req, res) => {
  try {
    const { type = 'icd11' } = req.query;
    const code = req.params.code;
    
    const disorder = await prisma.disorder.findFirst({
      where: type === 'namaste' 
        ? { namasteCode: code }
        : { icd11Code: code }
    });
    
    if (!disorder) {
      return res.status(404).json({ error: 'Disorder not found' });
    }
    
    res.json(disorder);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ==================== PATIENT ENDPOINTS ====================

// Search patients
app.get('/api/patients/search', async (req, res) => {
  try {
    const { query, limit = '10' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const searchTerm = query.toString();
    
    // Get all patients and filter in JavaScript (SQLite doesn't support case-insensitive contains)
    const allPatients = await prisma.patient.findMany();
    
    const patients = allPatients
      .filter(patient =>
        patient.abhaId.includes(searchTerm) ||
        patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm)
      )
      .slice(0, parseInt(limit.toString()));
    
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get patient by ABHA ID
app.get('/api/patients/abha/:abhaId', async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { abhaId: req.params.abhaId },
      include: {
        diagnoses: {
          include: { 
            disorder: true,
            doctor: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { diagnosedAt: 'desc' }
        }
      }
    });
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const { limit = '50', offset = '0' } = req.query;
    
    const patients = await prisma.patient.findMany({
      take: parseInt(limit.toString()),
      skip: parseInt(offset.toString()),
      include: {
        diagnoses: {
          include: { disorder: true }
        }
      }
    });
    
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Create new patient
app.post('/api/patients', async (req, res) => {
  try {
    const patient = await prisma.patient.create({
      data: req.body
    });
    
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Update patient
app.put('/api/patients/:id', async (req, res) => {
  try {
    const patient = await prisma.patient.update({
      where: { id: req.params.id },
      data: req.body
    });
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get patient history
app.get('/api/patients/:id/history', async (req, res) => {
  try {
    const { limit = '20' } = req.query;
    
    const history = await prisma.patientHistory.findMany({
      where: { patientId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit.toString())
    });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get patient statistics
app.get('/api/patients/stats/summary', async (req, res) => {
  try {
    const totalPatients = await prisma.patient.count();
    const totalDiagnoses = await prisma.diagnosis.count();
    
    const recentDiagnoses = await prisma.diagnosis.count({
      where: {
        diagnosedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    
    res.json({
      totalPatients,
      totalDiagnoses,
      activePatients: totalPatients,
      recentDiagnoses
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ==================== DIAGNOSIS ENDPOINTS ====================

// Create new diagnosis
app.post('/api/diagnoses', async (req, res) => {
  try {
    const { patientId, disorderId, doctorId, notes, severity, consentGiven } = req.body;
    
    const diagnosis = await prisma.diagnosis.create({
      data: {
        patientId,
        disorderId,
        doctorId,
        notes,
        severity,
        consentGiven
      },
      include: {
        disorder: true,
        patient: true,
        doctor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    // Create history entry
    await prisma.patientHistory.create({
      data: {
        patientId,
        action: 'diagnosis_added',
        details: {
          disorderId,
          diagnosisId: diagnosis.id,
          doctorId
        }
      }
    });
    
    res.status(201).json(diagnosis);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get diagnosis by ID
app.get('/api/diagnoses/:id', async (req, res) => {
  try {
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: req.params.id },
      include: {
        disorder: true,
        patient: true,
        doctor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    if (!diagnosis) {
      return res.status(404).json({ error: 'Diagnosis not found' });
    }
    
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Update diagnosis
app.put('/api/diagnoses/:id', async (req, res) => {
  try {
    const diagnosis = await prisma.diagnosis.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        disorder: true,
        patient: true
      }
    });
    
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get diagnoses by patient
app.get('/api/diagnoses/patient/:patientId', async (req, res) => {
  try {
    const { limit = '20' } = req.query;
    
    const diagnoses = await prisma.diagnosis.findMany({
      where: { patientId: req.params.patientId },
      include: {
        disorder: true,
        doctor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { diagnosedAt: 'desc' },
      take: parseInt(limit.toString())
    });
    
    res.json(diagnoses);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

// Get analytics trend data
app.get('/api/analytics/trends', async (req, res) => {
  try {
    const { period, limit = '100' } = req.query;
    
    const analytics = await prisma.analyticsData.findMany({
      where: period ? { period: period.toString() } : {},
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit.toString())
    });
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get EMR usage statistics
app.get('/api/analytics/emr-usage', async (req, res) => {
  try {
    const { sectorType, region } = req.query;
    
    const emrUsage = await prisma.eMRUsage.findMany({
      where: {
        ...(sectorType && { sectorType: sectorType.toString() }),
        ...(region && { region: region.toString() })
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(emrUsage);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get detailed disease analytics
app.get('/api/analytics/disease/:disorderName', async (req, res) => {
  try {
    const disorderName = req.params.disorderName;
    
    // Get all analytics and filter in JavaScript
    const allAnalytics = await prisma.analyticsData.findMany();
    
    const analytics = allAnalytics.filter(item =>
      item.disorder.toLowerCase().includes(disorderName.toLowerCase())
    );
    
    // Calculate aggregated statistics
    const totalCases = analytics.reduce((sum, item) => sum + item.cases, 0);
    
    const regionalDistribution: Record<string, number> = {};
    analytics.forEach(item => {
      regionalDistribution[item.region] = (regionalDistribution[item.region] || 0) + item.cases;
    });
    
    res.json({
      disorder: disorderName,
      totalCases,
      regionalDistribution,
      detailedData: analytics
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get API usage statistics
app.get('/api/analytics/api-usage', async (req, res) => {
  try {
    const { endpoint, limit = '100' } = req.query;
    
    const usage = await prisma.aPIUsage.findMany({
      where: endpoint ? { endpoint: endpoint.toString() } : {},
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit.toString())
    });
    
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get dashboard summary statistics
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const totalPatients = await prisma.patient.count();
    const totalDisorders = await prisma.disorder.count();
    const totalDiagnoses = await prisma.diagnosis.count();
    const totalUsers = await prisma.user.count();
    
    const recentDiagnoses = await prisma.diagnosis.findMany({
      take: 5,
      orderBy: { diagnosedAt: 'desc' },
      include: {
        disorder: true,
        patient: true
      }
    });
    
    res.json({
      stats: {
        totalPatients,
        totalDisorders,
        totalDiagnoses,
        totalUsers
      },
      recentDiagnoses
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ==================== SERVER STARTUP ====================

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log('   CHARAK API Backend Server');
  console.log('   ================================');
  console.log(`   🌐 Server: http://localhost:${PORT}`);
  console.log(`   📊 Database: ${process.env.DATABASE_URL}`);
  console.log(`   🏥 Health: http://localhost:${PORT}/api/health`);
  console.log('   ================================\n');
  
  console.log('📋 Available Endpoints:');
  console.log('   Authentication:');
  console.log('   - POST   /api/auth/login');
  console.log('\n   Disorders:');
  console.log('   - GET    /api/disorders');
  console.log('   - GET    /api/disorders/search?query=...');
  console.log('   - GET    /api/disorders/:id');
  console.log('   - GET    /api/disorders/code/:code');
  console.log('   - GET    /api/disorders/categories/list');
  console.log('\n   Patients:');
  console.log('   - GET    /api/patients');
  console.log('   - GET    /api/patients/search?query=...');
  console.log('   - GET    /api/patients/abha/:abhaId');
  console.log('   - POST   /api/patients');
  console.log('   - PUT    /api/patients/:id');
  console.log('   - GET    /api/patients/:id/history');
  console.log('   - GET    /api/patients/stats/summary');
  console.log('\n   Diagnoses:');
  console.log('   - POST   /api/diagnoses');
  console.log('   - GET    /api/diagnoses/:id');
  console.log('   - PUT    /api/diagnoses/:id');
  console.log('   - GET    /api/diagnoses/patient/:patientId');
  console.log('\n   Analytics:');
  console.log('   - GET    /api/analytics/trends');
  console.log('   - GET    /api/analytics/emr-usage');
  console.log('   - GET    /api/analytics/disease/:disorderName');
  console.log('   - GET    /api/analytics/api-usage');
  console.log('   - GET    /api/analytics/dashboard');
  console.log('\n');
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});