import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import AddParticipant from "./components/AddParticipant";
import AddExpense from "./components/AddExpense";
import ParticipantList from "./components/ParticipantList";
import SettleButton from "./components/SettleButton";
import ResetButton from "./components/ResetButton";
import { motion } from "framer-motion";


function App() {
  const [userAddress, setUserAddress] = useState(null);

  return (
    <div className="font-poppins min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-light tracking-tight text-white text-center"
        >
          💸 Expense Splitter DApp
        </motion.h1>

        {/* Subheading */}
        <p className="text-gray-300 text-center max-w-2xl mx-auto text-lg font-light">
          Manage shared expenses seamlessly on the blockchain. Connect your wallet, add participants, log expenses, and settle balances.
        </p>

        {/* Wallet Connect */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="max-w-md w-full bg-gradient-to-br from-orange-400 to-yellow-500 text-white rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-light mb-4">🔐 Connect Your Wallet</h2>
            <ConnectWallet onConnect={setUserAddress} />
          </div>
        </motion.div>

        {/* After Wallet is Connected */}
        {userAddress && (
          <>
            {/* Add Participants & Expenses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <AddParticipant userAddress={userAddress} />
              <AddExpense userAddress={userAddress} />
            </motion.div>

            {/* Settle Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <SettleButton userAddress={userAddress} />
            </motion.div>

            {/* Balances List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <ParticipantList />
              <ResetButton userAddress={userAddress} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;