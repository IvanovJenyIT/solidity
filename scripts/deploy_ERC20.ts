import { ethers } from "hardhat";


async function main() {
  const [signer] = await ethers.getSigners()

  const Erc = await ethers.getContractFactory('MShop', signer)
  const erc = await Erc.deploy()
  await erc.waitForDeployment()
  console.log(erc.target)
  console.log(await erc.token())
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
