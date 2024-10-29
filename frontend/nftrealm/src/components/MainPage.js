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

                    
                    const nftImageUrl = await getNftImageUrl(thenft); 

                    if (amount) { 
                        const amountInEth = ethers.formatEther(amount.toString()); 
                        bidsArray.push({
                            tokenId: i,
                            amount: amountInEth,
                            bidder: maxbidder,
                            nftImage: nftImageUrl, 
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

    const getNftImageUrl = async (thenft, tokenId) => {
        const apiKey = "a49ad168cca94135a02e9250211684bd"; //NU CRED CA E NEVOIE
        const apiUrl = `https://testnets-api.opensea.io/api/v2/chain/sepolia/contract/${thenft}/nfts/${tokenId}`;
    
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error fetching NFT: ${response.status} - ${response.statusText}`);
            }
    
            const data = await response.json();
            
            return data.image_url || '';
        } catch (error) {
            console.error("Error fetching NFT image:", error);
            alert(`Error: ${error.message}`);
            return '';
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
                <div className="bids-container">
                    {bids.length > 0 ? (
                        bids.map((bid, index) => (
                            <div key={index} className="bid">
                                <img src={bid.nftImage} alt={`NFT ${bid.tokenId}`} className="nft-image" />
                                <div className="bid-details">
                                    <span>Token ID: {bid.tokenId}</span>
                                    <span>Amount: {bid.amount} ETH</span>
                                    <span>Address: {bid.bidder}</span>
                                </div>
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
