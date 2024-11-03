import React, { useState, useEffect } from 'react';
import './PlaceBid.css';
import { ethers } from 'ethers';
import ListNFT from '../ListNFT.json';
import { CONTRACT_LISTNFT, PROVIDERINFURA } from '../config'; 

const PlaceBid = ({ isOpen, onClose, onSubmit, currentBid }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
    
        const amount = parseFloat(bidAmount); 
        const currentBidAmount = parseFloat(currentBid.amount); 

        console.log("Amount:", currentBid.bidId);
    
        if (isNaN(amount) || amount <= currentBidAmount) {
            setErrorMessage(`Please enter a bid amount greater than the current bid of ${currentBid.amount} ETH.`);
            return;
        }
        try {
            if(ethers.parseEther(bidAmount) > currentBid.protection) {
                const tx = await contract.newbidamount(currentBid.bidId, ethers.parseEther(bidAmount));
                await tx.wait();
                console.log("Bid placed successfully:", tx);
            }
            else {
                const tx = await contract.newbidnoprotection(currentBid.bidId, ethers.parseEther(bidAmount));
                await tx.wait();
                console.log("Bid placed (no prot) successfully:", tx);
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
