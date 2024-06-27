const VFRYSK = artifacts.require('VFRYSK')
const Frysk = artifacts.require('Frysk')
const FryskVault = artifacts.require('FryskVault')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('FryskVault', ([owner, customer]) => {
  let frysk, vfrysk, fryskVault

  function tokens(number) {
    return Web3.utils.toWei(number, 'ether')
  }

  before(async () => {
    //Load contracts
    frysk = await Frysk.new()
    vfrysk = await VFRYSK.new()
    fryskVault = await FryskVault.new(vfrysk.address, frysk.address)

    //Transfer all tokens to FryskVault(1 million)
    await vfrysk.transfer(fryskVault.address, tokens('1000000'))

    //Transfer 100 frysk tokens to customer
    await frysk.transfer(customer, tokens('100'), {from: owmer})
  })


  describe('Frysk Token Deployment', async () => {
    it('matches name successfully', async () => {
      const name = await frysk.name()
      assert.equal(name, 'Frysk Token')
    })
  })

  describe('Frysk Vault Token Deployment', async () => {
    it('matches name successfully', async () => {
      const name = await vfrysk.name() 
      assert.equal(name, 'Frysk Vault Token')
    })
  })

  describe('Frysk Vault Deployment', async () => {
    it('matches name successfully', async () => {
      const name = await fryskVault.name()
      assert.equal(name, 'Frysk Vault')
    })

    it('contract has tokens', async () => {
      let balance = await vfrysk.balanceOf(fryskVault.address)
      assert.equal(balance, tokens('1000000'))
    })

    describe('Yield Farming', async () => {
      it('rewards tokens for staking', async () => {
        let result

        //check investor balance
        result = await frysk.balanceOf(customer)
        assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')

        // Check staking for customer of 100 tokens
        await frysk.approve(fryskVault.address, tokens('100'), {from: customer})
        await fryskVault.depositTokens(tokens('100'), {from: customer})

        //check updated balance of customer 
        result = await frysk.balanceOf(customer)
        assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking 100 tokens')

        //check updated balance of Frysk Vault
        result = await frysk.balanceOf(fryskVault.address)
        assert.equal(result.toString(), tokens('100'), 'frysk vault mock wallet after staking from customer')

        //Is Staking Update
        result = await fryskVault.isStaking(customer)
        assert.equal(result.toString(), 'true', 'customer is staking status after staking')

        //issue tokens
        await fryskVault.issueTokens({from: owner})

        //Ensure only the owner can issue tokens
        await fryskVault.issueTokens({from: customer}).should.be.rejected;

        //unstake tokens
        await fryskVault.unstakeTokens({from: customer})

        //check unstaking balances

        result = await frysk.balanceOf(customer)
        assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after staking 100 tokens')

        //check updated balance of Frysk Vault
        result = await frysk.balanceOf(fryskVault.address)
        assert.equal(result.toString(), tokens('0'), 'frysk vault mock wallet balance after staking from customer')

        //Is staking update
        result = await fryskVault.isStaking(customer)
        assert.equal(result.toString(), 'false', 'customer is no longer staking after staking')
      })
    })
  })
})