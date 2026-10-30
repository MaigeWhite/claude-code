# AgentKit 源码部署说明（先看前端 UI）

你现在后端用 Python 开发，这里先只看页面效果即可。

## 1) 只看网页效果（不依赖后端）

前端已经内置 Mock 模式（`frontend/app.js` 里的 `MOCK_MODE = true`）。

启动静态服务：

```bash
cd agentkit/frontend
python3 -m http.server 5500
```

浏览器打开：

`http://localhost:5500`

## 2) 如何改页面 UI

你只需要改这 3 个文件：

- `frontend/index.html`：结构布局（标题、输入框、按钮、区块）
- `frontend/styles.css`：颜色、间距、字体、圆角、阴影
- `frontend/app.js`：交互逻辑（发送/回车/消息渲染）

常见改法：

1. 改背景色：`styles.css` 的 `--bg`
2. 改主按钮颜色：`.send-btn`
3. 改输入框样式：`#ta`
4. 改消息气泡：`.msg` / `.msg.user`

## 3) 后续接你的 Python 后端

当你准备联调时：

- 把 `frontend/app.js` 的 `MOCK_MODE` 改为 `false`
- 让 Python 后端提供：
  - `POST /api/v1/chat/messages`
  - `GET /api/v1/chat/runs/{run_id}/events`（SSE）

## 4) 目录结构

```text
agentkit/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── backend/
├── deploy/
├── api-contract.md
├── docker-compose.yml
└── .env.example
```
