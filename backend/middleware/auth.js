import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '存取被拒絕，需要認證令牌' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 驗證用戶是否存在
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return res.status(401).json({ error: '無效的令牌' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT驗證錯誤:', error);
    return res.status(403).json({ error: '無效的令牌' });
  }
};