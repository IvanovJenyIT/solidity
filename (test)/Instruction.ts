import { loadFixture, ethers, expect } from "../test/setup";

describe("Instruction", function () {
  async function beforeEach() {
    const [owner, other_addr] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Instruction", owner);
    const instruction = await Factory.deploy();
    await instruction.waitForDeployment();

    return { owner, other_addr, instruction };
  }

  it("should allow to send money", async function () {
    const { owner, other_addr, instruction } = await loadFixture(beforeEach);

    const sum = 100; //wei
    let timestamp;

    const tx = await owner.sendTransaction({
      to: instruction.target,
      value: sum,
    });

    await tx.wait(1);

    expect(await ethers.provider.getBalance(instruction.target)).to.equal(sum);

    if (tx.blockNumber !== null) {
      const block = await ethers.provider.getBlock(tx.blockNumber);
      if (block) {
        timestamp = block.timestamp;
      } else {
        console.log("Block not found");
      }
    } else {
      console.log("Transaction is still pending");
    }

    // await expect(tx)
    //   .to.emit(instruction, "Paid")
    //   .withArgs(other_addr, sum, timestamp);
  });

  it("shound allow owner to withdraw funds", async function () {
    const { owner, other_addr, instruction } = await loadFixture(beforeEach);

    const sum = 100; //wei

    const tx = await instruction.withdraw(other_addr);
    await tx.wait(1);

    await expect(tx).to.changeEtherBalances([instruction, owner], [-sum, sum]);
  });
});
