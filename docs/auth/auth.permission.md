# 认证 API - 权限更新

## 更新权限接口

### 请求信息

- **路径**: `/api/auth/updatePermission`
- **方法**: `PUT`
- **授权**: 需要管理员权限 (JWT Token)
- **Content-Type**: `application/json`

### 请求体

```json
{
  "userId": 2,
  "permission": 2
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "权限更新成功",
  "user": {
    "id": 2,
    "username": "target_user",
    "email": "user@example.com",
    "permission": 2,
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

#### 无效的权限值 (400 Bad Request)
```json
{
  "message": "无效的权限值"
}
```

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/updatePermission \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "permission": 2
  }'
```

## 根据ID更新权限接口

### 请求信息

- **路径**: `/api/auth/updatePermission/:id`
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
  "permission": 2
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "权限更新成功",
  "user": {
    "id": 2,
    "username": "target_user",
    "email": "user@example.com",
    "permission": 2,
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

#### 无效的权限值 (400 Bad Request)
```json
{
  "message": "无效的权限值"
}
```

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/updatePermission/2 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "permission": 2
  }'
```

## 权限级别说明

| 权限值 | 描述 |
|-------|------|
| 1 | 用户 - 可以访问基本功能 |
| 2 | 管理员 - 完全访问权限，可以管理其他用户 |
| 3 | 超级管理员 - 系统最高权限 |