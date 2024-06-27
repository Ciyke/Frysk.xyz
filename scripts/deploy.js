const hre = require("hardhat");

async function main() {
  
    // Deploy Frysk contract
    const frysk = await hre.ethers.deployContract("Frysk");
    await frysk.waitForDeployment();
    console.log(`Frysk deployed to ${frysk.target}`);
  
    // Deploy VFRYSK contract
    const vfrysk = await hre.ethers.deployContract("VFRYSK");
    await vfrysk.waitForDeployment();
    console.log(`VFRYSK deployed to ${vfrysk.target}`);
  
    // Arguments for FryskVault contract deployment
    const args = [
        frysk.target, 
        vfrysk.target
    ];

    // Deploy FryskVault contract
    const fryskVault = await hre.ethers.deployContract("FryskVault", args);
    await fryskVault.waitForDeployment();
    console.log(`FryskVault deployed to ${fryskVault.target}`);
    
    // Get the list of accounts
    const accounts = await hre.ethers.getSigners();
    console.log(`Accounts: ${accounts.map(account => account.address)}`);

    // if (!accounts || accounts.length < 2) {
    //     throw new Error('Insufficient accounts for token transfers');
    // }

    // Transfer all VFRYSK tokens to FryskVault (1 million)
    const vfryskTransferTx = await vfrysk.transfer(fryskVault.target, '1000000000000000000000000');
    await vfryskTransferTx.wait();
    console.log('Transferred 1 million VFRYSK tokens to FryskVault');

    // Transfer 100 Frysk tokens to an investor
    const investorAddress = "0x4bFA3E5b1119BE4633Dcbbb68fafa430Eec72787";
    const fryskTransferTx = await frysk.transfer(investorAddress, '100000000000000000000');
    await fryskTransferTx.wait();
    console.log('Transferred 100 Frysk tokens to investor');
}
  
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
