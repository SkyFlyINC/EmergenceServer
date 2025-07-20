# 认证 API - 密码修改

## 修改密码接口

### 请求信息

- **路径**: `/api/auth/changePassword`
- **方法**: `PUT`
- **授权**: 需要JWT令牌
- **Content-Type**: `application/json`

### 请求体

```json
{
  "oldPassword": "current_password",
  "newPassword": "new_secure_password"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "密码修改成功"
}
```

#### 密码错误 (400 Bad Request)
```json
{
  "message": "原密码错误"
}
```

#### 未授权访问 (401 Unauthorized)
```json
{
  "message": "未授权访问"
}
```

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/changePassword \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "current_password",
    "newPassword": "new_secure_password"
  }'
```

## 根据ID修改密码接口

### 请求信息

- **路径**: `/api/auth/changePassword/:id`
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
  "newPassword": "new_secure_password"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "密码修改成功"
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

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/changePassword/2 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "new_secure_password"
  }'
```