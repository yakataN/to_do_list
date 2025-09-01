import { render } from '@testing-library/react';
import PieChart from './PieChart';

describe('PieChart', () => {
  test('コンポーネントが描画される', () => {
    render(<PieChart data={[{ value: 1, color: '#fff' }]} />);
    // svg要素が描画されること
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});
