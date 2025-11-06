import { useState } from 'react';
import { createX402Client } from '../utils/x402Client';
// import { useAuth } from '../hooks/useAuth';

export function UrlShortener({ wallet }) {
    const { account, isConnected } = wallet;
    // const { api } = useAuth();
    const [url, setUrl] = useState('');
    const [shortId, setShortId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fullShortUrl, setFullShortUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isConnected || !account) {
            setError('Please connect your MetaMask wallet first');
            return;
        }

        if (!url) {
            setError('Please enter a URL');
            return;
        }

        setIsLoading(true);
        setError(null);
        setShortId(null);

        try {
            const x402Client = createX402Client(account);

            const response = await x402Client.post('/url', {
                url: url,
            });

            const id = response.data.id;
            setShortId(id);
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
            console.log("API BASE URL IS:  ", API_BASE_URL);
            setFullShortUrl(`${API_BASE_URL}/url/${id}`);
            setUrl('');
            if (response.headers['x-payment-response']) {
                console.log('Payment completed:', response.headers['x-payment-response']);
            }
        } catch (err) {
            console.error('Error shortening URL:', err);
            const errorMsg =
                err.response?.data?.error ||
                err.message ||
                'Failed to shorten URL. Please check your wallet has sufficient funds.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(fullShortUrl);
        alert('Copied to clipboard!');
    };


    return (
        <div className="url-shortener">
            <h2>Shorten URL</h2>
            <p className="subtitle">Pay with crypto to create short links</p>

            {!isConnected && (
                <div className="warning-message">
                    ⚠️ Connect your MetaMask wallet to create short URLs
                </div>
            )}

            <form onSubmit={handleSubmit} className="url-form">
                <div className="form-group">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/very/long/url"
                        required
                        disabled={!isConnected || isLoading}
                        className="url-input"
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button
                    type="submit"
                    disabled={!isConnected || isLoading}
                    className="btn btn-primary btn-large"
                >
                    {isLoading ? 'Processing Payment...' : 'Shorten URL'}
                </button>
            </form>

            {shortId && (
                <div className="result-box">
                    <h3>Short URL Created!</h3>
                    <div className="short-url-display">
                        <input
                            type="text"
                            value={fullShortUrl}
                            readOnly
                            className="short-url-input"
                        />
                        <button onClick={copyToClipboard} className="btn btn-secondary">
                            Copy
                        </button>
                    </div>
                    <p className="short-id">ID: {shortId}</p>
                </div>
            )}
        </div>
    );
}

