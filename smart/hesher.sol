pragma solidity ^0.4.18;

import 'github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract ImgHesher is Ownable {
	struct screen {
		string url;
		string image_hash;
		string pdf_hash;
		string archive_hash;
	}
	
	screen[] public hashes;
	uint256 public count;
	
	function push(string _url, string _image_hash, string _pdf_hash, string _archive_hash) public onlyOwner returns (uint256) {
		uint img_hash_len = bytes(_image_hash).length;
		uint arch_hash_len = bytes(_archive_hash).length;
		uint pdf_hash_len = bytes(_pdf_hash).length;
		
		require(img_hash_len == 32 || img_hash_len == 0);
		require(pdf_hash_len == 32 || pdf_hash_len == 0);
		require(arch_hash_len == 32 || arch_hash_len == 0);
		require(arch_hash_len != 0 || img_hash_len != 0 || pdf_hash_len != 0);
		require(bytes(_url).length <= 60);
		
		count++;
		hashes.push(screen({
			url: _url,
			image_hash: _image_hash,
			archive_hash: _archive_hash,
			pdf_hash_len: _archive_hash
		}));
		
		return count - 1;
	}
}
