# 认证 API - 用户信息获取

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