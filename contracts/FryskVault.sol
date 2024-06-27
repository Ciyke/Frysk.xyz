// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './VFRYSK.sol';
import './Frysk.sol';

contract FryskVault {
    string public name = 'Frysk Vault';
    address public owner; 
    Frysk public frysk;
    VFRYSK public vfrysk;

address[] public stakers;

mapping(address => uint) public stakingBalance;
mapping(address => bool) public hasStaked;
mapping(address => bool) public isStaking;

constructor (VFRYSK _vfrysk, Frysk _frysk) public {
    vfrysk = _vfrysk;
    frysk = _frysk;
    owner = msg.sender;
}

//staking function 
function depositTokens(uint256 _amount)public {

    //require staking amount to be greater than zero
    require(_amount > 0, 'amount cannot be 0');

    //Transfer frysk tokens to this contract address for staking
    frysk.transferFrom(msg.sender, address(this), _amount);

    //update Staking balance
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    if(!hasStaked[msg.sender]) {
     stakers.push(msg.sender);
    } 
     
    //update staking balance
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
    }

    //unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        // require the amount to be greater than zero
        require(balance > 0, 'staking balance cannot be less than zero');

        //transfer the tokens to the specific contract address from the vault
        frysk.transfer(msg.sender, balance);

        //reset staking balance
        stakingBalance[msg.sender] = 0;

        //Update staking status
        isStaking[msg.sender] = false;

    }

  //issue rewards
  function issueTokens() public {
        // Only owner can call this function
    require(msg.sender == owner, 'caller must be the owner');

//issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9; // divide by 9 to create percentage incentive for stakers
            if(balance > 0) {
                vfrysk.transfer(recipient, balance);
            }
        }
  }
    }
