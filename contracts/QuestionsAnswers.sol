// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract QuestionsAnswers {
  
  function demoData() external view returns(uint) {
    uint c = block.timestamp; // количество секунд с 1 января 1970 года
    uint a = 2 days;
    return a + c;
  }


  function callData(string calldata message) external {
  }


  enum Demo { One, Two, Three}
  event DemoEvent(Demo dtate);
  function enumDemo() external {
    emit DemoEvent(Demo.Two);
  }


  struct Person {
    string name;
    mapping (address => uint) payments;
  }

  Person[] public person;
  function demoPerson() external {
    Person storage newPerson = person.push();
    newPerson.name = "Jon";
  }

  //Массив в памяти
  function demoMemory() pure external {
    uint[] memory arr = new uint[](3);
    arr[0] = 1;
  }
}