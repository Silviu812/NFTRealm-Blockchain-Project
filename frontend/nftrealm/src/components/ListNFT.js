import React from 'react';
import './ListNFT.css'; 

const ListNFT = () => {
    return (
        <div className="list-nft-container">
            <h1 className="list-nft-title">List Your NFT!</h1>
            <button className="fetch-button">Fetch Available NFTs for Listing</button>
            <p className="instructions">
                Click the button above to see the NFTs you can list. Select the one you want to list and proceed.
            </p>
        </div>
    );
};

export default ListNFT;