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

  static async createUser(user: User): Promise<ResultSetHeader> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [user.username, hashedPassword, user.email]
    );
    return result;
  }
  static async findByUserId(userId:number){
        const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return rows[0];
  }
}
