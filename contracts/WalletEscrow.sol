//SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract WalletEscrow is ERC721Enumerable {

    event numerge(address sender, uint tokenCount);

    constructor() ERC721("WalletEscrow", "WAL") {}

    mapping (address => uint) public escrowadrese;

    function pay() public payable {
        escrowadrese[msg.sender] += msg.value;
    }
    
    function getOwnedNFTs() public returns(uint[] memory) {
        uint tokenCount = balanceOf(msg.sender);

        emit numerge(msg.sender, tokenCount);
        
        require(tokenCount > 0, "Nu ai NFT-uri");

        uint[] memory ownedNFTs = new uint[](tokenCount);
        for (uint i = 0; i < tokenCount; i++) {
            ownedNFTs[i] = tokenOfOwnerByIndex(msg.sender, i);
        }
        return ownedNFTs;
}


    function putere() public view returns(uint) {
        return escrowadrese[msg.sender] * 10;
    }
    
    function transferNFT(address to, uint tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        _transfer(msg.sender, to, tokenId);
    }

    function withdrawall() public {
        uint amount = escrowadrese[msg.sender];
        require(amount > 0, "No funds to withdraw");
        escrowadrese[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}