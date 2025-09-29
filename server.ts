import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Middleware
app.use(cors());
app.use(express.json());

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
    // Test database connection by counting users
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

// Authentication endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
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

// Get disorders endpoint
app.get('/api/disorders', async (req, res) => {
  try {
    const { search, lang } = req.query;
    
    let disorders = await prisma.disorder.findMany({
      take: 20, // Limit results
      orderBy: { englishName: 'asc' }
    });
    
    // Filter by search term if provided
    if (search) {
      disorders = disorders.filter(disorder =>
        disorder.englishName.toLowerCase().includes(search.toString().toLowerCase()) ||
        disorder.sanskritName?.toLowerCase().includes(search.toString().toLowerCase()) ||
        disorder.icd11Code.toLowerCase().includes(search.toString().toLowerCase())
      );
    }
    
    res.json(disorders);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get patients endpoint
app.get('/api/patients', async (req, res) => {
  try {
    const { abhaId } = req.query;
    
    if (abhaId) {
      const patient = await prisma.patient.findUnique({
        where: { abhaId: abhaId.toString() },
        include: {
          diagnoses: {
            include: { disorder: true }
          }
        }
      });
      
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      res.json(patient);
    } else {
      const patients = await prisma.patient.findMany({
        take: 50,
        include: {
          diagnoses: {
            include: { disorder: true }
          }
        }
      });
      res.json(patients);
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await prisma.analyticsData.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CHARAK API Backend running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});