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

    modifier bidActiv(uint _bidid) {
        require(bids[_bidid].endtime > block.timestamp, "Bid ended");
        _;
    }

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

    function createBid(address _thenft, uint256 tokenId, uint256 _protection, uint256 _dataaleasa, address from) public {
        bidid++;
        
        uint256 bidDuration;
        if (_dataaleasa == 1) {
            bidDuration = 1 days; 
        } else if (_dataaleasa == 2) {
            bidDuration = 7 days; 
        } else if (_dataaleasa == 3) {
            bidDuration = 30 days; 
        } else if (_dataaleasa == 4) {
            bidDuration = 120 seconds; 
        } else {
            bidDuration = 1 days;
        }
        
        bids[bidid] = Bid({
            thenft: _thenft,
            maxbidder: from,
            origialowner: from,
            amount: 100,
            endtime: block.timestamp + bidDuration,
            starttime: block.timestamp,
            tokenId: tokenId,
            protection: _protection
        });
        emit BidCreated(bidid, _thenft, msg.sender);
    }

    function bidForNft(uint _bidid, uint256 _amount) public bidActiv(_bidid) {
        require(bids[_bidid].amount < _amount, "Bid is too low");
        bids[_bidid].maxbidder = msg.sender;
        bids[_bidid].amount = _amount;
        emit NewBidPlaced(_bidid, msg.sender, _amount);
    }

    function newbidamount(uint _bidid, uint256 _amount) public bidActiv(_bidid) {
        require(bids[_bidid].amount < _amount, "Bid is too low");
        require(bids[_bidid].protection < _amount, "Price is protected, Bid is too low");
        bids[_bidid].amount = _amount;
        bids[_bidid].maxbidder = msg.sender;
    }

    function newbidnoprotection(uint _bidid, uint256 _amount) public bidActiv(_bidid) {
        require(bids[_bidid].amount < _amount, "Bid is too low");
        bids[_bidid].amount = _amount;
        bids[_bidid].maxbidder = msg.sender;
        emit NewBidPlaced(_bidid, msg.sender, _amount);
    }
}
