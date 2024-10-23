// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TrimiteNFT is IERC721Receiver {
    mapping(address => uint256[]) public listnftowner; 

    event NFTReceived(address sender, uint256 tokenId);

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
        listnftowner[from].push(tokenId);

        emit NFTReceived(from, tokenId);

        return this.onERC721Received.selector;
    }
    function NFTUtilizator(address sender) external view returns (uint256[] memory) {
        return listnftowner[sender];
    }
}
