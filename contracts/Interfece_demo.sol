// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IInterfece.sol";

contract Interfece_demo {
  IInterfece interfaces;

  constructor(address _logger) {
    interfaces = IInterfece(_logger);
  }
  
  function payement(address _from, uint _index) public view returns(uint) {
    return interfaces.getEntry(_from, _index);
  }

  receive() external payable {
    interfaces.log(msg.sender, msg.value);
  }
}
