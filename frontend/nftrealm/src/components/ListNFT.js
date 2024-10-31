import React, { useState } from 'react';
import './ListNFT.css'; 
import ListForBid from './ListForBid'; 

const ListNFT = () => {
    const [nfts, setNfts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedNft, setSelectedNft] = useState(null);
    const [selectedNftName, setSelectedNftName] = useState('');
    const [selectedNftImageUrl, setSelectedNftImageUrl] = useState('');
    const [selectedNftTKID, setSelectedNftTKID] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNftAdresa, setSelectedNftAdresa] = useState('');

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
        const apiKey = "a49ad168cca94135a02e9250211684bd"; 
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
            const nftsWithImages = (data.nfts && Array.isArray(data.nfts)) ? data.nfts.map(nft => {
                return {
                    id: nft.identifier, 
                    name: nft.name, 
                    imageUrl: nft.image_url || '', 
                    tokenId: nft.token_id || '',
                    adresa: nft.contract
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

    const handleOpenListForBid = (nft) => {
        setSelectedNft(nft.id);
        setSelectedNftName(nft.name);
        setSelectedNftImageUrl(nft.imageUrl);
        setSelectedNftTKID(nft.tokenId);
        setIsModalOpen(true);
        setSelectedNftAdresa(nft.adresa);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNft(null);
        setSelectedNftName('');
        setSelectedNftImageUrl('');
        setSelectedNftTKID('');
        setSelectedNftAdresa('');
    };

    return (
        <div className="list-nft-container">
            <h1 className="list-nft-title">List Your NFT!</h1>
            <button className="fetch-button" onClick={fetchNFTs}>
                Fetch Available NFTs for Listing
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
                            <button 
                                className="list-button" 
                                onClick={() => handleOpenListForBid(nft)}
                            >
                                List NFT for Bid
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No NFTs found.</p>
                )}
            </div>

            {isModalOpen && (
                <ListForBid 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    nftId={selectedNft} 
                    nftName={selectedNftName}
                    nftImageUrl={selectedNftImageUrl}
                    nftTokenId={selectedNftTKID}
                    nftadresa={selectedNftAdresa}
                />
            )}
        </div>
    );
};

export default ListNFT;
