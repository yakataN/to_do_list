const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(bodyParser.json());

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
