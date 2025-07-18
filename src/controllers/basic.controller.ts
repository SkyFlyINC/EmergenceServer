import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { BasicModel } from '../models/basic.model';


export class BasicController {
  static async getBasicInfo(req: Request, res: Response) {
    try {
      const infoKey = req.params.key;
      const info = await BasicModel.getBasicInfo(infoKey);
      if (!info) {
        return res.status(404).json({ message: '信息未找到' });
      }
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('获取基本信息失败:', error);
    }
  }

  static async updateBasicInfo(req: Request, res: Response) {
    try {
      const { key, value } = req.body;
      if (!key || !value) {
        return res.status(400).json({ message: '请提供所有必需字段' });
      }
      const result = await BasicModel.updateBasicInfo(key, value);
      res.json({ message: '基本信息更新成功', result });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('更新基本信息失败:', error);
    }
  }
}
