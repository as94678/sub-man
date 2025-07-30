import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// 所有路由都需要認證
router.use(authenticateToken);

// 取得用戶完整資料
router.get('/profile', async (req, res) => {
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

    if (!user) {
      return res.status(404).json({ error: '找不到用戶' });
    }

    res.json({ user });
  } catch (error) {
    console.error('取得用戶資料錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新用戶基本資料
router.put('/profile', async (req, res) => {
  try {
    const { name, email } = req.body;

    // 驗證必填欄位
    if (!name || !email) {
      return res.status(400).json({ error: '姓名和電子郵件都是必填的' });
    }

    // 檢查電子郵件是否已被其他用戶使用
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: req.user.id }
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: '該電子郵件已被其他用戶使用' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        settings: true
      }
    });

    res.json({
      message: '用戶資料更新成功',
      user: updatedUser
    });

  } catch (error) {
    console.error('更新用戶資料錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 修改密碼
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 驗證必填欄位
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: '目前密碼和新密碼都是必填的' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: '新密碼至少需要6個字符' });
    }

    // 取得用戶完整資料（包含密碼）
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: '找不到用戶' });
    }

    // 驗證目前密碼
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: '目前密碼不正確' });
    }

    // 加密新密碼
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新密碼
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    res.json({ message: '密碼修改成功' });

  } catch (error) {
    console.error('修改密碼錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新用戶設定
router.put('/settings', async (req, res) => {
  try {
    const { baseCurrency, theme } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user.id },
      update: {
        ...(baseCurrency && { baseCurrency }),
        ...(theme && { theme })
      },
      create: {
        userId: req.user.id,
        baseCurrency: baseCurrency || 'USD',
        theme: theme || 'light'
      }
    });

    res.json({
      message: '設定更新成功',
      settings
    });

  } catch (error) {
    console.error('更新設定錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 刪除帳戶
router.delete('/account', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: '請輸入密碼以確認刪除' });
    }

    // 取得用戶資料驗證密碼
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: '找不到用戶' });
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: '密碼不正確' });
    }

    // 刪除用戶（因為有 CASCADE，相關資料會自動刪除）
    await prisma.user.delete({
      where: { id: req.user.id }
    });

    res.json({ message: '帳戶已成功刪除' });

  } catch (error) {
    console.error('刪除帳戶錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 取得帳戶統計資訊
router.get('/stats', async (req, res) => {
  try {
    const [subscriptionCount, totalSpent] = await Promise.all([
      // 訂閱數量
      prisma.subscription.count({
        where: { userId: req.user.id }
      }),
      // 總花費（這裡簡化計算，實際可能需要匯率轉換）
      prisma.subscription.aggregate({
        where: { userId: req.user.id },
        _sum: { price: true }
      })
    ]);

    // 最早的訂閱日期
    const earliestSubscription = await prisma.subscription.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true }
    });

    res.json({
      stats: {
        subscriptionCount,
        totalMonthlySpent: totalSpent._sum.price || 0,
        memberSince: earliestSubscription?.createdAt || req.user.createdAt,
        accountCreated: req.user.createdAt
      }
    });

  } catch (error) {
    console.error('取得統計資訊錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;