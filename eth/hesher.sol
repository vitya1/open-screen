pragma solidity ^0.4.18;

contract ImgHesher {
	address internal owner;
	uint8 public version;

	string[] public hashes;

	constructor() public {
		owner = msg.sender;
		version = 1;
	}
	
	function push(string _hash) public {
		require(msg.sender == owner);
		hashes.push(_hash);
	}
}

//17.733684661