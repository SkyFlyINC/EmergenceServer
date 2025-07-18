# 课程 API 文档

## 创建课程接口

### 请求信息

- **路径**: `/api/course`
- **方法**: `POST`
- **Content-Type**: `application/json`
- **授权**: 需要管理员权限 (JWT Token)

### 请求体

```json
{
  "course_name": "课程名称",
  "description": "课程描述",
  "instructor": "讲师名称",
  "duration": "课程时长"
}
```

### 响应示例

#### 成功响应 (201 Created)

```json
{
  "message": "课程创建成功",
  "course": {
    "id": 1,
    "course_name": "课程名称",
    "description": "课程描述",
    "instructor": "讲师名称",
    "duration": "课程时长"
  }
}
```

#### 错误响应

##### 未授权访问 (401 Unauthorized)
```json
{
  "message": "未授权访问"
}
```

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

##### 服务器错误 (500 Internal Server Error)
```json
{
  "message": "服务器错误"
}
```

### 测试示例

```bash
curl -X POST http://localhost:3000/api/course \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "course_name": "JavaScript基础",
    "description": "从零开始学习JavaScript",
    "instructor": "张教授",
    "duration": "8周"
  }'
```

## 删除课程接口

### 请求信息

- **路径**: `/api/course/:id`
- **方法**: `DELETE`
- **授权**: 需要管理员权限 (JWT Token)

### 请求参数

| 参数 | 类型 | 描述 |
|------|------|------|
| id | number | 课程ID |

### 响应示例

#### 删除成功 (200 OK)

```json
{
  "message": "课程删除成功"
}
```

#### 课程未找到 (404 Not Found)

```json
{
  "message": "课程未找到"
}
```

### 测试示例

```bash
curl -X DELETE http://localhost:3000/api/course/1 \
  -H "Authorization: Bearer your_jwt_token"
```

## 更新课程接口

### 请求信息

- **路径**: `/api/course/:id`
- **方法**: `PUT`
- **Content-Type**: `application/json`
- **授权**: 需要管理员权限 (JWT Token)

### 请求参数

| 参数 | 类型 | 描述 |
|------|------|------|
| id | number | 课程ID |

### 请求体

```json
{
  "course_name": "更新后的课程名称",
  "description": "更新后的课程描述",
  "instructor": "更新后的讲师名称",
  "duration": "更新后的课程时长"
}
```

### 响应示例

#### 更新成功 (200 OK)

```json
{
  "message": "课程更新成功",
  "course": {
    "id": 1,
    "course_name": "更新后的课程名称",
    "description": "更新后的课程描述",
    "instructor": "更新后的讲师名称",
    "duration": "更新后的课程时长"
  }
}
```

## 获取所有课程接口

### 请求信息

- **路径**: `/api/course`
- **方法**: `GET`

### 响应示例

#### 成功响应 (200 OK)

```json
[
  {
    "id": 1,
    "course_name": "JavaScript基础",
    "description": "从零开始学习JavaScript",
    "instructor": "张教授",
    "duration": "8周"
  },
  {
    "id": 2,
    "course_name": "Python数据分析",
    "description": "使用Python进行数据分析",
    "instructor": "李教授",
    "duration": "10周"
  }
]
```

### 测试示例

```bash
curl -X GET http://localhost:3000/api/course
```

## 根据ID获取课程接口

### 请求信息

- **路径**: `/api/course/:id`
- **方法**: `GET`

### 请求参数

| 参数 | 类型 | 描述 |
|------|------|------|
| id | number | 课程ID |

### 响应示例

#### 成功响应 (200 OK)

```json
{
  "id": 1,
  "course_name": "JavaScript基础",
  "description": "从零开始学习JavaScript",
  "instructor": "张教授",
  "duration": "8周"
}
```

#### 课程未找到 (404 Not Found)

```json
{
  "message": "课程未找到"
}
```

### 测试示例

```bash
curl -X GET http://localhost:3000/api/course/1
```

## 根据名称搜索课程接口

### 请求信息

- **路径**: `/api/course/course_name/:course_name`
- **方法**: `GET`

### 请求参数

| 参数 | 类型 | 描述 |
|------|------|------|
| course_name | string | 课程名称 |

### 响应示例

#### 成功响应 (200 OK)

```json
[
  {
    "id": 1,
    "course_name": "JavaScript基础",
    "description": "从零开始学习JavaScript",
    "instructor": "张教授",
    "duration": "8周"
  }
]
```

#### 未找到相关课程 (404 Not Found)

```json
{
  "message": "未找到相关课程"
}
```

### 测试示例

```bash
curl -X GET http://localhost:3000/api/course/course_name/JavaScript基础
```