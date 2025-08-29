const request = require('supertest');
const fs = require('fs');
const path = require('path');
let app;
let server;

const USERS_FILE = path.join(__dirname, '../users.json');
const TASKS_FILE = path.join(__dirname, '../tasks.json');
let usersBackup = null;
let tasksBackup = null;

const DATA_FILE = path.join(__dirname, '../tasks.json');

beforeAll((done) => {
  app = require('../index');
  server = app.listen(4001, done); // テスト用ポート
  // ファイルバックアップ
  try {
  const USERS_FILE = path.join(__dirname, '../users.json'); // 変数宣言を1箇所に統一
  } catch { usersBackup = null; }
  try {
    tasksBackup = fs.readFileSync(TASKS_FILE, 'utf8');
  } catch { tasksBackup = null; }
});
afterAll((done) => {
  server && server.close(done);
  // ファイルリストア
  if (usersBackup !== null) {
    fs.writeFileSync(USERS_FILE, usersBackup);
  }
  if (tasksBackup !== null) {
    fs.writeFileSync(TASKS_FILE, tasksBackup);
  }
  done();
});


  beforeEach(() => {
  // tasks.json初期化（ユーザーごと管理用）
  fs.writeFileSync(DATA_FILE, '{}');
    // users.json初期化
    fs.writeFileSync(USERS_FILE, '[]');
  });

  describe('Auth API', () => {
    test('POST /api/register 新規登録成功', async () => {
      const res = await request(server)
        .post('/api/register')
        .send({ username: 'user1', password: 'pass1' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    test('POST /api/register 重複ユーザーはエラー', async () => {
      await request(server)
        .post('/api/register')
        .send({ username: 'user1', password: 'pass1' });
      const res = await request(server)
        .post('/api/register')
        .send({ username: 'user1', password: 'pass1' });
    expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test('POST /api/login ログイン成功', async () => {
      await request(server)
        .post('/api/register')
        .send({ username: 'user2', password: 'pass2' });
      const res = await request(server)
        .post('/api/login')
        .send({ username: 'user2', password: 'pass2' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    test('POST /api/login パスワード不一致はエラー', async () => {
      await request(server)
        .post('/api/register')
        .send({ username: 'user3', password: 'pass3' });
      const res = await request(server)
        .post('/api/login')
        .send({ username: 'user3', password: 'wrong' });
    expect(res.statusCode).toBe(401);
      expect(res.body.error).toBeDefined();
    });
  });

beforeEach(() => {
  // テスト前にtasks.jsonを初期化
  fs.writeFileSync(DATA_FILE, '[]');
});

describe('ToDo API', () => {
  let token1, token2;
  beforeEach(async () => {
    // user1, user2登録＆トークン取得
    const res1 = await request(server)
      .post('/api/register')
      .send({ username: 'user1', password: 'pass1' });
    token1 = res1.body.token;
    const res2 = await request(server)
      .post('/api/register')
      .send({ username: 'user2', password: 'pass2' });
    token2 = res2.body.token;
  });

  test('GET /api/tasks 初期は空配列', async () => {
    const res = await request(server)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/tasks タスク追加', async () => {
    const newTask = { text: 'テスト', done: false };
    const res = await request(server)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token1}`)
      .send(newTask);
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('テスト');
    // 追加後GETで確認
    const getRes = await request(server)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token1}`);
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].text).toBe('テスト');
  });

  test('ユーザーごとにタスクが分離される', async () => {
    // user1で追加
    await request(server)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token1}`)
      .send({ text: 'user1-task', done: false });
    // user2で追加
    await request(server)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token2}`)
      .send({ text: 'user2-task', done: false });
    // user1で取得
    const res1 = await request(server)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token1}`);
    expect(res1.body.length).toBe(1);
    expect(res1.body[0].text).toBe('user1-task');
    // user2で取得
    const res2 = await request(server)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token2}`);
    expect(res2.body.length).toBe(1);
    expect(res2.body[0].text).toBe('user2-task');
  });

  test('PUT /api/tasks/:index タスク更新', async () => {
    await request(server)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token1}`)
      .send({ text: 'A', done: false });
    const updated = { text: 'A', done: true };
    const res = await request(server)
      .put('/api/tasks/0')
      .set('Authorization', `Bearer ${token1}`)
      .send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
    const getRes = await request(server)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token1}`);
    expect(getRes.body[0].done).toBe(true);
  });

  test('DELETE /api/tasks/:index タスク削除', async () => {
    await request(server)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token1}`)
      .send({ text: 'A', done: false });
    const res = await request(server)
      .delete('/api/tasks/0')
      .set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const getRes = await request(server)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token1}`);
    expect(getRes.body.length).toBe(0);
  });
});
