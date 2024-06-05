// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;

	bool public isApproved;
	bool public isDeclined;

	constructor(address _arbiter, address _beneficiary) payable {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	event Approved(uint);
	event Declined(bool);

	function approve() external {
		require(msg.sender == arbiter);
		require(isDeclined == false);
		uint balance = address(this).balance;
		(bool sent, ) = payable(beneficiary).call{value: balance}("");
 		require(sent, "Failed to send Ether");
		emit Approved(balance);
		isApproved = true;
	}

	function decline() external {
		require(msg.sender == arbiter);
		require(isApproved == false);
		emit Declined(true);
		isDeclined = true;
	}
}
