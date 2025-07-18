# 认证 API 文档

## 登录接口

### 请求信息

- **路径**: `/api/auth/login`
- **方法**: `POST`
- **Content-Type**: `application/json`

### 请求体

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "your_username",
    "email": "user@example.com"
  }
}
```

#### 失败响应 (401 Unauthorized)

```json
{
  "message": "用户名或密码错误"
}
```

#### 服务器错误 (500 Internal Server Error)

```json
{
  "message": "服务器错误"
}
```

## 注册接口

### 请求信息

- **路径**: `/api/auth/register`
- **方法**: `POST`
- **Content-Type**: `application/json`

### 请求体

```json
{
  "username": "new_user",
  "password": "secure_password",
  "email": "user@example.com"
}
```

### 响应示例

#### 成功响应 (201 Created)

```json
{
  "message": "注册成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "new_user",
    "email": "user@example.com"
  }
}
```

#### 错误响应

##### 字段缺失 (400 Bad Request)
```json
{
  "message": "请填写所有必需字段"
}
```

##### 用户名已存在 (409 Conflict)
```json
{
  "message": "用户名已存在"
}
```

##### 服务器错误 (500 Internal Server Error)
```json
{
  "message": "服务器错误"
}
```

### 测试示例

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "password": "secure_password",
    "email": "user@example.com"
  }'
```

## 获取当前用户信息接口

### 请求信息

- **路径**: `/api/auth/getUserInfo`
- **方法**: `POST`
- **授权**: 需要JWT令牌

### 请求头

| 头部 | 值 | 描述 |
|------|-----|------|
| Authorization | Bearer {token} | JWT令牌 |

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "id": 1,
  "username": "your_username",
  "email": "user@example.com",
  "permission": 2,
  "data": "{}"
}
```

#### 未授权访问 (401 Unauthorized)
```json
{
  "message": "未授权访问"
}
```

#### 用户未找到 (404 Not Found)
```json
{
  "message": "用户未找到"
}
```

### 测试示例

```bash
curl -X POST http://localhost:3000/api/auth/getUserInfo \
  -H "Authorization: Bearer your_jwt_token"
```

## 根据ID获取用户信息接口

### 请求信息

- **路径**: `/api/auth/getUserInfo/:id`
- **方法**: `GET`
- **授权**: 需要JWT令牌

### 请求参数

| 参数 | 类型 | 描述 |
|------|------|------|
| id | number | 用户ID |

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "id": 1,
  "username": "target_user",
  "email": "target@example.com",
  "permission": 1,
  "data": "{}"
}
```

#### 无效的用户ID (400 Bad Request)
```json
{
  "message": "无效的用户ID"
}
```

### 测试示例

```bash
curl -X GET http://localhost:3000/api/auth/getUserInfo/1 \
  -H "Authorization: Bearer your_jwt_token"
```

## 获取所有用户接口

### 请求信息

- **路径**: `/api/auth/getAllUsers`
- **方法**: `GET`
- **授权**: 需要管理员权限 (JWT Token)

### 响应示例

#### 成功响应 (200 OK)

```json
[
  {
    "id": 1,
    "username": "admin",
    "password": "hashed_password",
    "email": "admin@example.com",
    "permission": 2,
    "data": "{}"
  },
  {
    "id": 2,
    "username": "user1",
    "password": "hashed_password",
    "email": "user1@example.com",
    "permission": 1,
    "data": "{}"
  }
]
```

#### 权限不足 (403 Forbidden)
```json
{
  "message": "权限不足"
}
```

### 测试示例

```bash
curl -X GET http://localhost:3000/api/auth/getAllUsers \
  -H "Authorization: Bearer your_jwt_token"
```

## JWT 令牌说明

### 令牌结构

JWT (JSON Web Token) 由三部分组成，每部分用点 (.) 分隔：

1. **Header (头部)**
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```

2. **Payload (负载)**
   ```json
   {
     "id": "用户ID",
     "username": "用户名",
     "iat": "签发时间",
     "exp": "过期时间"
   }
   ```

3. **Signature (签名)**
   - 使用 JWT_SECRET 进行签名
   - 用于验证令牌的完整性

### 使用说明

1. **获取令牌**
   - 通过登录接口获取 JWT 令牌

2. **使用令牌**
   - 在请求头中添加：
   ```http
   Authorization: Bearer <your_token>
   ```

3. **令牌有效期**
   - 默认有效期为 1 小时
   - 过期后需要重新登录获取新令牌

### 安全建议

1. **传输安全**
   - 始终使用 HTTPS 传输
   - 不要在 URL 中传递令牌

2. **存储安全**
   - 客户端使用安全的存储方式（如 HttpOnly Cookie）
   - 不要在本地存储中明文保存

3. **令牌管理**
   - 实现令牌刷新机制
   - 维护令牌黑名单
   - 定期更换签名密钥

## 开发测试

使用 cURL 测试登录接口：

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"your_username\",\"password\":\"your_password\"}"
```

使用 JWT 令牌访问受保护的接口：

```bash
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer your_jwt_token"
```