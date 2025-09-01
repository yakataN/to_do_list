import { render } from '@testing-library/react';
import App from './App';

describe('index.js', () => {
  test('Appコンポーネントが描画される', () => {
    render(<App />);
    // ToDoリストの見出しが表示される
    expect(document.querySelector('h2')).toBeInTheDocument();
  });
});
