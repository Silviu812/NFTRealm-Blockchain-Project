import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MainPageABI from '../ListNFT.json'; 
import { CONTRACT_LISTNFT, PROVIDERINFURA } from '../config';

const MainPage = () => {
    const [bids, setBids] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBids = async () => {
        const provider = new ethers.JsonRpcProvider(PROVIDERINFURA);
        const contract = new ethers.Contract(CONTRACT_LISTNFT, MainPageABI.abi, provider);
    
        try {
            const bidCount = await contract.getBidCount();
    
            if (bidCount > 0) {
                const bidsArray = [];
                for (let i = 1; i <= bidCount; i++) {
                    const [thenft, maxbidder, amount, endtime, starttime] = await contract.getBidInfo(i);
                    console.log(`Bid Info for ID ${i}:`, { thenft, maxbidder, amount, endtime, starttime });
    
                    if (amount) { 
                        const amountInEth = ethers.formatEther(amount.toString()); 
                        bidsArray.push({
                            tokenId: i,
                            amount: amountInEth,
                            bidder: maxbidder,
                        });
                    } else {
                        console.warn(`No amount found for bid ID ${i}`);
                    }
                }
                setBids(bidsArray);
            } else {
                console.log("No bids available.");
            }
        } catch (error) {
            console.error("Error fetching bids:", error);
            setError("Error fetching bids. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    

    useEffect(() => {
        fetchBids();
    }, []);

    return (
        <div className="mainpage">
            <h1>Current Bids</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    {bids.length > 0 ? (
                        bids.map((bid, index) => (
                            <div key={index} className="bid">
                                <span>Token ID: {bid.tokenId}</span>
                                <span>Amount: {bid.amount} ETH</span>
                                <span>Address: {bid.bidder}</span>
                            </div>
                        ))
                    ) : (
                        <p>No bids available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MainPage;
