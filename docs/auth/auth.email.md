# 认证 API - 邮箱更新

## 更新邮箱接口

### 请求信息

- **路径**: `/api/auth/updateEmail`
- **方法**: `PUT`
- **授权**: 需要JWT令牌
- **Content-Type**: `application/json`

### 请求体

```json
{
  "email": "new_email@example.com",
  "password": "your_current_password"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "邮箱更新成功",
  "user": {
    "id": 1,
    "username": "your_username",
    "email": "new_email@example.com",
    "permission": 1,
    "data": "{}"
  }
}
```

#### 密码错误 (400 Bad Request)
```json
{
  "message": "密码错误"
}
```

#### 未授权访问 (401 Unauthorized)
```json
{
  "message": "未授权访问"
}
```

#### 邮箱格式无效 (400 Bad Request)
```json
{
  "message": "邮箱格式无效"
}
```

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/updateEmail \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new_email@example.com",
    "password": "your_current_password"
  }'
```

## 根据ID更新邮箱接口

### 请求信息

- **路径**: `/api/auth/updateEmail/:id`
- **方法**: `PUT`
- **授权**: 需要管理员权限 (JWT Token)
- **Content-Type**: `application/json`

### 请求参数

| 参数 | 类型 | 描述 |
|------|------|------|
| id | number | 用户ID |

### 请求体

```json
{
  "email": "new_email@example.com"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "邮箱更新成功",
  "user": {
    "id": 2,
    "username": "target_user",
    "email": "new_email@example.com",
    "permission": 1,
    "data": "{}"
  }
}
```

#### 权限不足 (403 Forbidden)
```json
{
  "message": "权限不足"
}
```

#### 用户未找到 (404 Not Found)
```json
{
  "message": "用户未找到"
}
```

#### 邮箱格式无效 (400 Bad Request)
```json
{
  "message": "邮箱格式无效"
}
```

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/updateEmail/2 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new_email@example.com"
  }'
```