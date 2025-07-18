# 基本信息 API 文档

## 获取基本信息接口

### 请求信息

- **路径**: `/api/basic/:key`
- **方法**: `GET`

### 请求参数

| 参数 | 类型 | 描述 |
|------|------|------|
| key | string | 信息键名（如：site_name, contact_email 等） |

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "key": "site_name",
  "value": "Emergence 学习平台"
}
```

#### 信息未找到 (404 Not Found)

```json
{
  "message": "信息未找到"
}
```

#### 服务器错误 (500 Internal Server Error)

```json
{
  "message": "服务器错误"
}
```

### 测试示例

```bash
curl -X GET http://localhost:3000/api/basic/site_name
```

## 更新基本信息接口

### 请求信息

- **路径**: `/api/basic`
- **方法**: `PUT`
- **Content-Type**: `application/json`

### 请求体

```json
{
  "key": "site_name",
  "value": "Emergence 教育平台"
}
```

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "message": "基本信息更新成功",
  "result": {
    "affectedRows": 1
  }
}
```

#### 字段缺失 (400 Bad Request)

```json
{
  "message": "请提供所有必需字段"
}
```

#### 服务器错误 (500 Internal Server Error)

```json
{
  "message": "服务器错误"
}
```

### 测试示例

```bash
curl -X PUT http://localhost:3000/api/basic \
  -H "Content-Type: application/json" \
  -d '{
    "key": "site_name",
    "value": "Emergence 教育平台"
  }'
```