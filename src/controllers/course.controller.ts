import { Request, Response } from 'express';
import { Permission, UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Course, CourseModel } from '../models/course.model';
import { decodedJWT } from './auth.controller';

export class CourseController {
  static async createCourse(req: Request, res: Response) {
    try {
      //鉴定用户权限
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      if ((await UserModel.findByUserId(decoded.id)).permission < Permission.ADMIN) {
        return res.status(403).json({ message: '权限不足' });
      }
      const course:Course = req.body;
      // 验证课程输入
      if (!course.course_name) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }
      // 创建新课程
      const result = await CourseModel.createCourse(course);
      res.status(201).json({
        message: '课程创建成功',
        course: course
      });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('课程创建失败:', error);
    }
  }

  static async deleteCourse(req: Request, res: Response) {
    try {
      //鉴定用户权限
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      if ((await UserModel.findByUserId(decoded.id)).permission < Permission.ADMIN) {
        return res.status(403).json({ message: '权限不足' });
      }
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: '无效的课程ID' });
      }
      // 删除课程
      const result = await CourseModel.deleteCourse(courseId);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '课程未找到' });
      }
      res.json({ message: '课程删除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('课程删除失败:', error);
    }
  }

  static async updateCourse(req: Request, res: Response) {
    try {
      //鉴定用户权限
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未授权访问' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as decodedJWT;
      if ((await UserModel.findByUserId(decoded.id)).permission < Permission.ADMIN) {
        return res.status(403).json({ message: '权限不足' });
      }
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: '无效的课程ID' });
      }
      const course: Course = req.body;
      // 验证课程输入
      if (!course.course_name) {
        return res.status(400).json({ message: '请填写所有必需字段' });
      }
      // 更新课程
      course.id = courseId;
      const result = await CourseModel.updateCourse(course);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '课程未找到' });
      }
      res.json({ message: '课程更新成功', course });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('课程更新失败:', error);
    }
  }
  static async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await CourseModel.findAll();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('获取课程失败:', error);
    }
  }
  static async getCourseById(req: Request, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: '无效的课程ID' });
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: '课程未找到' });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('获取课程失败:', error);
    }
  }
    static async getCoursesByCourseName(req: Request, res: Response) {
    try {
      const courseName = req.params.course_name;
      if (!courseName) {
        return res.status(400).json({ message: '请提供课程名称' });
      }
      const courses = await CourseModel.findByCourseName(courseName);
      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: '未找到相关课程' });
      }
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
      console.error('获取课程失败:', error);
    }
  }
}
