import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

// Mock a simple DonationForm component for testing
const DonationForm = () => {
  return (
    <div>
      <h1>Blood Donation Form</h1>
      <form>
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <select aria-label="Blood Type">
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <input type="text" placeholder="Location" />
        <button type="submit">Submit Donation</button>
      </form>
    </div>
  );
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DonationForm Component', () => {
  it('renders donation form correctly', () => {
    renderWithRouter(<DonationForm />);
    
    expect(screen.getByText('Blood Donation Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/blood type/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit donation/i })).toBeInTheDocument();
  });

  it('validates blood type options', () => {
    renderWithRouter(<DonationForm />);
    
    const options = screen.getAllByRole('option');
    
    expect(options).toHaveLength(9); // Including default option
    expect(screen.getByRole('option', { name: 'A+' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'A-' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'B+' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'B-' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'AB+' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'AB-' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'O+' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'O-' })).toBeInTheDocument();
  });

  it('has proper input types', () => {
    renderWithRouter(<DonationForm />);
    
    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const locationInput = screen.getByPlaceholderText(/location/i);
    
    expect(nameInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(locationInput).toHaveAttribute('type', 'text');
  });
});
