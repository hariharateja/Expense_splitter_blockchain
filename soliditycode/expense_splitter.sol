// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExpenseSplitter {
    address public owner;
    address[] public participants;
    mapping(address => int) public balances;
    
    // Events for better tracking
    event ParticipantAdded(address indexed participant);
    event ExpenseAdded(uint amount, address indexed paidBy);
    event DebtSettled(address indexed settler, uint amount);
    event ParticipantRemoved(address indexed participant);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }
    
    function addParticipant(address newParticipant) public onlyOwner {
        require(newParticipant != address(0), "Invalid address.");
        require(!isParticipant(newParticipant), "Already a participant.");
        
        participants.push(newParticipant);
        emit ParticipantAdded(newParticipant);
    }
    
    function addExpense(uint totalAmount, address paidBy) public onlyOwner {
        require(totalAmount > 0, "Amount must be greater than 0.");
        require(isParticipant(paidBy), "Payer must be a participant.");
        require(participants.length > 0, "No participants added yet.");
        
        uint share = totalAmount / participants.length;
        uint remainder = totalAmount % participants.length;
        
        // Each participant owes their share
        for (uint i = 0; i < participants.length; i++) {
            balances[participants[i]] += int(share);
        }
        
        // The payer gets credited for the total amount they paid
        balances[paidBy] -= int(totalAmount);
        
        // Distribute remainder among first few participants
        for (uint i = 0; i < remainder; i++) {
            balances[participants[i]] += 1;
        }
        
        emit ExpenseAdded(totalAmount, paidBy);
    }
    
    // function settle() removed due to duplication
    
    function getBalance(address user) public view returns (int) {
        return balances[user];
    }
    
    function getParticipantsCount() public view returns (uint) {
        return participants.length;
    }
    
    function getParticipant(uint index) public view returns (address) {
        require(index < participants.length, "Index out of bounds");
        return participants[index];
    }
    
    function isParticipant(address user) public view returns (bool) {
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i] == user) {
                return true;
            }
        }
        return false;
    }
    
    // Additional utility functions
    function getAllParticipants() public view returns (address[] memory) {
        return participants;
    }
    
    function getAllBalances() public view returns (address[] memory addresses, int[] memory balanceValues) {
        uint len = participants.length;
        addresses = new address[](len);
        balanceValues = new int[](len);
        
        for (uint i = 0; i < len; i++) {
            addresses[i] = participants[i];
            balanceValues[i] = balances[participants[i]];
        }
    }
    
    function settle() public payable {
            require(balances[msg.sender] > 0, "No debt to settle.");
            require(msg.value == uint(balances[msg.sender]), "Send exact amount.");

            uint amountToSettle = uint(balances[msg.sender]);
            balances[msg.sender] = 0;

            // Transfer to owner
            payable(owner).transfer(msg.value);

            // 🛠 Decrease owner's negative balance
            balances[owner] -= int(amountToSettle);  // New line

            emit DebtSettled(msg.sender, amountToSettle);
        }
    
    // Emergency function to allow owner to withdraw contract balance
    function emergencyWithdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // Function to check total contract balance
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
    function resetAll() public onlyOwner {
    for (uint i = 0; i < participants.length; i++) {
        balances[participants[i]] = 0;
    }
    delete participants;
}
}