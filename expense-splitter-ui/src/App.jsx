import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import AddParticipant from "./components/AddParticipant";
import AddExpense from "./components/AddExpense";
import ParticipantList from "./components/ParticipantList";
import SettleButton from "./components/SettleButton";
import { motion } from "framer-motion";

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
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AddParticipant userAddress={userAddress} />
              <AddExpense userAddress={userAddress} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <SettleButton userAddress={userAddress} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <ParticipantList />
            </motion.div>
          </>
        )}  
    </div>
  );
}

export default App;