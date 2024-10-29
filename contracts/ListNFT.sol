// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract ListNFT {
    
    struct Bid {
        address thenft;
        address maxbidder;
        uint256 amount;
        uint256 endtime;
        uint256 starttime;
    }

    uint256 public bidid = 0;
    mapping(uint256 => Bid) public bids;

    event BidCreated(uint256 bidId, address indexed nftAddress, address indexed bidder);
    event NewBidPlaced(uint256 bidId, address indexed bidder, uint256 amount);

    constructor() {
        bidid++;
        bids[bidid] = Bid({
            thenft: 0x0000000000000000000000000000000000000001, 
            maxbidder: 0x0000000000000000000000000000000000000001, 
            amount: 100,
            endtime: block.timestamp + 1 days,
            starttime: block.timestamp
        });
    }

    function createBid(address _thenft) public {
        bidid++;
        bids[bidid] = Bid({
            thenft: _thenft,
            maxbidder: msg.sender,
            amount: 0,
            endtime: block.timestamp + 1 days,
            starttime: block.timestamp
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

    function getBidInfo(uint _bidid) public view returns (address, address, uint256, uint256, uint256) {
        require(_bidid > 0 && _bidid <= bidid, "Bid does not exist");
        return (
            bids[_bidid].thenft, 
            bids[_bidid].maxbidder, 
            bids[_bidid].amount, 
            bids[_bidid].endtime, 
            bids[_bidid].starttime
        );
    }
}
