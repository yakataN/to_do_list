import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  test('ログイン画面が表示される', () => {
    render(<Login onLogin={() => {}} />);
    expect(screen.getByRole('heading', { name: /ログイン/ })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ユーザー名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
  });

  test('ユーザー名・パスワード入力でボタンが有効になる', () => {
    render(<Login onLogin={() => {}} />);
    const userInput = screen.getByPlaceholderText('ユーザー名');
    const passInput = screen.getByPlaceholderText('パスワード');
    const loginButton = screen.getByRole('button', { name: 'ログイン' });
    fireEvent.change(userInput, { target: { value: 'testuser' } });
    fireEvent.change(passInput, { target: { value: 'testpass' } });
    expect(loginButton).not.toBeDisabled();
  });

  test('新規登録画面に切り替わる', () => {
    render(<Login onLogin={() => {}} />);
    const switchButton = screen.getByRole('button', { name: '新規登録はこちら' });
    fireEvent.click(switchButton);
    expect(screen.getByRole('heading', { name: /新規登録/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument();
  });

  test('ログイン失敗時にエラーメッセージが表示される', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'ログイン失敗' })
    });
    render(<Login onLogin={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('ユーザー名'), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    await waitFor(() => {
      expect(screen.getByText('ログイン失敗')).toBeInTheDocument();
    });
  });

  test('通信エラー時にエラーメッセージが表示される', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('network error'));
    render(<Login onLogin={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('ユーザー名'), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    await waitFor(() => {
      expect(screen.getByText('通信エラー')).toBeInTheDocument();
    });
  });
});
