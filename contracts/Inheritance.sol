// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

contract Ownable {
  address public owner;

  constructor() {
    owner = msg.sender;
  }
  
  modifier onlyOwner() {
    require(owner == msg.sender, "not a owner!");
    _;
  }

  function withdraw() public virtual onlyOwner {
    payable(owner).transfer(address(this).balance);
  }
}

abstract contract Balances is Ownable {
  function getBalance() public view onlyOwner returns (uint) {
    return address(this).balance;
  }

  function withdraw(address payable _to) public virtual onlyOwner {
    _to.transfer(getBalance());
  }
}

contract Inheritance is Ownable, Balances {
  constructor(address _owner) {
    owner = _owner;
  }

  function withdraw(address payable _to) public override( Balances) onlyOwner {
    // Balances.withdraw(_to);
    // require(_to != address(0), "0 addr");
    super.withdraw(_to);
  }
}
