// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

contract HolandAukcion {
  address public owner;
  uint constant DURATION = 2 days;
  uint constant FEE = 10; // 10%

  struct Auction {
    address payable seller;
    uint startingPrice;
    uint finalPrice;
    uint startAt;
    uint endsAt;
    uint discountRate;
    string item;
    bool stopped;
  }

  Auction[] public auctions;

  event AuctionCreated(uint index, string itemName, uint starttingPrice, uint duration);
  
  event AuctionEnded(uint index, uint finalPrice, address winner);

  constructor() {
    owner = msg.sender;
  }

  function createAuction(uint _starttingPrice, uint _discountRate, string calldata _item, uint _duration) external {
    uint duration = _duration == 0 ? DURATION : _duration;

    require(_starttingPrice >= _discountRate * duration, 'INCORRECT STARTING PRICE');

    Auction memory newAuction = Auction({
      seller: payable(msg.sender),
      startingPrice: _starttingPrice,
      finalPrice: _starttingPrice,
      discountRate: _discountRate,
      startAt: block.timestamp, // now
      endsAt: block.timestamp * duration,
      item: _item,
      stopped: false
    });

    auctions.push(newAuction);

    emit AuctionCreated(auctions.length - 1, _item, _starttingPrice, duration);
  }

  function getPriceFor(uint index) public view returns(uint) {
    Auction memory cAuction = auctions[index];
    require(!cAuction.stopped, "stopped!");
    uint elapsed = block.timestamp - cAuction.startAt;
    uint discount = cAuction.discountRate * elapsed;
    return cAuction.startingPrice - discount;
  }

  // function stop(uint index) public{
  //   Auction storage cAuction = auctions[index];
  //   cAuction.stopped = true;
  // }

  function buy(uint index) external payable {
    Auction storage cAuction = auctions[index];
    require(!cAuction.stopped, "stopped!");
    require(block.timestamp < cAuction.endsAt, "ended");
    uint cPrice = getPriceFor(index);
    require(msg.value >= cPrice, "not enough funds!");
    cAuction.stopped = true;
    cAuction.finalPrice = cPrice;
    uint refund = msg.value - cPrice;
    if(refund >0) {
      payable(msg.sender).transfer(refund);
    }
    cAuction.seller.transfer(
      cPrice - ((cPrice * FEE) / 100)
    );

    emit AuctionEnded(index, cPrice, msg.sender);
  }
}
