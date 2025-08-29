const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'tasks.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

app.use(cors());
app.use(bodyParser.json());

// ユーザー登録
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'ユーザー名とパスワードは必須です' });
  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    let users = [];
    if (!err && data) {
      try { users = JSON.parse(data); } catch {}
    }
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: '既に登録済みのユーザー名です' });
    }
    const hashed = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashed });
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), err => {
      if (err) return res.status(500).json({ error: '登録失敗' });
      // 登録成功時にtokenを返す
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// ログイン
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    let users = [];
    if (!err && data) {
      try { users = JSON.parse(data); } catch {}
    }
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'ユーザー名またはパスワードが違います' });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'ユーザー名またはパスワードが違います' });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// 認証ミドルウェア
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '認証が必要です' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'トークンが無効です' });
  }
}

// タスク一覧取得
app.get('/api/tasks', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.json([]);
    try {
      res.json(JSON.parse(data));
    } catch {
      res.json([]);
    }
  });
});

// タスク追加
app.post('/api/tasks', (req, res) => {
  const newTask = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let tasks = [];
    if (!err && data) {
      try { tasks = JSON.parse(data); } catch {}
    }
    tasks.push(newTask);
    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), err => {
      if (err) return res.status(500).send('保存失敗');
      res.json(newTask);
    });
  });
});

// タスク削除
app.delete('/api/tasks/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let tasks = [];
    if (!err && data) {
      try { tasks = JSON.parse(data); } catch {}
    }
    if (idx >= 0 && idx < tasks.length) {
      tasks.splice(idx, 1);
      fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), err => {
        if (err) return res.status(500).send('削除失敗');
        res.json({ success: true });
      });
    } else {
      res.status(400).send('不正なインデックス');
    }
  });
});

// タスク更新
app.put('/api/tasks/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  const updatedTask = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let tasks = [];
    if (!err && data) {
      try { tasks = JSON.parse(data); } catch {}
    }
    if (idx >= 0 && idx < tasks.length) {
      tasks[idx] = updatedTask;
      fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), err => {
        if (err) return res.status(500).send('更新失敗');
        res.json(updatedTask);
      });
    } else {
      res.status(400).send('不正なインデックス');
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`APIサーバー起動: http://localhost:${PORT}`);
  });
}

module.exports = app;
