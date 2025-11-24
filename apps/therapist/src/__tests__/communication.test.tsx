import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TherapistEmailForm } from '@/components/therapist/TherapistEmailForm';
import { sendTherapistEmail, previewTherapistEmail } from '@/app/actions/therapist-email';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/app/actions/therapist-email', () => ({
  sendTherapistEmail: jest.fn(),
  previewTherapistEmail: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Select components to allow easy interaction
jest.mock('@/components/ui/select', () => ({
  Select: ({ onValueChange, children, value }: any) => (
    <div data-testid="mock-select">
      <select 
        data-testid="native-select"
        value={value} 
        onChange={e => onValueChange(e.target.value)}
      >
        <option value="">Select a patient...</option>
        <option value="p1">John Doe</option>
        <option value="p2">Jane Smith</option>
      </select>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <div>{placeholder}</div>,
  SelectContent: () => null,
  SelectItem: () => null,
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock pointer capture
Element.prototype.setPointerCapture = jest.fn();
Element.prototype.releasePointerCapture = jest.fn();
Element.prototype.hasPointerCapture = jest.fn();

describe('TherapistEmailForm', () => {
  const mockPatients = [
    { id: 'p1', name: 'John Doe', email: 'john@example.com' },
    { id: 'p2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with patient selection', () => {
    render(<TherapistEmailForm patients={mockPatients} />);
    expect(screen.getByText('Send Patient Email')).toBeInTheDocument();
    // Check for placeholder text (might appear multiple times due to mock structure)
    expect(screen.getAllByText('Select a patient...').length).toBeGreaterThan(0);
  });

  it('disables send button when no patient selected', () => {
    render(<TherapistEmailForm patients={mockPatients} />);
    const sendBtn = screen.getByRole('button', { name: 'Send Email' });
    expect(sendBtn).toBeDisabled();
  });

  it('enables send button when patient selected', () => {
    render(<TherapistEmailForm patients={mockPatients} />);
    
    const select = screen.getByTestId('native-select');
    fireEvent.change(select, { target: { value: 'p1' } });
    
    const sendBtn = screen.getByRole('button', { name: 'Send Email' });
    expect(sendBtn).not.toBeDisabled();
  });

  it('sends email with correct data', async () => {
    (sendTherapistEmail as jest.Mock).mockResolvedValue({ success: true });
    
    render(<TherapistEmailForm patients={mockPatients} />);
    
    // Select patient
    const select = screen.getByTestId('native-select');
    fireEvent.change(select, { target: { value: 'p1' } });
    
    // Fill subject
    const subjectInput = screen.getByPlaceholderText('New Homework Assignment'); // Default for homework
    fireEvent.change(subjectInput, { target: { value: 'My Custom Subject' } });
    
    // Fill assignment title (Homework tab is default)
    const titleInput = screen.getByPlaceholderText('e.g. CBT Worksheet');
    fireEvent.change(titleInput, { target: { value: 'Worksheet 1' } });
    
    // Click send
    const sendBtn = screen.getByRole('button', { name: 'Send Email' });
    fireEvent.click(sendBtn);
    
    await waitFor(() => {
      expect(sendTherapistEmail).toHaveBeenCalled();
    });
    
    const formData = (sendTherapistEmail as jest.Mock).mock.calls[0][0] as FormData;
    expect(formData.get('patientId')).toBe('p1');
    expect(formData.get('type')).toBe('homework');
    expect(formData.get('subject')).toBe('My Custom Subject');
    
    const data = JSON.parse(formData.get('data') as string);
    expect(data.assignmentTitle).toBe('Worksheet 1');
    
    expect(toast.success).toHaveBeenCalledWith('Email sent successfully');
  });

  it('handles send error', async () => {
    (sendTherapistEmail as jest.Mock).mockResolvedValue({ success: false, error: 'Network error' });
    
    render(<TherapistEmailForm patients={mockPatients} />);
    
    const select = screen.getByTestId('native-select');
    fireEvent.change(select, { target: { value: 'p1' } });
    
    const sendBtn = screen.getByRole('button', { name: 'Send Email' });
    fireEvent.click(sendBtn);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });
});
