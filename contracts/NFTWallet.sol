// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./ListNFT.sol";


//necesita modificari daca nu merg testarile
contract NFTWallet is IERC721Receiver {
    struct NftDetails {
        uint256[] nftIds;
        bool available;
    }

    struct NftOwner {
        mapping(address => NftDetails) nftContracts; 
    }

    mapping(address => NftOwner) public listNftOwner;

    ListNFT public listNftContract;

    event NFTReceived(address indexed sender, address indexed nftContract, uint256 tokenId);

    constructor(address _listNftAddress) {
        listNftContract = ListNFT(_listNftAddress); 
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) 
        external override returns (bytes4) {
        
        NftOwner storage nftOwner = listNftOwner[from];
        
        if (nftOwner.nftContracts[msg.sender].nftIds.length == 0) {
            nftOwner.contractAddresses.push(msg.sender);
        }

        nftOwner.nftContracts[msg.sender].nftIds.push(tokenId);
        nftOwner.nftContracts[msg.sender].available = false;

        emit NFTReceived(from, msg.sender, tokenId);

        listNftContract.createBid(msg.sender, tokenId);

        return this.onERC721Received.selector;
    }

    
    function NFTUtilizator(address owner) external view returns (address[] memory, uint256[][] memory) {
        NftOwner storage nftOwner = listNftOwner[owner];
        
        uint256 contractCount = 0;
        for (uint256 i = 0; i < 256; i++) {
            if (nftOwner.nftContracts[address(i)].nftIds.length > 0) {
                contractCount++;
            }
        }

        address[] memory contracts = new address[](contractCount); //adrese contracte nft
        uint256[][] memory ids = new uint256[][](contractCount); //matrice pentru ca id contract nft sa aiba id-urile nft-urilor

        uint256 index = 0;
        for (uint256 i = 0; i < 256; i++) {
            if (nftOwner.nftContracts[address(i)].nftIds.length > 0) {
                contracts[index] = address(i);
                ids[index] = nftOwner.nftContracts[address(i)].nftIds;
                index++;
            }
        }
        
        return (contracts, ids);
    }

    function BidFinished(address owner) external {
        for (uint256 i = 0; i < 256; i++) {
            if (listNftOwner[owner].nftContracts[address(i)].nftIds.length > 0) {
                listNftOwner[owner].nftContracts[address(i)].available = true;
            }
        }
    }

    function changeowner(address owner, address newOwner) external {
        listNftOwner[newOwner] = listNftOwner[owner];
        delete listNftOwner[owner];
    }

    function withdrawNFT(address owner, address nftContract, uint256 id) external {
        require(listNftOwner[owner].nftContracts[nftContract].available, "NFT is not available");

        uint256[] storage ids = listNftOwner[owner].nftContracts[nftContract].nftIds;
        bool idFound = false;

        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] == id) {
                idFound = true;
                IERC721(nftContract).safeTransferFrom(owner, msg.sender, id); //s-ar putea sa dea eroare
                ids[i] = ids[ids.length - 1];
                ids.pop();
                break;
            }
        }

        require(idFound, "NFT ID not found");

        if (ids.length == 0) {
            delete listNftOwner[owner].nftContracts[nftContract];
        }
    }


    function getNFTs(address owner) external view returns (address[] memory contracts, uint256[][] memory ids) {
        NftOwner storage nftOwner = listNftOwner[owner];

        contracts = nftOwner.contractAddresses; 
        ids = new uint256[][](contracts.length); 

        for (uint256 i = 0; i < contracts.length; i++) {
            ids[i] = nftOwner.nftContracts[contracts[i]].nftIds;
        }
    }
}
