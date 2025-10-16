import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { z } from 'zod';
import crypto from 'crypto';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
        firstName?: string;
        lastName?: string;
      };
    }
  }
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002; // Fixed: Use port 3002 for backend
const JWT_SECRET = process.env.JWT_SECRET || 'charak-api-secret-key-2024';

// Enhanced Middleware Configuration
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], // Allow multiple frontend ports
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Validation Schemas
const patientSchema = z.object({
  abhaId: z.string().min(14).max(14),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional()
});

const disorderSchema = z.object({
  englishName: z.string().min(1).max(200),
  sanskritName: z.string().min(1).max(200),
  icd11Code: z.string().min(1).max(20),
  namasteCode: z.string().min(1).max(20),
  category: z.string().min(1).max(100),
  ayurvedicClassification: z.string().min(1).max(200),
  description: z.string().optional()
});

const diagnosisSchema = z.object({
  patientId: z.string(),
  disorderId: z.string(),
  notes: z.string().optional(),
  severity: z.number().min(1).max(10).optional(),
  status: z.enum(['ACTIVE', 'RESOLVED', 'CHRONIC']).optional()
});

// Enhanced Authentication & Authorization Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      code: 'TOKEN_MISSING'
    });
  }

  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid or expired token',
        code: 'TOKEN_INVALID'
      });
    }
    
    try {
      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true, role: true, firstName: true, lastName: true }
      });
      
      if (!user) {
        return res.status(403).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ 
        error: 'Authentication error',
        code: 'AUTH_ERROR'
      });
    }
  });
};

// Role-based authorization middleware
const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// Validation middleware
const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues // Fixed: Use 'issues' instead of 'errors'
        });
      }
      return res.status(400).json({ error: 'Invalid request data' });
    }
  };
};

// Error handling middleware
const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Resource already exists',
      field: err.meta?.target
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Resource not found'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CHARAK API Backend v2.0.0 is running',
    timestamp: new Date().toISOString(),
    database: 'Connected',
    version: '2.0.0',
    features: [
      'Enhanced Authentication',
      'Role-based Authorization', 
      'Medical Analytics',
      'Advanced Patient Search',
      'Report Generation',
      'Bulk Operations',
      'Security Middleware',
      'Request Validation'
    ]
  });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    console.log(`✅ User ${user.username} (${user.role}) logged in successfully`);

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
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/register', validate(z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum(['DOCTOR', 'GOVERNMENT', 'ADMIN']).optional()
})), async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, role = 'DOCTOR' } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Username or email already exists',
        field: existingUser.username === username ? 'username' : 'email'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });
    
    console.log(`✅ New user registered: ${user.username} (${user.role})`);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Enhanced User management endpoints
app.get('/api/users', authenticateToken, requireRole(['ADMIN', 'GOVERNMENT']), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const whereClause: any = {};
    if (role) whereClause.role = role;
    if (search) {
      whereClause.OR = [
        { username: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          _count: {
            select: { diagnoses: true }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where: whereClause })
    ]);
    
    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('❌ Fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', authenticateToken, requireRole(['ADMIN']), validate(z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum(['DOCTOR', 'GOVERNMENT', 'ADMIN'])
})), async (req, res) => {
  try {
    const { username, password, email, role, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role,
        firstName,
        lastName
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });
    
    console.log(`✅ New user created by admin: ${user.username} (${user.role})`);
    res.status(201).json(user);
  } catch (error: any) {
    console.error('❌ Create user error:', error);
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

// Enhanced Patient endpoints
app.get('/api/patients', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, city, state, gender } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { abhaId: { contains: search as string } },
        { phone: { contains: search as string } },
        { email: { contains: search as string } }
      ];
    }
    
    if (city) whereClause.city = { contains: city as string, mode: 'insensitive' };
    if (state) whereClause.state = { contains: state as string, mode: 'insensitive' };
    if (gender) whereClause.gender = gender;
    
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { diagnoses: true }
          }
        }
      }),
      prisma.patient.count({ where: whereClause })
    ]);
    
    res.json({
      patients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('❌ Fetch patients error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.get('/api/patients/abha/:abhaId', authenticateToken, async (req, res) => {
  try {
    const { abhaId } = req.params;
    
    const patient = await prisma.patient.findUnique({
      where: { abhaId },
      include: {
        diagnoses: {
          include: {
            disorder: true,
            doctor: {
              select: { firstName: true, lastName: true, username: true }
            }
          },
          orderBy: { diagnosedAt: 'desc' },
          take: 10
        },
        _count: {
          select: { diagnoses: true }
        }
      }
    });
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Create a consolidated patient object with name
    const patientWithName = {
      ...patient,
      name: `${patient.firstName} ${patient.lastName}`
    };
    
    console.log(`📋 Patient lookup: ${patient.firstName} ${patient.lastName} (ABHA: ${abhaId})`);
    res.json(patientWithName);
  } catch (error) {
    console.error('❌ Fetch patient by ABHA error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

app.post('/api/patients', authenticateToken, requireRole(['DOCTOR', 'ADMIN']), validate(patientSchema), async (req, res) => {
  try {
    const patientData = req.body;
    
    const patient = await prisma.patient.create({
      data: {
        ...patientData,
        dateOfBirth: new Date(patientData.dateOfBirth)
      }
    });
    
    console.log(`✅ New patient created: ${patient.firstName} ${patient.lastName} (ABHA: ${patient.abhaId})`);
    res.status(201).json(patient);
  } catch (error: any) {
    console.error('❌ Create patient error:', error);
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'ABHA ID already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create patient' });
    }
  }
});

// Enhanced Disorder endpoints
app.get('/api/disorders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, language = 'english' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const whereClause: any = {};
    
    if (search) {
      if (language === 'sanskrit') {
        whereClause.sanskritName = { contains: search as string, mode: 'insensitive' };
      } else {
        whereClause.OR = [
          { englishName: { contains: search as string, mode: 'insensitive' } },
          { icd11Code: { contains: search as string, mode: 'insensitive' } },
          { category: { contains: search as string, mode: 'insensitive' } }
        ];
      }
    }
    
    if (category) whereClause.category = { contains: category as string, mode: 'insensitive' };
    
    const [disorders, total] = await Promise.all([
      prisma.disorder.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: { englishName: 'asc' },
        include: {
          _count: {
            select: { diagnoses: true }
          }
        }
      }),
      prisma.disorder.count({ where: whereClause })
    ]);
    
    res.json({
      disorders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('❌ Fetch disorders error:', error);
    res.status(500).json({ error: 'Failed to fetch disorders' });
  }
});

app.post('/api/disorders', authenticateToken, requireRole(['ADMIN', 'DOCTOR']), validate(disorderSchema), async (req, res) => {
  try {
    const disorder = await prisma.disorder.create({
      data: req.body
    });
    
    console.log(`✅ New disorder created: ${disorder.englishName} (${disorder.icd11Code})`);
    res.status(201).json(disorder);
  } catch (error: any) {
    console.error('❌ Create disorder error:', error);
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Disorder code already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create disorder' });
    }
  }
});

// Medical Analytics Endpoints
app.get('/api/medical/analytics/overview', authenticateToken, requireRole(['DOCTOR', 'GOVERNMENT', 'ADMIN']), async (req, res) => {
  try {
    const [
      totalDiagnoses,
      activeCases,
      resolvedCases,
      chronicCases,
      totalPatients,
      totalDisorders,
      recentDiagnoses,
      topDisorders
    ] = await Promise.all([
      prisma.diagnosis.count(),
      prisma.diagnosis.count({ where: { status: 'ACTIVE' } }),
      prisma.diagnosis.count({ where: { status: 'RESOLVED' } }),
      prisma.diagnosis.count({ where: { status: 'CHRONIC' } }),
      prisma.patient.count(),
      prisma.disorder.count(),
      prisma.diagnosis.findMany({
        take: 10,
        orderBy: { diagnosedAt: 'desc' },
        include: {
          patient: { select: { firstName: true, lastName: true, abhaId: true } },
          disorder: { select: { englishName: true, category: true } },
          doctor: { select: { firstName: true, lastName: true } }
        }
      }),
      prisma.diagnosis.groupBy({
        by: ['disorderId'],
        _count: { disorderId: true },
        orderBy: { _count: { disorderId: 'desc' } },
        take: 5
      })
    ]);

    res.json({
      overview: {
        totalDiagnoses,
        activeCases,
        resolvedCases,
        chronicCases,
        totalPatients,
        totalDisorders
      },
      recentActivity: recentDiagnoses,
      topDisorders
    });
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch medical analytics' });
  }
});

// Diagnosis Management
app.post('/api/diagnoses', authenticateToken, requireRole(['DOCTOR']), validate(diagnosisSchema), async (req, res) => {
  try {
    const { patientId, disorderId, notes, severity, status } = req.body;
    
    // Verify patient and disorder exist
    const [patient, disorder] = await Promise.all([
      prisma.patient.findUnique({ where: { id: patientId } }),
      prisma.disorder.findUnique({ where: { id: disorderId } })
    ]);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    if (!disorder) {
      return res.status(404).json({ error: 'Disorder not found' });
    }
    
    const diagnosis = await prisma.diagnosis.create({
      data: {
        patientId,
        disorderId,
        doctorId: req.user!.id,
        notes,
        severity,
        status: status || 'ACTIVE'
      },
      include: {
        patient: {
          select: { firstName: true, lastName: true, abhaId: true }
        },
        disorder: {
          select: { englishName: true, sanskritName: true, icd11Code: true }
        },
        doctor: {
          select: { firstName: true, lastName: true }
        }
      }
    });
    
    console.log(`✅ New diagnosis: ${disorder.englishName} for ${patient.firstName} ${patient.lastName} (ABHA: ${patient.abhaId})`);
    res.status(201).json(diagnosis);
  } catch (error) {
    console.error('❌ Diagnosis creation error:', error);
    res.status(500).json({ error: 'Failed to create diagnosis' });
  }
});

// Enhanced Dashboard data endpoint
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const [
      totalPatients,
      totalDisorders,
      totalUsers,
      totalDiagnoses,
      recentPatients,
      commonDisorders,
      recentActivity
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.disorder.count(),
      prisma.user.count(),
      prisma.diagnosis.count(),
      prisma.patient.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          abhaId: true,
          createdAt: true,
          city: true,
          state: true
        }
      }),
      prisma.diagnosis.groupBy({
        by: ['disorderId'],
        _count: {
          disorderId: true
        },
        orderBy: {
          _count: {
            disorderId: 'desc'
          }
        },
        take: 5
      }),
      prisma.diagnosis.findMany({
        take: 10,
        orderBy: { diagnosedAt: 'desc' },
        include: {
          patient: { select: { firstName: true, lastName: true, abhaId: true } },
          disorder: { select: { englishName: true, category: true } }
        }
      })
    ]);

    res.json({
      stats: {
        totalPatients,
        totalDisorders,
        totalUsers,
        totalDiagnoses
      },
      recentPatients,
      commonDisorders,
      recentActivity
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const [userCount, disorderCount, patientCount, diagnosisCount] = await Promise.all([
      prisma.user.count(),
      prisma.disorder.count(),
      prisma.patient.count(),
      prisma.diagnosis.count()
    ]);

    const isHealthy = userCount > 0 && disorderCount > 0;

    res.json({
      status: isHealthy ? 'Database Connected Successfully!' : 'Database Connected but Empty',
      healthy: isHealthy,
      data: {
        users: userCount,
        disorders: disorderCount,
        patients: patientCount,
        diagnoses: diagnosisCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database test error:', error);
    res.status(500).json({
      status: 'Database Connection Failed',
      healthy: false,
      error: error
    });
  }
});

// Bulk operations endpoint
app.post('/api/bulk/patients', authenticateToken, requireRole(['ADMIN', 'GOVERNMENT']), async (req, res) => {
  try {
    const { patients } = req.body;
    
    if (!Array.isArray(patients) || patients.length === 0) {
      return res.status(400).json({ error: 'Patients array is required' });
    }
    
    const results = await prisma.$transaction(async (tx) => {
      const created = [];
      const errors = [];
      
      for (const patientData of patients) {
        try {
          // Validate each patient
          patientSchema.parse(patientData);
          
          const patient = await tx.patient.create({
            data: {
              ...patientData,
              dateOfBirth: new Date(patientData.dateOfBirth)
            }
          });
          created.push(patient);
        } catch (error: any) {
          errors.push({
            patientData,
            error: error.message
          });
        }
      }
      
      return { created, errors };
    });
    
    console.log(`📊 Bulk patient creation: ${results.created.length} created, ${results.errors.length} failed`);
    res.json({
      success: results.created.length,
      failed: results.errors.length,
      created: results.created,
      errors: results.errors
    });
  } catch (error) {
    console.error('❌ Bulk patient creation error:', error);
    res.status(500).json({ error: 'Failed to create patients in bulk' });
  }
});

// Apply error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CHARAK API Server v2.0.0 running on http://localhost:${PORT}`);
  console.log(`📊 Database: Connected via Prisma`);
  console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
  console.log(`🛡️  Security: Helmet, CORS, Rate Limiting enabled`);
  console.log(`✨ Features: Enhanced authentication, analytics, validation, and more!`);
  console.log(`📋 Health Check: GET /api/health`);
  console.log(`🏥 Ready for medical data management!`);
});

export default app;