import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import WalletEscrowABI from '../WalletEscrow.json';
import './Profile.css'; 
import { WALLETESCROW_ADDRESS, PROVIDERINFURA } from '../config.js';

const Profile = ({ isOpen, onClose, address }) => {
    const [escrowBalance, setEscrowBalance] = useState(0);
    const [amount, setAmount] = useState(''); 
    const [escrowPower, setEscrowPower] = useState(0);

    useEffect(() => {
        const fetchEscrowBalance = async () => {
            if (address) {
                const provider = new ethers.JsonRpcProvider(PROVIDERINFURA);
                const contract = new ethers.Contract(WALLETESCROW_ADDRESS, WalletEscrowABI.abi, provider);
                
                const balance = await contract.escrowadrese(address);
                setEscrowBalance(ethers.formatEther(balance));
                const power = await contract.escrowpower(address);
                setEscrowPower(ethers.formatEther(power));
            }
        };

        fetchEscrowBalance();
    }, [address]);

    const handleAddBiddingPower = async () => {
        try {
            if (!amount || parseFloat(amount) <= 0) {
                alert("Amount must be > 0.");
                return;
            }
    
            if (!window.ethereum) {
                alert("MetaMask not installed!");
                return;
            }
    
            await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(WALLETESCROW_ADDRESS, WalletEscrowABI.abi, signer);
            
            const valueToSend = ethers.parseEther(amount);
            
            const senderAddress = await signer.getAddress();
            const senderBalance = await provider.getBalance(senderAddress);

            
            
            
            const tx = await contract.pay({ value: valueToSend });
            await tx.wait();
        } catch (error) {
            alert("Transaction failed: " + error.message);
        }
    };
    

    const handleWithdrawFunds = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
    
                const signer = await provider.getSigner();
                const contractWithSigner = new ethers.Contract(WALLETESCROW_ADDRESS, WalletEscrowABI.abi, signer);
    
                const tx = await contractWithSigner.withdrawall();
                await tx.wait();
            } else {
                console.error("MetaMask not detected. Please install it to use this feature.");
            }
        } catch (error) {
            console.error("Error withdrawing funds:", error);
            alert("Transaction failed: " + error.message);
        }
    };
    
    
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Profile</h2>
                {address && <p>Address: {address}</p>}
                <p>Escrow Balance: {escrowBalance} ETH</p>
                <p>Power to Bid: {escrowPower} ETH</p>

                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="Amount to add (ETH)"
                />
                
                <div className="button-container">
                    <button className="add-bidding-button" onClick={handleAddBiddingPower}>
                        Add Bidding Power
                    </button>
                    <button className="withdraw-button" onClick={handleWithdrawFunds}>
                        Withdraw All Funds
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
