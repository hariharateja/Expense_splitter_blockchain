import { useState, useEffect } from "react";

export default function ConnectWallet({ onConnect }) {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(account);
        onConnect(account);
      } catch (err) {
        alert("🛑 Wallet connection failed!");
      }
    } else {
      alert("🦊 Please install MetaMask.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        onConnect(accounts[0]);
      });
    }
  }, []);

  return (
    <div className="mb-4">
      {walletAddress ? (
        <p className="text-green-600 font-mono">
          ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}