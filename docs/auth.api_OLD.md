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

## 删除用户接口

### 请求信息

- **路径**: `/api/auth/deleteUser/:id`
- **方法**: `DELETE`
- **授权**: 需要管理员权限 (JWT Token)

### 请求参数

| 参数 | 类型 | 描述 |
|------|------|------|
| id | number | 用户ID |

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "用户删除成功",
  "deletedUserId": 2
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
curl -X DELETE http://localhost:3000/api/auth/deleteUser/2 \
  -H "Authorization: Bearer your_jwt_token"
```

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
