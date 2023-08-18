// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract BuyMeACoffee {
    event NewMemo (
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //Address of the contract deployer
    address payable owner;

    //Memo list received from coffee buyes
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value >= 0, "You need to send at least 0 ETH");
        owner.transfer(msg.value);
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

}