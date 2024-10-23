import React, { useState } from 'react';
import { ethers } from 'ethers';
import WalletEscrowABI from './WalletEscrow.json'; 

const providerUrl = "https://sepolia.infura.io/v3/302e5352e5f243cabc272d43832be4cf"; 
const contractAddress = "0x6EA308C30A4cE4791A8D256b7aF7fE704C5E6105"; 

const WalletEscrow = () => {
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');

    const checkBalance = async () => {
        try {
            if (!window.ethereum) {
                alert("Metamask not installed");
                return;
            }

            const provider = new ethers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, WalletEscrowABI.abi, provider);
            
            console.log("Se verifica adresa:", address); 
    
            const balance = await contract.escrowadrese(address);
            console.log("Balanta:", balance.toString());
            
            setBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error("Eroare:", error);
            alert("Nu s-a putut gasi balanta: " + error.message);
        }
    };

    const pay = async () => {
        try {
            if (!amount || parseFloat(amount) <= 0) {
                alert("Amount > 0.");
                return;
            }
    
            if (!window.ethereum) {
                alert("Metamask not installed!");
                return;
            }
    
            await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, WalletEscrowABI.abi, signer);
            
            const valueToSend = ethers.parseEther(amount);
    
            const senderAddress = await signer.getAddress();
            const senderBalance = await provider.getBalance(senderAddress);
            
            console.log("Sender balance:", ethers.formatEther(senderBalance));
            console.log("Value to send:", ethers.formatEther(valueToSend));
    
            if (senderBalance < valueToSend) {
                alert("Insufficient funds!");
                return;
            }
    
            const tx = await contract.pay({ value: valueToSend });
            await tx.wait();
            console.log(`Sent ${amount} ETH to contract`);
        } catch (error) {
            console.error("Error during payment:", error);
            alert("Transaction failed: " + error.message);
        }
    };
    
    


    return (
        <div>
            <h1>Wallet Escrow</h1>
            <div>
                <input 
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <button onClick={checkBalance}>Check Balance</button>
                <p>Balance: {balance} ETH</p>
            </div>
            <div>
                <input 
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={pay}>Pay</button>
            </div>
        </div>
    );
};

export default WalletEscrow;
