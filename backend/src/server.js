import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes     from './routes/auth.js';
import enquiryRoutes  from './routes/enquiry.js';
import propertyRoutes from './routes/property.js';
import chatRoutes     from './routes/chat.js';
import blogRoutes     from './routes/blog.js';
import uploadRoutes   from './routes/upload.js';
import partnerRoutes  from './routes/partner.js';
import sitemapRoutes  from './routes/sitemap.js';
import masterDataRoutes from './routes/masterData.js';
import settingsRoutes from './routes/settings.js';
import advisorRoutes  from './routes/advisor.js';
import testimonialRoutes from './routes/testimonial.js';
import faqRoutes from './routes/faq.js';
import { sanitizeInput } from './middleware/sanitize.js';

const app = express();

// Trust proxy for rate limiting (Render/reverse proxy setups)
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Connect to MongoDB
connectDB().then(() => {
  if (process.env.SEED === 'true') {
    import('./utils/seeder.js').then(({ seedDefaultData }) => seedDefaultData());
  }
});

// ── Rate Limiting (in-memory — persists per process instance) ────────────────
// Note: Using in-memory store which resets on server restart.
// The per-email OTP limiter uses Redis (Upstash) for persistence.

// Auth routes: 10 requests per minute per IP
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests, please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API: 100 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Compress all responses with gzip — reduces payload by ~70%
app.use(compression());

// ── Security Headers ───────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:     ["'self'"],
        scriptSrc:      ["'self'", "'unsafe-inline'"], // unsafe-inline required for theme init script
        styleSrc:       ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://unpkg.com'],
        fontSrc:        ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc:         ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc:     ["'self'", 'https://integrate.api.nvidia.com', 'https://oauth2.googleapis.com', 'https://www.googleapis.com'],
        mediaSrc:       ["'self'", 'https:', 'blob:'],
        objectSrc:      ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // Required for map tiles and external media
  })
);

// ── Logging ────────────────────────────────────────────────────────────────────
// Use compact 'dev' format locally, structured 'combined' in production
app.use(morgan(isProd ? 'combined' : 'dev'));

// ── CORS — credentials: true so cookies are sent cross-origin ─────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Exact match
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Match CLIENT_URL from .env (handles custom prod domains)
    if (process.env.CLIENT_URL) {
      const clean = process.env.CLIENT_URL.replace(/\/$/, '');
      if (origin === clean) return callback(null, true);
    }

    // Allow any Vercel preview/production subdomain (frontend is deployed on Vercel)
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    return callback(null, false);
  },
  credentials: true, // Required for cookies to be sent & received
}));

// ── Body & Cookie Parsers ──────────────────────────────────────────────────────
// 1MB limit prevents request-body DoS attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(sanitizeInput);

// ── Base Route ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'HyperRelestix API running 🚀' });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',       authLimiter, authRoutes);
app.use('/api/enquiry',    apiLimiter,  enquiryRoutes);
app.use('/api/properties', apiLimiter,  propertyRoutes);
app.use('/api/chat',       apiLimiter,  chatRoutes);
app.use('/api/blogs',      apiLimiter,  blogRoutes);
app.use('/api/upload',     apiLimiter,  uploadRoutes);
app.use('/api/partners',   apiLimiter,  partnerRoutes);
app.use('/api/master-data', apiLimiter,  masterDataRoutes);
app.use('/api/settings',    apiLimiter,  settingsRoutes);
app.use('/api/advisors',    apiLimiter,  advisorRoutes);
app.use('/api/testimonials', apiLimiter, testimonialRoutes);
app.use('/api/faqs',        apiLimiter,  faqRoutes);
app.use('/sitemap.xml',    sitemapRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  // FIX: Do not expose NODE_ENV or internal config in public health response
  res.json({ success: true, message: 'HyperRelestix API running 🚀' });
});

// ── 404 ────────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
// Never expose raw error stacks in production responses
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  if (!isProd) console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message: isProd ? 'Internal server error' : err.message,
  });
});

app.listen(PORT, () => {
  console.info(`🚀 Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
