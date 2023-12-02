// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

contract Instruction {
  // require
  // revert
  // assert
  address owner;

  event Paid(address indexed _from, uint _amount, uint _timestamp);

  constructor() {
    owner = msg.sender;
  }
  
  modifier onlyOwner(address _to) {
    require(msg.sender == owner, "you are not an owner");
    require(_to == address(0), "incorrect addres!");
    _;
  }
  
  function pay() public payable{
    emit Paid(msg.sender, msg.value, block.timestamp);
  }

  receive() external payable {
    pay();
  }

  function withdraw(address payable _to) external onlyOwner(_to) {
    _to.transfer(address(this).balance);
  }
}