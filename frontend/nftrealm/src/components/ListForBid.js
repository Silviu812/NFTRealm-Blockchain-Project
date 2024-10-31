import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './ListForBid.css';
import NFTWalletABI from '../NFTWallet.json';
import { nftContractAddress } from '../config'; 

const ListForBid = ({ isOpen, onClose, nftId, nftName, nftImageUrl, nftadresa }) => {
    const [date, setDate] = useState('');
    const [minSaleEnabled, setMinSaleEnabled] = useState(false);
    const [minSale, setMinSale] = useState('');
    const [duration, setDuration] = useState('1');
    const [totalCost, setTotalCost] = useState(0.01);

    useEffect(() => {
        setTotalCost(minSaleEnabled ? 0.02 : 0.01);
    }, [minSaleEnabled]);

    const handleDurationChange = (e) => {
        const selectedDuration = e.target.value;
        setDuration(selectedDuration);
        
        const today = new Date();
        const newDate = new Date(today);

        if (selectedDuration === '1') {
            newDate.setMinutes(today.getMinutes() + 1);
        } else if (selectedDuration === '1') {
            newDate.setDate(today.getDate() + 1);
        } else if (selectedDuration === '7') {
            newDate.setDate(today.getDate() + 7);
        } else if (selectedDuration === '30') {
            newDate.setDate(today.getDate() + 30);
        }

        setDate(newDate.toISOString().split('T')[0]);
    };

    const handleListForBid = async () => {
        if (!date) {
            alert("Please fill in all fields.");
            return;
        }

        if (minSaleEnabled && !minSale) {
            alert("Please specify a minimum sale price.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
        
            const nftAddress = nftadresa; 
            const targetAddress = nftContractAddress; 
            const nftTokenId = nftId; 
        
            const nftContract = new ethers.Contract(nftAddress, [
                "function safeTransferFrom(address from, address to, uint256 tokenId) external",
                "function ownerOf(uint256 tokenId) external view returns (address)"
            ], signer);
        
            const senderAddress = await signer.getAddress();
        
            const owner = await nftContract.ownerOf(nftTokenId);
            if (owner !== senderAddress) {
                throw new Error("You do not own this NFT");
            }
        
            const transferTx = await nftContract.safeTransferFrom(
                senderAddress, 
                targetAddress, 
                nftTokenId 
            );
        
            await transferTx.wait();
        
            console.log(`NFT-ul a fost transferat la ${targetAddress}`);
            alert("NFT sent to wallet successfully!");
        
        } catch (error) {
            console.error("Error sending NFT:", error);
            alert("Failed to send NFT. Please check the console for details.");
        }
        
    };        

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose} style={{ position: 'absolute', right: '10px', top: '10px' }}>
                    ×
                </button>
                <h2>List NFT for Bid</h2>
                
                {nftImageUrl && (
                    <div className="nft-display">
                        <h3>{nftName} #{nftId}</h3>
                        <img src={nftImageUrl} alt={nftName} className="nft-image" />
                    </div>
                )}

                <div className="duration-options">
                    <h3>Select Duration:</h3>
                    <label>
                        <input
                            type="radio"
                            value="1"
                            checked={duration === '1'}
                            onChange={handleDurationChange}
                        />
                        1 Minute
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="1"
                            checked={duration === '1'}
                            onChange={handleDurationChange}
                        />
                        1 Day
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="7"
                            checked={duration === '7'}
                            onChange={handleDurationChange}
                        />
                        7 Days
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="30"
                            checked={duration === '30'}
                            onChange={handleDurationChange}
                        />
                        30 Days
                    </label>
                </div>

                <div className="min-sale-option">
                    <label>
                        <input
                            type="checkbox"
                            checked={minSaleEnabled}
                            onChange={(e) => setMinSaleEnabled(e.target.checked)}
                        />
                        Set Minimum Sale Price Protection
                    </label>
                </div>

                {minSaleEnabled && (
                    <input
                        type="text"
                        value={minSale}
                        onChange={(e) => setMinSale(e.target.value)} 
                        placeholder="Minimum Sale Price (ETH)"
                    />
                )}

                <h3>Total Cost: {totalCost} ETH</h3>

                <div className="button-container">
                    <button className="list-button" onClick={handleListForBid}>
                        List for Bid
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListForBid;
