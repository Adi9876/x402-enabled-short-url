import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function Signup({ onSwitchToLogin }) {
  const { signup, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    const result = await signup(name, email, password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
          />
        </div>
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
            placeholder="Choose a password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Account created! Redirecting to login...</div>}
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="link-button">
          Login
        </button>
      </p>
    </div>
  );
}

