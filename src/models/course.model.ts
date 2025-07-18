import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

interface CourseRow extends RowDataPacket {
  id: number;
  course_name: string;
  users_related: string;
  arrangement: string;
}

export interface Course {
  id?: number;
  course_name: string;
  users_related: string;
  arrangement: string;
}

export class CourseModel {
  static async findAll(): Promise<CourseRow[]> {
    const [rows] = await pool.execute<CourseRow[]>(
      'SELECT * FROM courses'
    );
    return rows;
  }
  static async findByCourseName(course_name: string): Promise<CourseRow[] | undefined> {
    const [rows] = await pool.execute<CourseRow[]>(
      'SELECT * FROM courses WHERE course_name = ?',
      [course_name]
    );
    return rows;
  }
  static async findById(courseId: number): Promise<CourseRow | undefined> {
    const [rows] = await pool.execute<CourseRow[]>(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );
    return rows[0];
  }

  static async createCourse(course: Course): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO courses (course_name, users_related, arrangement) VALUES (?, ?, ?)',
      [course.course_name, course.users_related, course.arrangement]
    );
    return result;
  }
  static async deleteCourse(courseId: number): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM courses WHERE id = ?',
      [courseId]
    );
    return result;
  } 
  static async updateCourse(course: Course): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE courses SET course_name = ?, users_related = ?, arrangement = ? WHERE id = ?',
      [course.course_name, course.users_related, course.arrangement, course.id]
    );
    return result;
  }
}
