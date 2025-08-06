import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const prisma = new PrismaClient();

// 初始化 Google OAuth 客戶端
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 註冊
router.post('/register', async (req, res) => {
  try {
    console.log('註冊請求開始:', req.body);
    const { email, password, name } = req.body;

    // 驗證必填欄位
    if (!email || !password || !name) {
      console.log('必填欄位驗證失敗:', { email: !!email, password: !!password, name: !!name });
      return res.status(400).json({ error: '所有欄位都是必填的' });
    }

    console.log('開始檢查用戶是否存在...');
    // 檢查用戶是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('用戶已存在:', email);
      return res.status(400).json({ error: '該電子郵件已被註冊' });
    }

    console.log('開始加密密碼...');
    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('開始創建用戶...');
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
    console.log('用戶創建成功:', user.id);

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
    
    // 更詳細的錯誤信息
    if (error.code === 'P2002') {
      return res.status(400).json({ error: '該電子郵件已被註冊' });
    }
    
    res.status(500).json({ 
      error: '伺服器錯誤',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

// Google 登入
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: '缺少 Google ID Token' });
    }

    let payload;
    
    try {
      // 嘗試驗證標準的 ID Token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      // 如果驗證失敗，嘗試解析自定義的 token（來自我們的 OAuth 流程）
      try {
        // 解碼 base64 然後 decodeURIComponent 來處理 Unicode 字符
        const decoded = Buffer.from(idToken, 'base64').toString();
        const decodedPayload = decodeURIComponent(decoded);
        payload = JSON.parse(decodedPayload);
        console.log('使用自定義 token 格式');
      } catch (parseError) {
        console.error('解析自定義 token 失敗:', parseError);
        return res.status(400).json({ error: '無效的 Google Token' });
      }
    }

    if (!payload) {
      return res.status(400).json({ error: '無效的 Google Token' });
    }

    const { sub: googleId, email, name, picture: avatar, access_token } = payload;

    // 檢查用戶是否已存在（通過 Google ID 或 email）
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email, provider: 'google' }
        ]
      },
      include: {
        settings: true
      }
    });

    if (user) {
      // 更新現有用戶的資訊
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          name,
          avatar,
          updatedAt: new Date()
        },
        include: {
          settings: true
        }
      });
    } else {
      // 檢查是否有相同 email 的本地帳號
      const existingLocalUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingLocalUser && existingLocalUser.provider === 'local') {
        return res.status(400).json({ 
          error: '此電子郵件已使用密碼註冊，請使用密碼登入或聯絡客服' 
        });
      }

      // 建立新的 Google 用戶
      user = await prisma.user.create({
        data: {
          email,
          name,
          provider: 'google',
          googleId,
          avatar,
          settings: {
            create: {
              baseCurrency: 'USD',
              theme: 'light'
            }
          }
        },
        include: {
          settings: true
        }
      });
    }

    // 產生 JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 回傳用戶資訊
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: '登入成功',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Google 登入錯誤:', error);
    res.status(500).json({ error: 'Google 登入失敗' });
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