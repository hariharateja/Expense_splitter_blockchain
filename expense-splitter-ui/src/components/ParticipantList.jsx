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

        const addresses = await contract.getAllParticipants();
        const allBalances = await contract.getAllBalances();

        setParticipants(allBalances[0]); // address[]
        setBalances(allBalances[1].map((b) => parseInt(b))); // int[]
      } catch (err) {
        console.error("Error loading balances:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>🔄 Loading participant balances...</p>;

  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow-md max-w-md">
      <h2 className="text-xl font-semibold text-purple-700 mb-3">📋 Balances</h2>
      <ul className="space-y-2">
        {participants.map((addr, index) => (
          <li
            key={addr}
            className={`p-2 rounded border ${
              balances[index] === 0
                ? "border-gray-300"
                : balances[index] < 0
                ? "border-red-400 bg-red-100"
                : "border-green-400 bg-green-100"
            }`}
          >
            <span className="font-mono text-sm">{addr.slice(0, 6)}...{addr.slice(-4)}</span>
            <span className="float-right font-semibold">
              {balances[index]} wei
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}