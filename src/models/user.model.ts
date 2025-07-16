import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import bcrypt from 'bcryptjs';
interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  email: string;
}

export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;
}

export class UserModel {
  static async findByUsername(username: string): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async createUser(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [user.username, hashedPassword, user.email]
    );
    return result;
  }
}
