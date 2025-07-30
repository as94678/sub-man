import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// 註冊
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 驗證必填欄位
    if (!email || !password || !name) {
      return res.status(400).json({ error: '所有欄位都是必填的' });
    }

    // 檢查用戶是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: '該電子郵件已被註冊' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立用戶
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        settings: {
          create: {
            baseCurrency: 'USD',
            theme: 'light'
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    // 產生 JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '註冊成功',
      user,
      token
    });

  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 登入
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 驗證必填欄位
    if (!email || !password) {
      return res.status(400).json({ error: '電子郵件和密碼都是必填的' });
    }

    // 尋找用戶
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        settings: true
      }
    });

    if (!user) {
      return res.status(400).json({ error: '無效的認證資訊' });
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: '無效的認證資訊' });
    }

    // 產生 JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 回傳用戶資訊（不包含密碼）
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: '登入成功',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 取得目前用戶資訊
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        settings: true
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('取得用戶資訊錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;