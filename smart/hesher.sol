pragma solidity ^0.4.18;

import 'github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract ImgHesher is Ownable {
	struct screenshot {
		string url;
		string hash;
	}
	
	screenshot[] public hashes;
	
	function push(string _hash, string _url) public onlyOwner {
		hashes.push(screenshot({hash: _hash, url: _url}));
	}
}
