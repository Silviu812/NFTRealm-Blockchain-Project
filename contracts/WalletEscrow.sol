//SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

contract WalletEscrow {

    mapping (address => uint) public escrowadrese;

    function pay() public payable {
        escrowadrese[msg.sender] += msg.value;
    }

    function putere() public view returns(uint) {
        return escrowadrese[msg.sender] * 10;
    }
}