import React, { useState } from 'react';
import './ListNFT.css'; 

const ListNFT = () => {
    const [nfts, setNfts] = useState([]);
    const [error, setError] = useState(null);

    const fetchNFTs = async () => {
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
        const apiKey = "a49ad168cca94135a02e9250211684bd"; //NU CRED CA E NEVOIE
        const apiUrl = `https://testnets-api.opensea.io/api/v2/chain/sepolia/account/${walletAddress}/nfts`;
    
        try {
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
    
            const data = await response.json();
    
            
            console.log(data);
    
            
            const nftsWithImages = (data.nfts && Array.isArray(data.nfts)) ? data.nfts.map(nft => {
                console.log(`NFT ID: ${nft.identifier}, Image URL: ${nft.image_url}`); 
                return {
                    id: nft.identifier, 
                    name: nft.name, 
                    imageUrl: nft.image_url || '', 
                };
            }) : [];
    

            setNfts(nftsWithImages);
    

            if (nftsWithImages.length === 0) {
                alert("No NFTs found for this wallet.");
            }
    
        } catch (error) {
            console.error("Error fetching NFTs:", error);
            alert(`Error: ${error.message}`);
        }
    };
    
    

    return (
        <div className="list-nft-container">
            <h1 className="list-nft-title">List Your NFT!</h1>
            <button className="fetch-button" onClick={fetchNFTs}>
                {'Fetch Available NFTs for Listing'}
            </button>
            {error && <p className="error-message">{error}</p>}
            <p className="instructions">
                Click the button above to see the NFTs you can list. Select the one you want to list and proceed.
            </p>
            <div className="nft-gallery">
                {nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                        <div key={`${nft.id}-${index}`} className="nft-item">
                            <img src={nft.imageUrl} alt={`NFT ${nft.name}`} />
                            <p>NFT ID: {nft.id}</p>
                            <p>Name: {nft.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No NFTs found.</p>
                )}
            </div>
        </div>
    );
};

export default ListNFT;
