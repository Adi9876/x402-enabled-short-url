import { useWallet } from '../hooks/useWallet';

export function WalletConnect() {
  const { account, isConnected, isConnecting, error, connectWallet, disconnectWallet, isMetaMaskInstalled } = useWallet();

  if (!isMetaMaskInstalled()) {
    return (
      <div className="wallet-connect">
        <div className="wallet-error">
          <p>MetaMask is not installed</p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="install-link"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="wallet-connect">
        <div className="wallet-connected">
          <div className="wallet-info">
            <span className="wallet-label">Connected:</span>
            <span className="wallet-address">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
          </div>
          <button onClick={disconnectWallet} className="btn btn-secondary">
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="btn btn-primary"
      >
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      {error && <div className="wallet-error">{error}</div>}
    </div>
  );
}

