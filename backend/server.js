import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscriptions.js';
import userRoutes from './routes/user.js';

// 載入環境變數（開發環境）
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3001;

// 中介軟體
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  'https://sub-man-new.vercel.app', // 明確添加前端 URL
  process.env.FRONTEND_URL // Vercel 部署的前端 URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/user', userRoutes);

// 基本路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'Subscription Manager API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      subscriptions: '/api/subscriptions'
    }
  });
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 環境變數檢查 (僅用於調試)
app.get('/debug', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({ error: '找不到請求的資源' });
});

// 全域錯誤處理
app.use((err, req, res, next) => {
  console.error('伺服器錯誤:', err);
  res.status(500).json({ error: '內部伺服器錯誤' });
});

// 啟動伺服器
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database URL exists: ${!!process.env.DATABASE_URL}`);
  console.log(`JWT Secret exists: ${!!process.env.JWT_SECRET}`);
  
  // 測試資料庫連接
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});