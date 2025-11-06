import { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { WalletConnect } from './components/WalletConnect';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { UrlShortener } from './components/UrlShortener';
import { Analytics } from './components/Analytics';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('shorten');
  const wallet = useWallet();

  // No auth loading anymore

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔗 x402 URL Shortener</h1>
        <p className="tagline">Pay with crypto to shorten URLs</p>
      </header>

      <div className="main-content">
        {/* Auth removed: always show app */}
        <div className="wallet-section">
          <WalletConnect wallet={wallet} />
        </div>

        <div className="tabs">
          <button
            onClick={() => setActiveTab('shorten')}
            className={`tab-button ${activeTab === 'shorten' ? 'active' : ''}`}
          >
            Shorten URL
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            Analytics
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'shorten' && <UrlShortener wallet={wallet} />}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
}

export default App;
