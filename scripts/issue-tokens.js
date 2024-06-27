const fryskVault = artifacts.require('FryskVault');

module.exports = async function issueRewards(callback){
    let fryskVault = await fryskVault.deployed()
    await fryskVault.issueTokens()
    console.log('Tokens have been issued successfully!')
    callback()
}
