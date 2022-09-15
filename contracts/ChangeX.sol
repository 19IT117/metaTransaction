// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Demo {
    uint public x;
    address public sender;
    uint public value = 50;
    function changeX(uint _x) public payable{
        //require(msg.value >= 1000);
        x = _x;
        sender = msg.sender;
        value = msg.value;
    }

    fallback() external {
        x = 12345;
    }
}