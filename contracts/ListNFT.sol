// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract ListNFT {
    
    struct Bid {
        address thenft;
        address origialowner;
        address maxbidder;
        uint256 amount;
        uint256 endtime;
        uint256 starttime;
        uint tokenId;
        uint256 protection;
    }

    uint256 public bidid = 0;
    mapping(uint256 => Bid) public bids;

    event BidCreated(uint256 bidId, address indexed nftAddress, address indexed bidder);
    event NewBidPlaced(uint256 bidId, address indexed bidder, uint256 amount);

    constructor() {
        bidid++;
        bids[bidid] = Bid({
            thenft: 0x2A3FeDEB5c4aCa4b8728D53Eb8344d600dE36644, 
            maxbidder: 0x0000000000000000000000000000000000000001,
            origialowner: 0x0000000000000000000000000000000000000001, 
            amount: 100,
            endtime: block.timestamp + 1 days,
            starttime: block.timestamp,
            tokenId: 0,
            protection: 10000000000000000000
        });
    }

    function createBid(address _thenft, uint256 tokenId, uint256 _protection) public {
        bidid++;
        bids[bidid] = Bid({
            thenft: _thenft,
            maxbidder: msg.sender,
            origialowner: msg.sender,
            amount: 100,
            endtime: block.timestamp + 1 days,
            starttime: block.timestamp,
            tokenId: tokenId,
            protection: _protection
        });
        emit BidCreated(bidid, _thenft, msg.sender);
    }

    function bidForNft(uint _bidid, uint256 _amount) public {
        require(bids[_bidid].endtime > block.timestamp, "Bid has ended");
        require(bids[_bidid].amount < _amount, "Bid is too low");
        bids[_bidid].maxbidder = msg.sender;
        bids[_bidid].amount = _amount;
        emit NewBidPlaced(_bidid, msg.sender, _amount);
    }

    function getBidCount() public view returns (uint256) {
        return bidid;
    }

    function getBidInfo(uint _bidid) public view returns (address, address, address, uint256, uint256, uint256, uint256, uint256) {
        require(_bidid > 0 && _bidid <= bidid, "Bid does not exist");
        return (
            bids[_bidid].thenft, 
            bids[_bidid].maxbidder,
            bids[_bidid].origialowner, 
            bids[_bidid].amount, 
            bids[_bidid].endtime, 
            bids[_bidid].starttime,
            bids[_bidid].tokenId,
            bids[_bidid].protection
        );   
    }

    function getBidWinner(uint _bidid) public view returns (address, uint256) {
        require(bids[_bidid].endtime < block.timestamp, "Bid has not ended");
        return (bids[_bidid].maxbidder, bids[_bidid].amount);
    }

    function newbidamount(uint _bidid, uint256 _amount) public {
        require(bids[_bidid].endtime > block.timestamp, "Bid has ended");
        require(bids[_bidid].amount < _amount, "Bid is too low");
        require(bids[_bidid].protection < _amount, "Price over protection");
        bids[_bidid].amount = _amount;
        bids[_bidid].maxbidder = msg.sender;
    }

    function newbidnoprotection(uint _bidid, uint256 _amount) public {
        require(bids[_bidid].endtime > block.timestamp, "Bid has ended");
        require(bids[_bidid].amount < _amount, "Bid is too low");
        bids[_bidid].amount = _amount;
    }
}
