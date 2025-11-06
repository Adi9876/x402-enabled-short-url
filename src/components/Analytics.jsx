import { useState } from 'react';
import axios from 'axios';

export function Analytics() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
  const api = axios.create({ baseURL: API_BASE_URL });
  const [shortId, setShortId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async (e) => {
    e.preventDefault();
    
    if (!shortId) {
      setError('Please enter a short URL ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalytics(null);

    try {
      const response = await api.get(`/url/analytics/${shortId}`);
      setAnalytics(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch analytics';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="analytics">
      <h2>URL Analytics</h2>
      <form onSubmit={fetchAnalytics} className="analytics-form">
        <div className="form-group">
          <input
            type="text"
            value={shortId}
            onChange={(e) => setShortId(e.target.value)}
            placeholder="Enter short URL ID"
            required
            disabled={isLoading}
            className="url-input"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Loading...' : 'Get Analytics'}
        </button>
      </form>

      {analytics && (
        <div className="analytics-results">
          <div className="stat-box">
            <h3>Total Clicks</h3>
            <p className="stat-number">{analytics.totalClicks}</p>
          </div>
          
          {analytics.analytics && analytics.analytics.length > 0 && (
            <div className="click-history">
              <h3>Click History</h3>
              <div className="history-list">
                {analytics.analytics.map((click, index) => (
                  <div key={index} className="history-item">
                    <span className="timestamp">
                      {new Date(click.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

