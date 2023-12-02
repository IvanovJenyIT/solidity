// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Function {
  //public
  //external
  //internal
  //private

  //view
  //pure
  string ms = "Hello!";
  uint public balance;
  //transaction
  function setMess(string memory newMess) public {
    ms = newMess;
    //return
  }

  //payable
  function pay() external payable {
    balance += msg.value;
  }

  fallback() external payable{}

  receive() external payable{}

  // call
  function name() public view returns(uint balances) {
    balances = address(this).balance;
    // return balance;
  }

  function getMess() external view returns(string memory) {
    return ms;
  }

  function rate(uint amount) public pure returns(uint) {
    return amount * 3;
  }
}