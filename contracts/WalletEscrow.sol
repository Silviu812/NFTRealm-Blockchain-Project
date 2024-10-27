//SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WalletEscrow is ERC721 {

    constructor() ERC721("WalletEscrow", "WLE") {}

    mapping (address => uint) public escrowadrese;

    function pay() public payable {
        escrowadrese[msg.sender] += msg.value;
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