import { render, screen, waitFor, act } from '@testing-library/react';
import StatusPage from '@/app/status/page';

// Mock fetch
global.fetch = jest.fn();

describe('StatusPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders status data correctly', async () => {
    const mockData = {
      services: [
        { id: '1', name: 'API', description: 'Core API', status: 'operational', icon: 'Server', uptime: '99.9%' },
        { id: '2', name: 'Database', description: 'Main DB', status: 'maintenance', icon: 'Database' },
      ],
      metrics: [
        { label: 'Users', value: '1000', icon: 'Users' },
      ],
      lastUpdated: '12:00:00',
      userRole: 'user',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    render(<StatusPage />);

    await waitFor(() => {
      expect(screen.getByText('API')).toBeInTheDocument();
      expect(screen.getByText('Core API')).toBeInTheDocument();
      expect(screen.getAllByText('Operational').length).toBeGreaterThan(0);
      
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getAllByText('Maintenance').length).toBeGreaterThan(0);
      
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });
  });

  it('polls for data', async () => {
    const mockData = { services: [], metrics: [] };
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    render(<StatusPage />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });
});
