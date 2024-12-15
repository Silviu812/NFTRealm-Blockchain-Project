// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
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
        address[] contractAddresses;
    }

    mapping(address => NftOwner) internal listNftOwner;

    ListNFT public listNftContract;

    event NFTReceived(address indexed sender, address indexed nftContract, uint256 tokenId);

    constructor(address _listNftAddress) {
        listNftContract = ListNFT(_listNftAddress); 
    }

    uint256 public dataaleasa = 1;

    function data() external view returns (uint256) {
        return dataaleasa;
    }

    function setDataa() public {
        dataaleasa = 1;
    }

    function setDatab() public {
        dataaleasa = 2;
    }

    function setDatac() public {
        dataaleasa = 3;
    }

    function setDatad() public {
        dataaleasa = 4;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) 
        external override returns (bytes4) {
        
        NftOwner storage nftOwner = listNftOwner[from];
        
        if (nftOwner.nftContracts[msg.sender].nftIds.length == 0) {
            nftOwner.contractAddresses.push(msg.sender);
        }

        nftOwner.nftContracts[msg.sender].nftIds.push(tokenId);
        nftOwner.nftContracts[msg.sender].available = false;

        emit NFTReceived(msg.sender, from, tokenId);

        listNftContract.createBid(msg.sender, tokenId, 0, dataaleasa, from);
        return this.onERC721Received.selector;
    }

    function changeOwner(address owner, address newOwner, address contractAddress, uint256 tokenId) external {
        require(listNftOwner[owner].contractAddresses.length > 0, "No NFTs to transfer");

        NftOwner storage oldOwner = listNftOwner[owner];
        NftOwner storage newOwnerStruct = listNftOwner[newOwner];

        


        newOwnerStruct.nftContracts[contractAddress].nftIds.push(tokenId);
        
        uint256[] storage oldNftIds = oldOwner.nftContracts[contractAddress].nftIds;
        for (uint256 i = 0; i < oldNftIds.length; i++) {
            if (oldNftIds[i] == tokenId) {
                oldNftIds[i] = oldNftIds[oldNftIds.length - 1];
                oldNftIds.pop();
                break;
            }
        }

        if (oldOwner.nftContracts[contractAddress].nftIds.length == 0) {
            for (uint i = 0; i < oldOwner.contractAddresses.length; i++) {
                if (oldOwner.contractAddresses[i] == contractAddress) {
                    oldOwner.contractAddresses[i] = oldOwner.contractAddresses[oldOwner.contractAddresses.length - 1];
                    oldOwner.contractAddresses.pop();
                    break;
                }
            }
        }
    }


    function withdrawNFT(address owner, address nftContract, uint256 id) external {
        require(listNftOwner[owner].nftContracts[nftContract].available, "NFT is not available");

        uint256[] storage ids = listNftOwner[owner].nftContracts[nftContract].nftIds;
        bool idFound = false;

        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] == id) {
                idFound = true;
                IERC721(nftContract).safeTransferFrom(address(this), owner, id);
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

        uint256 contractCount = nftOwner.contractAddresses.length;

        address[] memory tempContracts = new address[](contractCount);
        uint256[][] memory tempIds = new uint256[][](contractCount);
        uint256 resultCount = 0; 

        for (uint256 i = 0; i < contractCount; i++) {
            address contractAddress = nftOwner.contractAddresses[i];
            if (nftOwner.nftContracts[contractAddress].available) {
                tempContracts[resultCount] = contractAddress;
                tempIds[resultCount] = nftOwner.nftContracts[contractAddress].nftIds;
                resultCount++;
            }
        }

        contracts = new address[](resultCount);
        ids = new uint256[][](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            contracts[i] = tempContracts[i];
            ids[i] = tempIds[i];
        }
    }

    function BidFinished(address nftContract, uint256 tokenId) external { //necesita modificari
        listNftOwner[msg.sender].nftContracts[nftContract].available = true;
    }
}
