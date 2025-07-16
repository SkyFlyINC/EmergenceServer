import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';

dotenv.config();

const app: Express = express();
const PORT: number = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// 路由
app.use('/api/auth', authRoutes);

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();
