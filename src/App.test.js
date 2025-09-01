import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

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
  render(<App />);
  expect(screen.getByRole('heading', { name: /ToDoリスト/ })).toBeInTheDocument();
});

test('タスク追加ボタンは入力が空だと追加されない', () => {
  setLogin();
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
