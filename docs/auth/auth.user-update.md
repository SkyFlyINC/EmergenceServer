# 认证 API - 用户信息更新

## 更新用户信息接口

### 请求信息

- **路径**: `/api/auth/updateUser`
- **方法**: `PUT`
- **授权**: 需要JWT令牌
- **Content-Type**: `application/json`

### 请求体

```json
{
  "username": "updated_username",
  "email": "updated_email@example.com",
  "permission": 1,
  "data": "{\"key\":\"value\"}"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "用户信息更新成功",
  "user": {
    "id": 1,
    "username": "updated_username",
    "email": "updated_email@example.com",
    "permission": 1,
    "data": "{\"key\":\"value\"}"
  }
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
curl -X PUT http://localhost:3000/api/auth/updateUser \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updated_username",
    "email": "updated_email@example.com"
  }'
```

## 根据ID更新用户信息接口

### 请求信息

- **路径**: `/api/auth/updateUser/:id`
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
  "username": "updated_username",
  "email": "updated_email@example.com",
  "permission": 1,
  "data": "{\"key\":\"value\"}"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "用户信息更新成功",
  "user": {
    "id": 2,
    "username": "updated_username",
    "email": "updated_email@example.com",
    "permission": 1,
    "data": "{\"key\":\"value\"}"
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

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/updateUser/2 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updated_username",
    "email": "updated_email@example.com"
  }'
```

## 更新用户数据接口

### 请求信息

- **路径**: `/api/auth/updateUserData`
- **方法**: `PUT`
- **授权**: 需要JWT令牌
- **Content-Type**: `application/json`

### 请求体

```json
{
  "data": "{\"preferences\":{\"theme\":\"dark\",\"language\":\"zh-CN\"}}"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "用户数据更新成功",
  "user": {
    "id": 1,
    "username": "your_username",
    "email": "user@example.com",
    "permission": 1,
    "data": "{\"preferences\":{\"theme\":\"dark\",\"language\":\"zh-CN\"}}"
  }
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
curl -X PUT http://localhost:3000/api/auth/updateUserData \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "data": "{\"preferences\":{\"theme\":\"dark\",\"language\":\"zh-CN\"}}"
  }'
```

## 根据ID更新用户数据接口

### 请求信息

- **路径**: `/api/auth/updateUserData/:id`
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
  "data": "{\"preferences\":{\"theme\":\"light\",\"language\":\"en-US\"}}"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "用户数据更新成功",
  "user": {
    "id": 2,
    "username": "target_user",
    "email": "target@example.com",
    "permission": 1,
    "data": "{\"preferences\":{\"theme\":\"light\",\"language\":\"en-US\"}}"
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

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/auth/updateUserData/2 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "data": "{\"preferences\":{\"theme\":\"light\",\"language\":\"en-US\"}}"
  }'
```