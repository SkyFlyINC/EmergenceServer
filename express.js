const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json()); // 启用 JSON 解析
app.use(express.urlencoded({ extended: true })); // 解析表单数据

app.use(express.static('public')); 
//第三方中间件
const cors = require('cors');// 允许跨域请求
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

app.use(cors()); // 允许所有跨域请求
app.use(helmet()); // 安全头部
app.use(morgan('dev')); // 日志格式：GET / 200 5ms
app.use(cookieParser()); // 解析 Cookie

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});