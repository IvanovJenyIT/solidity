// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

//Merkle tree
contract Merkle {
  //       Hroot
  //   H1-2   H3-4
  // H1  H2  H3  H4
  //TX1 TX2 TX3 TX4
  bytes32[] public hashes;
  string[4] transactions = [
    "TX1 : 1 -> 2",
    "TX2 : 3 -> 4",
    "TX3 : 5 -> 6",
    "TX4 : 7 -> 8"
  ];

  constructor() {
    for(uint i =0; i < transactions.length; i++) {
      hashes.push(makeHash(transactions[i]));
    }

    uint count = transactions.length;
    uint offset = 0;

    while(count > 0) {
      for(uint i=0; i< count-1; i+=2) {
              hashes.push(keccak256(abi.encodePacked(
                hashes[offset+1], hashes[offset +i +1]
              )));

      }
      offset += count;
      count = count / 2;
    }
  }

  function verify(string memory transaction, uint index, bytes32 root, bytes32[] memory proof) public pure returns(bool) {
    bytes32 hash = makeHash(transaction);
    for(uint i=0; i< proof.length; i++){
      bytes32 element = proof[i];
      if(index % 2 ==0) {
        hash = keccak256(abi.encodePacked(hash, element));
      } else {
        hash = keccak256(abi.encodePacked(element, hash));
      }
      index = index / 2;
    }
    return hash == root;
  }

  //We don’t know the byte array and the length in advance
  function encode(string memory input) public pure returns(bytes memory){
    return abi.encodePacked(input);
  }

  function makeHash(string memory input) public pure returns(bytes32) {
    return keccak256(
      encode(input)
    ); //Return Hash in Solidity
  }

}