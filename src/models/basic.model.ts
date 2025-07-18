import { ResultSetHeader } from "mysql2";
import { pool } from "../config/database";

// 基础模型，用于处理基本信息的存储和检索
export interface BasicInfo {
    id?: number;
    info_key: string;
    info_value: string;
    }

export class BasicModel {
    static async getBasicInfo(key: string): Promise<any> {
        const [rows] = await pool.execute<any[]>(
        'SELECT * FROM basic_info WHERE info_key = ?',
        [key]
        );
        return rows[0];
    }
    
    static async updateBasicInfo(key: string, value: string): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO basic_info (info_key, info_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE info_value = ?',
        [key, value, value]
        );
        return result;
    }
    }