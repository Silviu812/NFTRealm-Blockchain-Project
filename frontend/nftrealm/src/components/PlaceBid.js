import React, { useState, useEffect } from 'react';
import './PlaceBid.css';
import { ethers } from 'ethers';
import ListNFT from '../ListNFT.json';
import WalletEscrowABI from '../WalletEscrow.json';
import { CONTRACT_LISTNFT, PROVIDERINFURA, WALLETESCROW_ADDRESS } from '../config'; 

const PlaceBid = ({ isOpen, onClose, onSubmit, currentBid }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(0);

    const [escrowBalance, setEscrowBalance] = useState(0);

    useEffect(() => {
        const fetchEscrowBalance = async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAddress(accounts[0]);
            if (address) {
                const provider = new ethers.JsonRpcProvider(PROVIDERINFURA);
                const contract = new ethers.Contract(WALLETESCROW_ADDRESS, WalletEscrowABI.abi, provider);
                console.log("Contract instance created:", contract.address);
                
                try {
                    const balance = await contract.escrowpower(address);
                    console.log("Escrow Balance:", balance.toString()); 
                    setEscrowBalance(ethers.formatEther(balance)); 
                } catch (error) {
                    console.error("Error fetching escrow balance:", error);
                    setErrorMessage("Error fetching escrow balance.");
                }
            }
        };

        fetchEscrowBalance();
    }, [address]);


    const handleSubmit = async (event) => {
        event.preventDefault(); 
        
        if (!window.ethereum) {
            setErrorMessage("MetaMask not installed!");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_LISTNFT, ListNFT.abi, signer);
        const contractwallet = new ethers.Contract(WALLETESCROW_ADDRESS, WalletEscrowABI.abi, signer);     
    
        const amount = parseFloat(bidAmount); 
        const currentBidAmount = parseFloat(currentBid.amount);
        console.log("CineE:", currentBid);

        console.log("Id:", currentBid.bidder);
    
        if (isNaN(amount) || amount <= currentBidAmount) {
            setErrorMessage(`Please enter a bid amount greater than the current bid of ${currentBid.amount} ETH.`);
            return;
        }
        if (amount > escrowBalance) {
            setErrorMessage("Insufficient power to bid.");
            return;
        }
        try {

            if(ethers.parseEther(bidAmount) > currentBid.protection) {
                const tx = await contract.newbidamount(currentBid.bidId, ethers.parseEther(bidAmount));
                await tx.wait();
                console.log("Bid placed successfully:", tx);
            }
            else {
                try {
                    console.log("Current Bidder:", currentBid.bidder);
                    if(currentBidAmount != 0.0000000000000001) {
                        console.log("Current Bidder:", currentBid.bidder);
                        const tx2 = await contractwallet.givepower(currentBid.bidder, ethers.parseEther(currentBidAmount.toString()));
                        await tx2.wait();
                        console.log("Power given successfully:", tx2);
                    }
                } catch (error) {
                    console.error("Error giving power:", error);
                    setErrorMessage("Error giving power. Please check the console for details.");
                    return;
                }
                try {
                    const tx3 = await contractwallet.takepower(ethers.parseEther(bidAmount.toString()));
                    await tx3.wait();
                    console.log("Power taken successfully:", tx3);
                } catch (error) {
                    console.error("Error taking power:", error);
                    setErrorMessage("Error taking power. Please check the console for details.");
                    return;
                }
                const tx = await contract.newbidnoprotection(currentBid.bidId, ethers.parseEther(bidAmount));
                const test = await tx.wait();
                console.log("Bid placed (no prot) successfully:", test);
                const bidInfo = await contract.getBidInfo(currentBid.bidId);
                console.log("Bid Info:", bidInfo);

            }
            setBidAmount('');
            onClose(); 
        } catch (error) {
            console.error("Error placing bid:", error);
            setErrorMessage("Error placing bid. Please try again.");
        }
    };
    
    

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Enter Your Bid</h2>
                <div>
                <h2>Escrow Balance: {escrowBalance} ETH</h2>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => {
                            setBidAmount(e.target.value);
                            setErrorMessage(''); 
                        }}
                        placeholder="Enter bid amount"
                        required
                    />
                    <button type="submit">Place Bid</button>
                </form>
            </div>
        </div>
    );
};

export default PlaceBid;
