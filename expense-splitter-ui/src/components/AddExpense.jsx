import { useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../contract/ExpenseSplitter.js";

export default function AddExpense({ userAddress }) {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    const totalAmount = parseInt(amount);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      setStatus("❌ Enter a valid amount.");
      return;
    }

    try {
      setStatus("⏳ Sending transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.addExpense(totalAmount, userAddress);
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
      <h2 className="ext-xl font-semibold mb-4">💸 Add Expense</h2>
      <input
        type="number"
        className="border p-2 w-full mb-2 rounded"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-xl w-full hover:bg-green-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
}