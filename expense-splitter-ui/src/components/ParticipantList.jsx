import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../contract/ExpenseSplitter.js";

export default function ParticipantList() {
  const [participants, setParticipants] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const allBalances = await contract.getAllBalances();
        setParticipants(allBalances[0]); // addresses
        setBalances(allBalances[1].map((b) => parseInt(b))); // balances in wei
      } catch (err) {
        console.error("Error loading balances:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-white">🔄 Loading participant balances...</p>;

  return (
    <div className="mt-10 max-w-xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-semibold text-white mb-4 tracking-wide">📋 Participant Balances</h2>

      <ul className="space-y-3 text-sm">
        {participants.map((addr, index) => {
          const balance = balances[index];
          const isPositive = balance > 0;
          const isNegative = balance < 0;

          return (
            <li
              key={addr}
              className={`flex justify-between items-center p-3 rounded-lg shadow-md transition-all duration-300 ${
                isPositive
                  ? "bg-green-600/20 border border-green-300 text-green-200"
                  : isNegative
                  ? "bg-red-600/20 border border-red-300 text-red-200"
                  : "bg-gray-600/10 border border-gray-400 text-gray-200"
              }`}
            >
              <span className="font-mono">{addr.slice(0, 6)}...{addr.slice(-4)}</span>
              <span className="font-semibold">
                {ethers.formatEther(balance)} ETH
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}