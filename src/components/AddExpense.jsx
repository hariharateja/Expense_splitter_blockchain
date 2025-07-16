import { useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../contract/ExpenseSplitter.js";

export default function AddExpense({ userAddress }) {
  const [amount, setAmount] = useState(""); // ETH input
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setStatus("❌ Enter a valid amount in ETH.");
      return;
    }

    try {
      setStatus("⏳ Sending transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // ✅ Convert ETH to Wei
      const amountInWei = ethers.parseEther(amount); // string → BigInt

      const tx = await contract.addExpense(amountInWei, userAddress);
      await tx.wait();

      setAmount("");
      setStatus("✅ Expense added successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to add expense.");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">💸 Add Expense</h2>
      <input
        type="number"
        step="0.0001"
        className="border border-white/20 p-2 w-full mb-2 rounded bg-white/10 text-white placeholder:text-white/60"
        placeholder="Enter amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-xl w-full hover:bg-green-700 transition"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {status && <p className="mt-2 text-sm text-gray-300">{status}</p>}
    </div>
  );
}