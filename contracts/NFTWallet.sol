// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./ListNFT.sol";

contract NFTWallet is IERC721Receiver {
    struct NftOwner {
        address nftContract;
        uint256[] nftIds;  
        bool available;   
    }

    mapping(address => NftOwner) public listNftOwner;

    ListNFT public listNftContract;

    event NFTReceived(address indexed sender, address indexed nftContract, uint256 tokenId);

    constructor(address _listNftAddress) {
        listNftContract = ListNFT(_listNftAddress); 
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) 
        external override returns (bytes4) {
        
        listNftOwner[from].nftContract = msg.sender; 
        listNftOwner[from].nftIds.push(tokenId);     
        listNftOwner[from].available = true;

        emit NFTReceived(from, msg.sender, tokenId);

        listNftContract.createBid(msg.sender, tokenId);

        return this.onERC721Received.selector;
    }

    function NFTUtilizator(address owner) external view returns (address, uint256[] memory) {
        NftOwner storage nftOwner = listNftOwner[owner];
        return (nftOwner.nftContract, nftOwner.nftIds);
    }
}
