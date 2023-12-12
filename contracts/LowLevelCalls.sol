// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

//Merkle tree
contract MyContract {
  address otherContract;
  event Response(string resp);

  constructor(address _otherContact) {
    otherContract = _otherContact;
  }

  function callReceive() external payable {
    (bool success,) = otherContract.call{value: msg.value}("");
    require(success, "cant send funds!");
  }

  function callSetName(string calldata _name) external {
    (bool success, bytes memory response) = otherContract.call(
      //abi.encodeWithSignature("setName(string)", _name)
      abi.encodeWithSelector(AnotherContract.setName.selector, _name)
    );

    require(success, "cant set nsme!");


    emit Response(abi.decode(response, (string)));
  }
}

contract AnotherContract {
  string public name;
  mapping (address => uint) public balances;

  function setName(string calldata _name) external returns(string memory) {
    name = _name;
    return name;
  }

  receive() external payable {
    balances[msg.sender] += msg.value;
  }
}