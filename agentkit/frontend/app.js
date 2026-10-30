const S = { running: false, sessionId: `sess_${Date.now()}`, files: [] };
const MOCK_MODE = true;

function addMsg(text, user = false) {
  const ml = document.getElementById('msglist');
  ml.classList.remove('hidden');
  document.getElementById('welcome').classList.add('hidden');
  const div = document.createElement('div');
  div.className = `msg ${user ? 'user' : ''}`;
  div.textContent = text;
  ml.appendChild(div);
  ml.scrollTop = ml.scrollHeight;
}

function renderFiles() {
  const wrap = document.getElementById('fileChips');
  if (!S.files.length) {
    wrap.classList.add('hidden');
    wrap.innerHTML = '';
    return;
  }
  wrap.classList.remove('hidden');
  wrap.innerHTML = S.files.map((f) => `<span class="chip">📎 ${f.name}</span>`).join('');
}

async function runMockReply(input) {
  S.running = true;
  const model = document.getElementById('modelSel').value;
  addMsg(`🤔 [${model}] 正在思考中...`);
  await new Promise((r) => setTimeout(r, 700));
  addMsg(`已收到：${input}`);
  if (S.files.length) addMsg(`已附带文件：${S.files.map((f) => f.name).join(', ')}`);
  S.running = false;
}

function send() {
  const ta = document.getElementById('ta');
  const text = ta.value.trim();
  if (!text || S.running) return;
  ta.value = '';
  addMsg(text, true);
  runMockReply(text).catch((err) => {
    console.error(err);
    addMsg('请求失败，请检查后端服务。');
    S.running = false;
  });
}

document.getElementById('sendBtn').addEventListener('click', send);
document.getElementById('ta').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

document.getElementById('uploadBtn').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
  S.files.push(...Array.from(e.target.files || []));
  e.target.value = '';
  renderFiles();
});
