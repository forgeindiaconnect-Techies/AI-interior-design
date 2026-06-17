const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();
app.set('trust proxy', true);

// Init Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const corsOptions = {
  origin: [
    'https://ai-interior-final-project.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    /\.vercel\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions)); // handle preflight for all routes (Node 24 compatible)

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/designs', require('./routes/designRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/marketplace-orders', require('./routes/marketplaceOrderRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// Serve static dataset folders
['bathroom', 'bedroom', 'living_room', 'kitchen'].forEach(dir => {
  app.use(`/dataset/${dir}`, express.static(path.join(__dirname, `../${dir}`)));
});

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('AI Interior Marketplace API Running'));

// Health check endpoints
app.get('/api/health', (req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));
app.get('/login/api/health', (req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
