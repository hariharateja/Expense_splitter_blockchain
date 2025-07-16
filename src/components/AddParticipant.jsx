import { useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../contract/ExpenseSplitter.js";

export default function AddParticipant({ userAddress }) {
  const [newAddress, setNewAddress] = useState("");
  const [status, setStatus] = useState("");

  const handleAdd = async () => {
    if (!ethers.isAddress(newAddress)) {
      setStatus("❌ Invalid Ethereum address.");
      return;
    }

    try {
      setStatus("⏳ Sending transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.addParticipant(newAddress);
      await tx.wait();

      setStatus(`✅ Participant ${newAddress.slice(0, 6)}... added!`);
      setNewAddress("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error adding participant.");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
      <h2 className="ext-xl font-semibold mb-4"> Add Participant</h2>
      <input
        className="border p-2 w-full mb-2 rounded"
        type="text"
        placeholder="0xABC... address"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded-xl w-full hover:bg-purple-700"
        onClick={handleAdd}
      >
        Add
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
}