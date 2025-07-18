import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export enum Permission {
  USER = 1,
  ADMIN = 2,
  SUPER_ADMIN = 3
}



interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  data?: string;
  permission: number;
  email: string;
}

export interface User {
  id?: number;
  username: string;
  password: string;
  data?: string;
  permission: number;
  email: string;
}

export class UserModel {
  static async findByUsername(userName: string): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE username = ?',
      [userName]
    );
    return rows[0];
  }

  static async findByUserId(userId:number){
        const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return rows[0];
  }
  static async updateUser(user: User): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET username = ?, password = ?, data = ?, permission = ?, email = ? WHERE id = ?',
      [user.username, user.password, user.data, user.permission, user.email, user.id]
    );
    return result;
  }
  static async findAllUsers(): Promise<UserRow[]> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users'
    );
    return rows;
  }
  static async deleteUser(userId: number): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );
    return result;
  }
  static async findByEmail(email: string): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }
  static async updatePassword(userId: number, newPassword: string): Promise<ResultSetHeader> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    return result;
  }
  static async updateData(userId: number, data: string): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET data = ? WHERE id = ?',
      [data, userId]
    );
    return result;
  }
  static async updatePermission(userId: number, permission: Permission): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET permission = ? WHERE id = ?',
      [permission, userId]
    );
    return result;
  }
  static async createUser(user: User): Promise<ResultSetHeader> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, password, email, permission) VALUES (?, ?, ?, ?)',
      [user.username, hashedPassword, user.email, user.permission]
    );
    return result;
  }
}
