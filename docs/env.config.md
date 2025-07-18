# 环境变量配置说明

## 必要配置项

### 数据库配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| DB_HOST | 数据库主机地址 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_USER | 数据库用户名 | root |
| DB_PASSWORD | 数据库密码 | your_password |
| DB_NAME | 数据库名称 | emergence_db |

### 认证配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| JWT_SECRET | JWT 签名密钥 | your_jwt_secret_key |

## 配置示例

```properties
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=emergence_db
JWT_SECRET=your_secure_jwt_secret
```

## 注意事项

1. `.env` 文件包含敏感信息，确保它已被添加到 `.gitignore` 中
2. 不要在生产环境使用示例中的默认值
3. 确保数据库密码和 JWT 密钥使用足够复杂的字符串
4. 在部署时使用不同的生产环境配置

## 开发环境设置

1. 复制 `.env.example` 到 `.env`：
```bash
copy .env.example .env
```

2. 修改配置值以匹配本地开发环境

## 安全建议

- 定期更换密码和密钥
- 使用强密码生成器创建密钥
- 不同环境使用不同的密钥
- 限制数据库用户权限

## 故障排除

如果遇到连接问题：
1. 确认数据库服务是否运行
2. 验证主机地址是否正确
3. 检查用户名和密码
4. 确认数据库是否已创建