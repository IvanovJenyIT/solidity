import { loadFixture, ethers, expect } from "./setup";

describe("Interfece", function () {
  async function beforeEach() {
    const [owner] = await ethers.getSigners();

    const Logger = await ethers.getContractFactory("Interfece");
    const logger = await Logger.deploy();
    await logger.waitForDeployment();

    const DemoInterface = await ethers.getContractFactory("Interfece_demo");
    const demoInterface = await DemoInterface.deploy(logger.target);
    await demoInterface.waitForDeployment();

    return { owner, demoInterface };
  }

  it("allows to pay and get payment info", async function () {
    const { owner, demoInterface } = await loadFixture(beforeEach);

    const sum = 100;

    const txData = {
      value: sum,
      to: demoInterface.target,
    };

    const tx = await owner.sendTransaction(txData);
    await tx.wait();

    await expect(tx).to.changeEtherBalance(demoInterface, sum);

    const amount = await demoInterface.payement(owner.address, 0);

    expect(amount).to.eq(sum);
  });
});
