import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function Login({ onSwitchToSignup }) {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    const result = await login(email, password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Login successful! Redirecting...</div>}
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="auth-switch">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="link-button">
          Sign up
        </button>
      </p>
    </div>
  );
}

