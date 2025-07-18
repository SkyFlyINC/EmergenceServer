import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      res.json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('登录失败:', error);
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;

      // 验证用户输入
      if (!username || !password || !email) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 检查用户名是否已存在
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: '用户名已存在' });
      }

      // 创建新用户
      const result = await UserModel.createUser({ username, password, email });

      // 生成 JWT 令牌
      const token = jwt.sign(
        { id: result.insertId, username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      res.status(201).json({
        message: '注册成功',
        token,
        user: {
          id: result.insertId,
          username,
          email
        }
      });
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({ message: '服务器错误' });
    }
  }
}
