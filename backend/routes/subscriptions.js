import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// 所有路由都需要認證
router.use(authenticateToken);

// 取得所有訂閱
router.get('/', async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ subscriptions });
  } catch (error) {
    console.error('取得訂閱錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 建立新訂閱
router.post('/', async (req, res) => {
  try {
    const { name, price, currency, renewalDate, category, color } = req.body;

    // 驗證必填欄位
    if (!name || !price || !currency || !renewalDate || !category) {
      return res.status(400).json({ error: '所有欄位都是必填的' });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user.id,
        name,
        price: parseFloat(price),
        currency,
        renewalDate: new Date(renewalDate),
        category,
        color: color || '#3B82F6'
      }
    });

    res.status(201).json({
      message: '訂閱建立成功',
      subscription
    });

  } catch (error) {
    console.error('建立訂閱錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新訂閱
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, currency, renewalDate, category, color } = req.body;

    // 檢查訂閱是否存在且屬於當前用戶
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!existingSubscription) {
      return res.status(404).json({ error: '找不到訂閱' });
    }

    const subscription = await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        currency,
        renewalDate: new Date(renewalDate),
        category,
        color
      }
    });

    res.json({
      message: '訂閱更新成功',
      subscription
    });

  } catch (error) {
    console.error('更新訂閱錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 刪除訂閱
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 檢查訂閱是否存在且屬於當前用戶
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!existingSubscription) {
      return res.status(404).json({ error: '找不到訂閱' });
    }

    await prisma.subscription.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: '訂閱刪除成功' });

  } catch (error) {
    console.error('刪除訂閱錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;