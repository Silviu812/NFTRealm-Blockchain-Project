import React, { useEffect, useState } from 'react';
import './PayNFT.css';
import { ethers } from 'ethers';
import { nftContractAddress } from '../config';
import NFTWalletABI from '../NFTWallet.json';
import { CONTRACT_LISTNFT } from '../config';
import ListNFTABI from '../ListNFT.json';
import { WALLETESCROW_ADDRESS} from '../config';
import WalletEscrowABI from '../WalletEscrow.json';

const PayForNFT = () => {
    const [nfts, setNfts] = useState([]);
    const [error, setError] = useState(null);

    const fetchNFTsForPayment = async () => {
        console.log("Starting fetchNFTsForPayment...");
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

            const bidsArray = [];

            for (let i = 1; i <= bidCount; i++) {
                console.log(`Fetching bid info for ID: ${i}`);
                const [thenft, maxbidder, originalowner, amount, endtime, starttime, tokenId] = await listnftcontract.getBidInfo(i);

                console.log(`Bid ${i}:`, { thenft, maxbidder, originalowner, amount, endtime, starttime, tokenId });

                const nftImageUrl = await getNftImageUrl(thenft, tokenId);
                const nftName = await getNftName(thenft, tokenId);

                if (
                    ethers.getAddress(maxbidder) === ethers.getAddress(walletAddress) &&
                    ethers.getAddress(originalowner) !== ethers.getAddress(walletAddress)
                ) {
                    console.log('Found NFT requiring payment');
                    const amountInEth = ethers.formatEther(amount);

                    bidsArray.push({
                        bidId: i,
                        tkn : tokenId,
                        amount: amountInEth,  
                        bidder: maxbidder,
                        originalOwner: originalowner,
                        nftImage: nftImageUrl,
                        nftName: nftName,
                        endtime: Number(endtime),
                    });
                }
            }

            console.log("Filtered Bids for Payment:", bidsArray);
            setNfts(bidsArray);

            if (bidsArray.length === 0) {
                alert("No NFTs requiring payment found.");
            }
        } catch (error) {
            console.error("Error fetching bids:", error);
            alert(`Error: ${error.message}`);
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

    const handlePayment = async (nft, bidId, tkn) => {
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
        const walletEscrowContract = new ethers.Contract(WALLETESCROW_ADDRESS, WalletEscrowABI.abi, signer);
        const nftContract = new ethers.Contract(nftContractAddress, NFTWalletABI.abi, signer);
        try {

            


            const amountInEther = ethers.parseEther(nft.amount); 
            const tx1 = await walletEscrowContract.payforbid(nft.originalOwner, amountInEther);
            await tx1.wait(); 

            alert("Payment successful! Funds transferred to escrow.");

            
            const tx2 = await listnftcontract.changeownerfrombid(bidId);
            await tx2.wait(); 

            

            setNfts((prev) => prev.filter((item) => item.bidId !== nft.bidId)); 
        } catch (error) {
            console.error("Error making payment:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="pay-nft-container">
            <h1 className="pay-nft-title">Pay for NFTs You Won!</h1>
            <button className="fetch-button" onClick={fetchNFTsForPayment}>
                Search NFTs for Payment
            </button>
            {error && <p className="error-message">{error}</p>}
            <p className="instructions">
                Click the button above to see NFTs that require payment. Proceed to pay for the one you want.
            </p>
            <p>Only NFTs you have won will be listed here for payment.</p>
            <div className="nft-gallery">
                {nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                        <div key={`${nft.bidId}-${index}`} className="nft-item">
                            <img src={nft.nftImage} alt={`NFT ${nft.nftName}`} />
                            <p>NFT ID: {nft.tokenId}</p>
                            <p>Name: {nft.nftName}</p>
                            <p>Price: {nft.amount} ETH</p>
                            <button className="pay-button" onClick={() => handlePayment(nft, nft.bidId, nft.tkn)}>
                                Pay for NFT
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No NFTs requiring payment found.</p>
                )}
            </div>
        </div>
    );
};

export default PayForNFT;
