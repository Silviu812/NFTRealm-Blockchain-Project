import React, { useState } from 'react';
import './WithdrawNFT.css'; 
import { ethers } from 'ethers';
import { nftContractAddress } from '../config';
import NFTWalletABI from '../NFTWallet.json';

//trb recompilat abi
const WithdrawNFT = () => {
    const [nfts, setNfts] = useState([]);
    const [error, setError] = useState(null);

    const withdrawfetchNFTs = async () => {
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
        const walletnft = nftContractAddress;
        const apiKey = "a49ad168cca94135a02e9250211684bd"; 

        const provider = new ethers.BrowserProvider(window.ethereum);
        const walletnftcontract = new ethers.Contract(walletnft, NFTWalletABI.abi, provider);

        try {
            const [contracts, ids] = await walletnftcontract.getNFTs(walletAddress);
            const nftsWithImages = [];
            
            for (let i = 0; i < contracts.length; i++) {
                const contractAddress = contracts[i];
                const tokenIds = ids[i];
                
                for (let tokenId of tokenIds) {
                    const apiUrl = `https://testnets-api.opensea.io/api/v2/chain/sepolia/account/${walletnft}/nfts`;
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'X-API-KEY': apiKey,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`Error fetching NFTs: ${response.status} - ${response.statusText}`);
                    }
                    const nftData = await response.json();

                    nftsWithImages.push({
                        id: tokenId,
                        name: nftData.name,
                        imageUrl: nftData.image_url || '',
                        tokenId: tokenId,
                        adresa: contractAddress
                    });

        
                }
                setNfts(nftsWithImages);
                if (nftsWithImages.length === 0) {
                    alert("No NFTs found for this wallet.");
                }
            }
            console.log("da");
        }
        catch (error) {
            console.error("Error fetching NFTs:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleWithdraw = async (nft) => {};


    return (
        <div className="list-nft-container">
            <h1 className="list-nft-title">Withdraw Your NFT!</h1>
            <button className="fetch-button" onClick={withdrawfetchNFTs}>
                Search Withdrawable NFTs
            </button>
            {error && <p className="error-message">{error}</p>}
            <p className="instructions">
                Click the button above to see the NFTs you can withdraw. Select the one you want to withdraw and proceed.
            </p>
            <p> Here it should be all the NFTs that you have won, or the auction cancelled.</p>
            <div className="nft-gallery">
                {nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                        <div key={`${nft.id}-${index}`} className="nft-item">
                            <img src={nft.imageUrl} alt={`NFT ${nft.name}`} />
                            <p>NFT ID: {nft.id}</p>
                            <p>Name: {nft.name}</p>
                            <button className="withdraw-button" onClick={() => handleWithdraw(nft)}>
                                Withdraw NFT
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No NFTs found.</p>
                )}
            </div>
        </div>
    );
};

export default WithdrawNFT;
