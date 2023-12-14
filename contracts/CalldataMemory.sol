// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

contract CalldataMemory {
  function work() external pure returns(bytes32 data) {
    assembly {
      let ptr := mload(64)
      data := mload(sub(ptr, 32))
    }
  }

  function sel() external pure returns (bytes4) {
    return bytes4(keccak256(bytes("callData(uint256[3])")));
  }

  function callData() external pure returns(bytes32 _el1) {
    assembly{
      _el1 := calldataload(4)
    }
  }
} 