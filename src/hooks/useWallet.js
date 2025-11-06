import { useState, useEffect } from "react";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [walletClient, setWalletClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== "undefined";
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];

      const client = createWalletClient({
        account: {
          address: address,
        },
        chain: baseSepolia,
        transport: custom(window.ethereum),
      });

      setAccount({
        address,
      });
      setWalletClient(client);

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      setTimeout(() => window.location.reload(), 0);

      return true;
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const handleChainChanged = () => {
    // Reload the page to reset state
    window.location.reload();
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWalletClient(null);
    setError(null);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled() && window.ethereum.selectedAddress) {
        try {
          const address = window.ethereum.selectedAddress;

          // Create viem wallet client
          const client = createWalletClient({
            account: {
              address: address,
            },
            chain: baseSepolia,
            transport: custom(window.ethereum),
          });

          setAccount({ address });
          setWalletClient(client);
        } catch (err) {
          console.error("Error checking wallet connection:", err);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    account,
    walletClient,
    isConnected: !!account,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  };
}
