import { render } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
});

test('renders without crashing', () => {
  render(<App />);
});
