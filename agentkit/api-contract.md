# AgentKit 后端接口契约（最小可用）

## 1) 发送消息

`POST /api/v1/chat/messages`

### Request

```json
{
  "project_id": "proj_123",
  "session_id": "sess_001",
  "message": "请帮我检查图纸",
  "attachments": ["file_001"]
}
```

### Response

```json
{
  "run_id": "run_abc123",
  "session_id": "sess_001",
  "accepted": true
}
```

---

## 2) 订阅事件流（SSE）

`GET /api/v1/chat/runs/{run_id}/events`

`Content-Type: text/event-stream`

事件 `data` 示例：

```json
{"type":"thinking","content":"正在分析图签规范..."}
{"type":"tool_start","call_id":"c1","tool":"parse_drawing","args":{"file":"A.pdf"}}
{"type":"tool_progress","call_id":"c1","content":"已处理第 3/12 页","percent":25}
{"type":"tool_done","call_id":"c1","tool":"parse_drawing","summary":"识别到 47 个元素","elapsed_ms":1400}
{"type":"ask_user","question":"请选择版本","options":["A","B"]}
{"type":"artifact","title":"审查报告_A-001.docx","file_type":"docx","artifact_id":"art_001"}
{"type":"text_delta","content":"已完成图签检查，"}
{"type":"text_done"}
{"type":"done","iterations":3,"tool_calls":5,"elapsed_ms":8200}
```

---

## 3) 上传文件

`POST /api/v1/files`

`multipart/form-data`，字段：`file`

### Response

```json
{
  "file_id": "file_001",
  "name": "A-001.pdf",
  "size": 123456
}
```

---

## 4) 下载产物

`GET /api/v1/artifacts/{artifact_id}`

- 返回文件流（`application/octet-stream` 或具体 MIME）
- 响应头建议包含：`Content-Disposition: attachment`

---

## 5) 错误格式（统一）

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "message is required",
    "request_id": "req_xxx"
  }
}
```

