import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../contract/ExpenseSplitter.js";

export default function SettleButton({ userAddress }) {
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchBalance() {
      if (!userAddress) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const bal = await contract.getBalance(userAddress);
      setBalance(Number(bal));
    }

    fetchBalance();
  }, [userAddress]);

  const handleSettle = async () => {
    try {
      setStatus("⏳ Sending transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.settle({ value: balance.toString() });
      await tx.wait();
      setStatus("✅ Payment settled successfully!");
      setBalance(0);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + err.reason || err.message);
    }
  };

  if (balance <= 0) return null; // hide button if nothing to settle

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow max-w-md">
      <p className="text-gray-800 mb-2">
        🧾 You owe: <span className="font-bold text-red-600">{balance} wei</span>
      </p>
      <button
        onClick={handleSettle}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        💸 Settle Now
      </button>
      {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
    </div>
  );
}