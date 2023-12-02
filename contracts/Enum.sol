// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Enum {
  enum  Status {Paid, Delivered, Received}
  Status public currentStatus;
  //Struct
  struct Payment {
    uint amount;
    uint timestamp;
    address from;
    string message;
  }

  struct Balance {
    uint totalPayment;
    mapping(uint => Payment) payments;
  }

  mapping(address => Balance) public balances;

  function getPayment(address _addr, uint _index) public view returns(Payment memory){
    return balances[_addr].payments[_index];
  }

  function pay(string memory message) public payable {
    uint paymentNumber = balances[msg.sender].totalPayment;

    balances[msg.sender].totalPayment++;

    Payment memory newPayment = Payment(
      msg.value,
      block.timestamp,
      msg.sender,
      message
    );

    balances[msg.sender].payments[paymentNumber] = newPayment;
  }

  //Array
  uint[10] public items;

  //byte
  bytes32 public myVar = "test";
  bytes public myDynVar = "test";

  function compareBytes() public view returns(uint) {
    return myVar.length;
  }

  function qwe() public pure returns(uint[] memory) {
    uint[] memory tempArray = new uint[](10);
    tempArray[0] = 1;
    return tempArray; 
  }

  function pay()  public {
    currentStatus = Status.Paid;
  }

  function delivered() public {
    currentStatus = Status.Delivered;
  }
}