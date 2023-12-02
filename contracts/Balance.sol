// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Balance {
    mapping (address => uint) public payments;
    address myAdress = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    function getBalance(address _targetAdr) public view returns(uint) {
        return _targetAdr.balance;
    }

    function receiveFunds() public payable {
        payments[msg.sender] = msg.value;
    }

    function transferTo(address _targetAdr, uint amount) public {
        address payable _to = payable(_targetAdr);
        _to.transfer(amount);
    }
}