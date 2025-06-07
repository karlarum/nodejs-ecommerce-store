import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from './routes/index.mjs';
import products from './data/products.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Enhanced session configuration
app.use(session({
  secret: 'ecommerce-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize session data middleware
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  if (!req.session.user) {
    req.session.user = null;
  }
  next();
});

// Routes
app.use('/', indexRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    error: 'Page Not Found',
    message: 'The page you are looking for does not exist.' 
  });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});