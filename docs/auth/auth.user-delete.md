# 认证 API - 用户删除

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