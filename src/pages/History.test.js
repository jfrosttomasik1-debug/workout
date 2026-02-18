import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from './History';

const mockUseHistory = jest.fn();

jest.mock('../contexts/HistoryContext', () => ({
  useHistory: () => mockUseHistory(),
  HistoryProvider: ({ children }) => children,
}));

const renderHistory = () =>
  render(
    <BrowserRouter>
      <History />
    </BrowserRouter>
  );

describe('History page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows "Recently Viewed" heading', () => {
    mockUseHistory.mockReturnValue({
      history: [],
      clearHistory: jest.fn(),
    });
    renderHistory();
    expect(screen.getByText('Recently Viewed')).toBeInTheDocument();
  });

  test('shows empty state when history is empty', () => {
    mockUseHistory.mockReturnValue({
      history: [],
      clearHistory: jest.fn(),
    });
    renderHistory();
    expect(screen.getByText('No exercises viewed yet')).toBeInTheDocument();
    expect(
      screen.getByText("Browse exercises and they'll appear here automatically.")
    ).toBeInTheDocument();
  });

  test('renders history entries when history has data', () => {
    mockUseHistory.mockReturnValue({
      history: [
        {
          exercise: {
            id: '1',
            name: 'Bench Press',
            bodyPart: 'chest',
            target: 'pectorals',
            gifUrl: 'test.gif',
          },
          viewedAt: '2025-06-15T10:30:00.000Z',
        },
        {
          exercise: {
            id: '2',
            name: 'Squat',
            bodyPart: 'upper legs',
            target: 'quads',
            gifUrl: 'test2.gif',
          },
          viewedAt: '2025-06-14T08:00:00.000Z',
        },
      ],
      clearHistory: jest.fn(),
    });
    renderHistory();
    expect(screen.queryByText('No exercises viewed yet')).not.toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squat')).toBeInTheDocument();
  });

  test('shows "Clear History" button when history exists', () => {
    mockUseHistory.mockReturnValue({
      history: [
        {
          exercise: {
            id: '1',
            name: 'Bench Press',
            bodyPart: 'chest',
            target: 'pectorals',
            gifUrl: 'test.gif',
          },
          viewedAt: '2025-06-15T10:30:00.000Z',
        },
      ],
      clearHistory: jest.fn(),
    });
    renderHistory();
    expect(screen.getByText('Clear History')).toBeInTheDocument();
  });

  test('does not show "Clear History" button when history is empty', () => {
    mockUseHistory.mockReturnValue({
      history: [],
      clearHistory: jest.fn(),
    });
    renderHistory();
    expect(screen.queryByText('Clear History')).not.toBeInTheDocument();
  });
});

