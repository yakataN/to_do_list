const request = require('supertest');
const fs = require('fs');
const path = require('path');
let app;
let server;

const DATA_FILE = path.join(__dirname, '../tasks.json');

beforeAll((done) => {
  app = require('../index');
  server = app.listen(4001, done); // テスト用ポート
});
afterAll((done) => {
  server && server.close(done);
});

beforeEach(() => {
  // テスト前にtasks.jsonを初期化
  fs.writeFileSync(DATA_FILE, '[]');
});

describe('ToDo API', () => {
  test('GET /api/tasks 初期は空配列', async () => {
  const res = await request(server).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/tasks タスク追加', async () => {
    const newTask = { text: 'テスト', done: false };
  const res = await request(server).post('/api/tasks').send(newTask);
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('テスト');
    // 追加後GETで確認
  const getRes = await request(server).get('/api/tasks');
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].text).toBe('テスト');
  });

  test('PUT /api/tasks/:index タスク更新', async () => {
  await request(server).post('/api/tasks').send({ text: 'A', done: false });
  const updated = { text: 'A', done: true };
  const res = await request(server).put('/api/tasks/0').send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  const getRes = await request(server).get('/api/tasks');
    expect(getRes.body[0].done).toBe(true);
  });

  test('DELETE /api/tasks/:index タスク削除', async () => {
  await request(server).post('/api/tasks').send({ text: 'A', done: false });
  const res = await request(server).delete('/api/tasks/0');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  const getRes = await request(server).get('/api/tasks');
    expect(getRes.body.length).toBe(0);
  });
});
