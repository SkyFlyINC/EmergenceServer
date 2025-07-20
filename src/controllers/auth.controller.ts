import { Request, Response } from 'express';
import { Permission, User, UserModel, UserUpdate } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { hash } from 'crypto';
import { receiveMessageOnPort } from 'worker_threads';

export interface decodedJWT {
  id: number,
  username: string,
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
  static async updateUser(req: Request, res: Response) {
    try {
      //鉴权
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      const UserUpdate = req.body as UserUpdate;
      //用户未输入的字段将不会被更新
      const result = await UserModel.updateUser(UserUpdate);
      res.json({ message: '用户更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新用户失败:', error);
    }
  }
  static async updateUserById(req: Request, res: Response) {
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
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }
      const { username, email, password, data, permission } = req.body;
      const userUpdate: UserUpdate = { id: userId };
      if (username) {
        userUpdate.username = username;
      }
      if (email) {
        userUpdate.email = email;
      }
      if (data) {
        userUpdate.data = data;
      }
      if (permission) {
        userUpdate.permission = permission;
      }
      const result = await UserModel.updateUser(userUpdate);
      res.json({ message: '用户更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新用户失败:', error);
    }
  }
  static async updateUserData(req: Request, res: Response) {
    try {
      //鉴权
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      const userId = decoded.id;
      const { data } = req.body;

      // 验证用户输入
      if (!data) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 更新数据
      const result = await UserModel.updateData(userId, data);
      res.json({ message: '数据更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新数据失败:', error);
    }
  }
  static async updateUserDataById(req: Request, res: Response) {
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
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }
      const { data } = req.body;

      // 验证用户输入
      if (!data) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 更新数据
      const result = await UserModel.updateData(userId, data);
      res.json({ message: '数据更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新数据失败:', error);
    }
  }
  static async deleteUserById(req: Request, res: Response) {
    try {
      //鉴权
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET
        || 'your-secret-key') as decodedJWT;
      if ((await UserModel.findByUserId(decoded.id)).permission < Permission.ADMIN) {
        return res.status(403).json({ message: '权限不足' });
      }
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }

      const result = await UserModel.deleteUser(userId);
      res.json({ message: '用户删除成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('删除用户失败:', error);
    }
  }
  static async changePassword(req: Request, res: Response) {
    try {
      //鉴权
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      const userId = decoded.id;
      const { oldPassword, newPassword } = req.body;

      // 验证用户输入
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 检查旧密码是否正确
      const user = await UserModel.findByUserId(userId);
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(401).json({ message: '旧密码不正确' });
      }

      // 更新密码
      const result = await UserModel.updatePassword(userId, await bcrypt.hash(newPassword, 10));
      res.json({ message: '密码更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新密码失败:', error);
    }
  }
  static async changePasswordById(req: Request, res: Response) {
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
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }
      const { newPassword } = req.body;
      // 验证用户输入
      if (!newPassword) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }
      // 更新密码
      const result = await UserModel.updatePassword(userId, await bcrypt.hash(newPassword, 10));
      res.json({ message: '密码更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新密码失败:', error);
    }
  }
  static async updateEmail(req: Request, res: Response) {
    try {
      //鉴权
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      const userId = decoded.id;
      const { email } = req.body;

      // 验证用户输入
      if (!email) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 更新邮箱
      const result = await UserModel.updateEmail(userId, email);
      res.json({ message: '邮箱更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新邮箱失败:', error);
    }
  }
  static async updateEmailById(req: Request, res: Response) {
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
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }
      const { email } = req.body;

      // 验证用户输入
      if (!email) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 更新邮箱
      const result = await UserModel.updateEmail(userId, email);
      res.json({ message: '邮箱更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新邮箱失败:', error);
    }
  }
  static async updatePermission(req: Request, res: Response) {
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
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }
      const { permission } = req.body;

      // 验证用户输入
      if (!permission) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 更新权限
      const result = await UserModel.updatePermission(userId, permission);
      res.json({ message: '权限更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新权限失败:', error);
    }
  }
  static async updatePermissionById(req: Request, res: Response) {
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
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }
      const { permission } = req.body;

      // 验证用户输入
      if (!permission) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 更新权限
      const result = await UserModel.updatePermission(userId, permission);
      res.json({ message: '权限更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新权限失败:', error);
    }
  }
  static async updateUsername(req: Request, res: Response) {
    try {
      //鉴权
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      const userId = decoded.id;
      const { username } = req.body;

      // 验证用户输入
      if (!username) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 更新用户名
      const result = await UserModel.updateUsername(userId, username);
      res.json({ message: '用户名更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新用户名失败:', error);
    }
  }
  static async updateUsernameById(req: Request, res: Response) {
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
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: '无效的用户ID' });
      }
      const { username } = req.body;

      // 验证用户输入
      if (!username) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }

      // 更新用户名
      const result = await UserModel.updateUsername(userId, username);
      res.json({ message: '用户名更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新用户名失败:', error);
    }
  }
  static async createUser(req: Request, res: Response) {
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
      const { username, password, email, permission, data } = req.body;

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
      const result = await UserModel.createUser({ username, password, email, data, permission });
      res.json({ message: '用户创建成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('创建用户失败:', error);
    }
  }
}