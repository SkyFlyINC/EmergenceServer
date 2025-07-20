# 认证 API - 登录与注册

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

## 管理员创建用户接口

### 请求信息

- **路径**: `/api/auth/createUser`
- **方法**: `POST`
- **授权**: 需要管理员权限 (JWT Token)
- **Content-Type**: `application/json`

### 请求体

```json
{
  "username": "new_user",
  "password": "secure_password",
  "email": "user@example.com",
  "permission": 1
}
```

### 响应示例

#### 成功响应 (201 Created)

```json
{
  "message": "用户创建成功",
  "user": {
    "id": 3,
    "username": "new_user",
    "email": "user@example.com",
    "permission": 1,
    "data": "{}"
  }
}
```

#### 错误响应

##### 权限不足 (403 Forbidden)
```json
{
  "message": "权限不足"
}
```

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
curl -X POST http://localhost:3000/api/auth/createUser \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "password": "secure_password",
    "email": "user@example.com",
    "permission": 0
  }'
```