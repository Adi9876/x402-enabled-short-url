import axios from "axios";
import { withPaymentInterceptor } from "x402-axios";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";

export function createX402Client(account) {
  if (!account || !account.address) {
    throw new Error("Account with address is required for x402 client");
  }

  if (!window.ethereum) {
    throw new Error("MetaMask is not available");
  }

  // Create base axios instance
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
  console.log("API BASE URL ::>>", API_BASE_URL);
  const baseAxios = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  const walletClient = createWalletClient({
    account: {
      address: account.address,
    },
    chain: baseSepolia,
    transport: custom(window.ethereum),
  });

  const x402Client = withPaymentInterceptor(baseAxios, walletClient);

  return x402Client;
}
