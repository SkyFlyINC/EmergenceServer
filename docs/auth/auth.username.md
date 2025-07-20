# 认证 API - 用户名更新

## 更新用户名接口

### 请求信息

- **路径**: `/api/auth/updateUsername`
- **方法**: `PUT`
- **授权**: 需要JWT令牌
- **Content-Type**: `application/json`

### 请求体

```json
{
  "username": "new_username",
  "password": "your_current_password"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "用户名更新成功",
  "user": {
    "id": 1,
    "username": "new_username",
    "email": "user@example.com",
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

#### 用户名已存在 (409 Conflict)
```json
{
  "message": "用户名已存在"
}
```

#### 用户名格式无效 (400 Bad Request)
```json
{
  "message": "用户名格式无效"
}
```

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/updateUsername \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_username",
    "password": "your_current_password"
  }'
```

## 根据ID更新用户名接口

### 请求信息

- **路径**: `/api/auth/updateUsername/:id`
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
  "username": "new_username"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "用户名更新成功",
  "user": {
    "id": 2,
    "username": "new_username",
    "email": "user@example.com",
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

#### 用户名已存在 (409 Conflict)
```json
{
  "message": "用户名已存在"
}
```

#### 用户名格式无效 (400 Bad Request)
```json
{
  "message": "用户名格式无效"
}
```

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/updateUsername/2 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_username"
  }'
```