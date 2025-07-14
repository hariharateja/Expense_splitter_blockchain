import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import AddParticipant from "./components/AddParticipant";
import AddExpense from "./components/AddExpense";
import ParticipantList from "./components/ParticipantList";
import SettleButton from "./components/SettleButton";

function App() {
  const [userAddress, setUserAddress] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold mb-4 text-purple-800">💸 Expense Splitter DApp</h1>
      
      <ConnectWallet onConnect={setUserAddress} />

      {userAddress && (
        <div className="mt-6">
          <p className="text-sm text-gray-700">Wallet connected. You're ready to split expenses!</p>
        </div>
      )}
      {userAddress && (
        <div className="mt-6 space-y-4">
          <AddParticipant userAddress={userAddress} />
          <AddExpense userAddress={userAddress} />
          <ParticipantList />
          <SettleButton userAddress={userAddress} />
        </div>
      )}  
    </div>
  );
}

export default App;