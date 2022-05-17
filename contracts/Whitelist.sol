//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Whitelist {
    //max number of addresses that can be whitelisted
    uint8 public maxWhitelistedAddresses;

    //keep track of number of addressee whitelisted till now
    uint8 public numAddressesWhitelisted;

    mapping(address => bool) public whitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        //msg.sender is the address of the user who called this function
        require(
            !whitelistedAddresses[msg.sender],
            "Sender already in the whitelist"
        );
        require(
            numAddressesWhitelisted < maxWhitelistedAddresses,
            "Max limit reached"
        );
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
