import { Request, Response } from 'express';
import { Permission, UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface decodedJWT {
  id:number,
  username:string,
  permission: Permission,
}

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
        { id: user.id, username: user.username, permission: user.permission },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      res.json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          permission: user.permission,
          data: user.data,
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

      // 创建新用户，默认权限为普通用户
      const result = await UserModel.createUser({ username, password, email, permission: Permission.USER });

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
  static async getUserInfo(req: Request, res: Response) {
    try {
      
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      const user = await UserModel.findByUserId(decoded.id);
      if (!user) {
        return res.status(404).json({ message: '用户未找到' });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        permission: user.permission,
        data: user.data
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('获取用户信息失败:', error);
    }
  }
  static async getUserById(req: Request, res: Response) {
    try {
      //鉴权
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }

      const user = await UserModel.findByUserId(userId);
      if (!user) {
        return res.status(404).json({ message: '用户未找到' });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        permission: user.permission,
        data: user.data
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('获取用户信息失败:', error);
    }
  }
  static async getAllUsers(req: Request, res: Response) {
    try {
      //鉴权
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      if ((await UserModel.findByUserId(decoded.id)).permission < Permission.ADMIN) {
        return res.status(403).json({ message: '权限不足' });
      }
      const users = await UserModel.findAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('获取所有用户失败:', error);
    }
  }
}
