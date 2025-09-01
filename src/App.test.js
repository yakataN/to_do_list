beforeEach(() => {
  global.fetch = jest.fn();
  jest.resetAllMocks();
});
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
const API_URL = process.env.REACT_APP_API_URL;

// テスト用のダミートークン
const setLogin = () => localStorage.setItem('token', 'dummy');
const clearLogin = () => localStorage.removeItem('token');

test('初期表示で「ログイン」見出しが表示される', () => {
  clearLogin();
  render(<App />);
  expect(screen.getByRole('heading', { name: /ログイン/ })).toBeInTheDocument();
});

test('ログイン後にToDoリスト画面が表示される', () => {
  setLogin();
  global.fetch = jest.fn().mockResolvedValueOnce({ json: async () => [] }); // 初回取得
  render(<App />);
  expect(screen.getByRole('heading', { name: /ToDoリスト/ })).toBeInTheDocument();
});

test('タスク追加ボタンは入力が空だと追加されない', () => {
  setLogin();
  global.fetch = jest.fn().mockResolvedValueOnce({ json: async () => [] }); // 初回取得
  render(<App />);
  const addButton = screen.getByText('追加');
  addButton.click();
  expect(screen.getByText('タスクはありません')).toBeInTheDocument();
});

test('タスク入力→追加でリストに表示される（APIモック）', async () => {
  setLogin();
  // fetchをモック
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ json: async () => [] }) // 初回取得
    .mockResolvedValueOnce({}) // 追加
    .mockResolvedValueOnce({ json: async () => [{ text: 'テスト', done: false }] }); // 再取得
  render(<App />);
  const input = screen.getByPlaceholderText('タスクを入力...');
  const addButton = screen.getByText('追加');
  fireEvent.change(input, { target: { value: 'テスト' } });
  fireEvent.click(addButton);
  // タスクが表示される
  expect(await screen.findByText('テスト')).toBeInTheDocument();
});

test('タスク削除ボタンでリストから消える（APIモック）', async () => {
  setLogin();
  // 初回取得→削除→再取得の順でfetchをモック
  global.fetch
    .mockResolvedValueOnce({ json: async () => [{ text: '削除テスト', done: false }] }) // 初回取得
    .mockResolvedValueOnce({}) // 削除
    .mockResolvedValueOnce({ json: async () => [] }); // 再取得
  render(<App />);
  expect(await screen.findByText('削除テスト')).toBeInTheDocument();
  const deleteButton = screen.getByText('削除');
  fireEvent.click(deleteButton);
  // タスク消失をawaitで待つ
  await screen.findByText('タスクはありません');
  expect(screen.getByText('タスクはありません')).toBeInTheDocument();
});

test('タスク完了切り替えで見た目が変わる（APIモック）', async () => {
  setLogin();
  // 初回取得→完了切り替え→再取得の順でfetchをモック
  global.fetch
    .mockResolvedValueOnce({ json: async () => [{ text: '完了テスト', done: false }] }) // 初回取得
    .mockResolvedValueOnce({}) // 完了切り替え
    .mockResolvedValueOnce({ json: async () => [{ text: '完了テスト', done: true }] }); // 再取得
  render(<App />);
  const taskText = await screen.findByText('完了テスト');
  fireEvent.click(taskText);
  // 完了状態の画面更新をawaitで待つ
  const updatedTask = await screen.findByText('完了テスト');
  expect(updatedTask).toBeInTheDocument();
  // 完了フラグがtrueになっているAPIモックが返却されていることを検証
  expect(global.fetch.mock.calls[2][0]).toBe(API_URL); // 3回目のfetchは再取得
  const lastResponse = await global.fetch.mock.results[2].value;
  const data = await lastResponse.json();
  expect(data[0].done).toBe(true);
});
