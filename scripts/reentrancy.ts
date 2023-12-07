import { ethers } from "hardhat";

async function main() {
  const [bidder1, bidder2, hacker] = await ethers.getSigners();

  const ReentrancyAuction = await ethers.getContractFactory(
    "Reentrancy",
    bidder1
  );
  const auction = await ReentrancyAuction.deploy();
  await auction.waitForDeployment();

  const ReentrancyAttack = await ethers.getContractFactory(
    "ReentrancyAttack",
    hacker
  );
  const attack = await ReentrancyAttack.deploy(auction.target);
  await attack.waitForDeployment();

  const txBid = await auction.bid({ value: ethers.parseEther("4.0") });
  await txBid.wait();

  const txBid2 = await auction
    .connect(bidder2)
    .bid({ value: ethers.parseEther("8.0") });
  await txBid2.wait();

  const txBid3 = await attack
    .connect(hacker)
    .proxyBid({ value: ethers.parseEther("1.0") });
  await txBid3.wait();

  console.log(
    "Auction balance",
    await ethers.provider.getBalance(auction.target)
  );

  const doAttack = await attack.connect(hacker).attack();
  await doAttack.wait();

  console.log(
    "Auction balance",
    await ethers.provider.getBalance(auction.target)
  );
  console.log(
    "Attacker balance",
    await ethers.provider.getBalance(attack.target)
  );
  console.log(
    "Bidder2 balance",
    await ethers.provider.getBalance(bidder2.address)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
