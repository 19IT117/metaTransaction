// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Demo {
    uint public x;
    address sender ;
    function changeX(uint _x) public payable{
        //require(msg.value >= 1000);
        x = _x;

    }
}