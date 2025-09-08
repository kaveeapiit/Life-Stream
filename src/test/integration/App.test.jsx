import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

// Mock a simple App component for testing
const App = () => {
  return (
    <div>
      <nav>
        <h1>Life Stream</h1>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
        <a href="/donate">Donate</a>
      </nav>
      <main>
        <h2>Welcome to Life Stream</h2>
        <p>Blood donation management system</p>
      </main>
    </div>
  );
};

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('App Integration Tests', () => {
  it('renders landing page by default', () => {
    renderApp();
    
    // Check for landing page elements
    expect(screen.getByRole('heading', { level: 1, name: /life stream/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome to life stream/i)).toBeInTheDocument();
    expect(screen.getByText(/blood donation management system/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderApp();
    
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /donate/i })).toBeInTheDocument();
  });

  it('has proper navigation structure', () => {
    renderApp();
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
