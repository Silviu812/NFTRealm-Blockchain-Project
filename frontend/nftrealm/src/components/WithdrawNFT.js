import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_LISTNFT } from '../config';
import ListNFTABI from '../ListNFT.json';

const WithdrawNFT = () => {
    const [nfts, setNfts] = useState([]);
    const [error, setError] = useState(null);

    const fetchWithdrawableNFTs = async () => {
        console.log("Starting fetchWithdrawableNFTs...");
        if (!window.ethereum) {
            alert("MetaMask not installed!");
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length === 0) {
            alert("Please connect to MetaMask.");
            return;
        }

        const walletAddress = accounts[0];
        console.log("Wallet Address:", walletAddress);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const listnftcontract = new ethers.Contract(CONTRACT_LISTNFT, ListNFTABI.abi, provider);

        try {
            const bidCount = await listnftcontract.getBidCount();
            console.log("Total Bids:", bidCount);

            const withdrawableNFTs = [];

            for (let i = 1; i <= bidCount; i++) {
                console.log(`Fetching bid info for ID: ${i}`);
                const [thenft, maxbidder, originalowner, amount, endtime, starttime, tokenId] = await listnftcontract.getBidInfo(i);

                console.log(`Bid ${i}:`, { thenft, maxbidder, originalowner, amount, endtime, starttime, tokenId });

                const currentTime = Math.floor(Date.now() / 1000);

                
                if (
                    Number(endtime) < currentTime && 
                    ethers.getAddress(maxbidder) === ethers.getAddress(originalowner) && 
                    ethers.getAddress(originalowner) === ethers.getAddress(walletAddress) 
                ) {
                    console.log('Found NFT eligible for withdrawal');

                    const nftData = {
                        bidId: i,
                        tkn: tokenId,
                        nftAddress: thenft,
                        maxbidder,
                        originalOwner: originalowner,
                        endtime: Number(endtime),
                    };

                    withdrawableNFTs.push(nftData);
                }
            }

            console.log("Withdrawable NFTs:", withdrawableNFTs);
            setNfts(withdrawableNFTs);

            if (withdrawableNFTs.length === 0) {
                alert("No NFTs found for withdrawal.");
            }
        } catch (error) {
            console.error("Error fetching withdrawable NFTs:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleWithdraw = async (nft) => {
        if (!window.ethereum) {
            alert("MetaMask not installed!");
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length === 0) {
            alert("Please connect to MetaMask.");
            return;
        }

        const walletAddress = accounts[0];
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const listnftcontract = new ethers.Contract(CONTRACT_LISTNFT, ListNFTABI.abi, signer);

        try {
            const tx = await listnftcontract.changeownerfrombid(nft.bidId);
            await tx.wait();

            alert(`NFT with Token ID ${nft.tkn} withdrawn successfully!`);
            setNfts((prev) => prev.filter((item) => item.bidId !== nft.bidId)); 
        } catch (error) {
            console.error("Error withdrawing NFT:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="list-nft-container">
            <h1 className="list-nft-title">Withdraw Your NFTs</h1>
            <button className="fetch-button" onClick={fetchWithdrawableNFTs}>
                Search Withdrawable NFTs
            </button>
            {error && <p className="error-message">{error}</p>}
            <p className="instructions">
                Click the button above to see NFTs that can be withdrawn. Proceed to withdraw the one you want.
            </p>
            <div className="nft-gallery">
                {nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                        <div key={`${nft.bidId}-${index}`} className="nft-item">
                            <p>Token ID: {nft.tkn}</p>
                            <p>Address: {nft.nftAddress}</p>
                            <button className="withdraw-button" onClick={() => handleWithdraw(nft)}>
                                Withdraw NFT
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No NFTs available for withdrawal.</p>
                )}
            </div>
        </div>
    );
};

export default WithdrawNFT;
