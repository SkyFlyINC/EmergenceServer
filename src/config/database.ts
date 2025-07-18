import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 创建一个没有指定数据库的连接池
const initPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 创建实际使用的连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDatabase() {
  try {
    // 1. 创建数据库
    const connection = await initPool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    connection.release();

    // 2. 使用新数据库并创建表
    const dbConnection = await pool.getConnection();
    
    // 创建用户表
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        data TEXT,
        permission INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    //创建课程表
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        users_related TEXT,
        arrangement TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      `)
      //创建基本信息表
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS basic_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        info_key VARCHAR(255) NOT NULL UNIQUE,
        info_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('数据库初始化成功');
    dbConnection.release();
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}
setInterval(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
  } catch (err) {
    console.error('连接检查失败:', err);
  }
}, 30000); // 每30秒检查一次

export { pool, initDatabase };
