import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MainPageABI from '../ListNFT.json'; 
import { CONTRACT_LISTNFT, PROVIDERINFURA } from '../config';
import './MainPage.css';


//BUG LA CONVERTIREA BIGNUMBER IN DATE

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
                    const [thenft, maxbidder, amount, endtime, starttime, tokenId] = await contract.getBidInfo(i);
                    console.log(`Bid Info for ID ${i}:`, { thenft, maxbidder, amount, endtime, starttime });

                    const nftImageUrl = await getNftImageUrl(thenft, tokenId); 
                    const nftName = await getNftName(thenft, tokenId);

                    if (amount) { 
                        const amountInEth = ethers.formatEther(amount.toString());
                        bidsArray.push({
                            tokenId: i,
                            amount: amountInEth,
                            bidder: maxbidder,
                            nftImage: nftImageUrl, 
                            nftName: nftName,
                            endtime: Number(endtime), 
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
        const apiKey = "a49ad168cca94135a02e9250211684bd";
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
            return data.nft.image_url || '';
        } catch (error) {
            console.error("Error fetching NFT image:", error);
            alert(`Error: ${error.message}`);
            return '';
        }
    };

    const getNftName = async (thenft, tokenId) => {
        const apiKey = "a49ad168cca94135a02e9250211684bd";
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
            return data.nft.name || '';
        } catch (error) {
            console.error("Error fetching NFT name:", error);
            alert(`Error: ${error.message}`);
            return '';
        }
    };

    const calculateTimeLeft = (endtime) => {
        const now = Date.now();
        const timeLeft = endtime * 1000 - now; 

        if (timeLeft <= 0) {
            return { message: 'Bid finished', isFinished: true };
        }

        const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        return { message: `${minutes}m ${seconds}s`, isFinished: false };
    };

    useEffect(() => {
        fetchBids();
    }, []);

    return (
        <div className="mainpage">
            <h1>Current Bids</h1>
            {loading ? (
                <p className="loading">Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="bids-container">
                    {bids.length > 0 ? (
                        bids.map((bid, index) => {
                            const { message, isFinished } = calculateTimeLeft(bid.endtime);
                            return (
                                <div key={index} className="bid">
                                    <img src={bid.nftImage} alt={`NFT ${bid.tokenId}`} className="nft-image" />
                                    <div className="bid-details">
                                        <span className="bid-name">{bid.nftName}</span>
                                        <span>Token ID: {bid.tokenId}</span>
                                        <span>Current Bid Amount: <strong>{bid.amount} ETH</strong></span>
                                        <span><br /></span>
                                        <button 
                                            className="bid-button" 
                                            disabled={isFinished} 
                                            style={{ backgroundColor: isFinished ? '#ccc' : '#007bff' }}
                                        >
                                            {isFinished ? 'Bid finished' : 'Place Bid!'}
                                        </button>
                                        <span style={{ color: isFinished ? 'red' : 'black' }}>
                                            Time left: {message}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-bids">No bids available.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default MainPage;
