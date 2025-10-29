import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST before any other imports
const envPath = join(__dirname, '.env');
console.log('🔍 Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.log('❌ Error loading .env:', result.error);
} else {
  console.log('✅ .env loaded successfully');
  console.log('🔑 GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Found!' : 'NOT FOUND');
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDatabase from './config/database.js';
import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 15, // 15 requests per minute
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ========================================
// ROUTES
// ========================================

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SiteSage AI Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      analysis: '/api/analysis'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global Error Handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// ========================================
// DATABASE CONNECTION & SERVER START
// ========================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log('\n🚀 =====================================');
      console.log('   SiteSage AI Backend Server Started');
      console.log('   =====================================');
      console.log(`   🌐 Server running on port: ${PORT}`);
      console.log(`   📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   🔗 Base URL: http://localhost:${PORT}`);
      console.log(`   📚 API Docs: http://localhost:${PORT}/api`);
      console.log('   =====================================\n');
      
      // Check for required environment variables
      if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  WARNING: GEMINI_API_KEY not set!');
        console.log('   Get your FREE API key: https://aistudio.google.com/app/apikey\n');
      }
      
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
        console.warn('⚠️  WARNING: Using default JWT_SECRET! Change this in production!\n');
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

export default app;
