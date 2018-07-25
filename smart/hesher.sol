pragma solidity ^0.4.18;

import 'github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract ImgHesher is Ownable {
	struct screen {
		string url;
		string hash;
	}
	
	screen[] public hashes;
	uint256 public count;
	
	function push(string _hash, string _url) public onlyOwner {
		require(bytes(_hash).length == 32);
		require(bytes(_url).length <= 60);
		
		count++;
		hashes.push(screen({hash: _hash, url: _url}));
	}
}
