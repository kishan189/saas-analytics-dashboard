import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './connectDB.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import activityLogRoutes from './src/routes/activityLogRoutes.js';
import { errorHandler, notFound } from './src/utils/errorHandler.js';

dotenv.config();

const app = express();

// 🔥 CALL THE DB CONNECTION
connectDB();

// Body parsing middleware - MUST come before other middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security

// CORS configuration - support multiple origins
const allowedOrigins = [
  'http://localhost:5173', // Local development
  process.env.FRONTEND_URL, // Custom frontend URL from env (can be comma-separated)
  process.env.NETLIFY_SITE_URL, // Netlify production URL
].filter(Boolean); // Remove undefined values

// Parse comma-separated FRONTEND_URL if provided
const parseOrigins = (origins) => {
  const parsed = [];
  origins.forEach(origin => {
    if (origin && origin.includes(',')) {
      parsed.push(...origin.split(',').map(o => o.trim()));
    } else if (origin) {
      parsed.push(origin);
    }
  });
  return parsed;
};

const allAllowedOrigins = parseOrigins(allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allAllowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (origin.includes('.netlify.app')) {
        // Allow all Netlify preview and production deployments
        callback(null, true);
      } else if (process.env.NODE_ENV !== 'production') {
        // For development, allow all origins (less strict)
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies to be sent
  })
);

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Cookie parser
app.use(cookieParser()); // Parse cookies

// Logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running', version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
