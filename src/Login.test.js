import { render, screen, fireEvent } from '@testing-library/react';
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
});
