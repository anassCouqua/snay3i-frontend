import { render, screen } from '@testing-library/react';
import App, { CITIES } from './App';

test('keeps the city selector free of duplicate options', () => {
  expect(new Set(CITIES).size).toBe(CITIES.length);
});

test('renders the Snay3i homepage search experience', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { level: 1, name: /Votre Snay3i à portée de main/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: /Filtrer par service/i })).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: /Filtrer par ville/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'عربي' })).toBeInTheDocument();
});
