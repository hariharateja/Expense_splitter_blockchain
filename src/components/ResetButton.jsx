// src/components/ResetButton.jsx
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../contract/ExpenseSplitter";
import { useState } from "react";

export default function ResetButton({ userAddress }) {
  const [status, setStatus] = useState("");

  const handleReset = async () => {
    try {
      setStatus("⏳ Resetting...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.resetAll();
      await tx.wait();

      setStatus("✅ Reset successful!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Reset failed.");
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleReset}
        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
      >
        🔄 Reset All
      </button>
      {status && <p className="mt-2 text-sm text-gray-300">{status}</p>}
    </div>
  );
}