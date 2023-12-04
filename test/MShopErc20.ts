import { loadFixture, ethers, expect } from "./setup";
const tokenJSON = require("../artifacts/contracts/ERC20/Erc.sol/MCSToken.json");

describe("MShop", function () {
  async function beforeEach() {
    const [owner, buyer] = await ethers.getSigners();

    const MShop = await ethers.getContractFactory("MShop", owner);
    const shop = await MShop.deploy();
    await shop.waitForDeployment();

    const erc20 = new ethers.Contract(await shop.token(), tokenJSON.abi, owner);

    return { owner, buyer, shop, erc20 };
  }

  it("should have an owner and a token", async function () {
    const { owner, shop } = await loadFixture(beforeEach);

    expect(await shop.owner()).to.eq(owner.address);

    expect(await shop.token()).to.be.properAddress;
  });

  it("allows to buy", async function () {
    const { shop, buyer, erc20 } = await loadFixture(beforeEach);

    const tokenAmount = 3;

    const txData = {
      value: tokenAmount,
      to: shop.target,
    };

    const tx = await buyer.sendTransaction(txData);
    await tx.wait();

    expect(await erc20.balanceOf(buyer.address)).to.eq(tokenAmount);

    await expect(tx).to.changeEtherBalance(shop, tokenAmount);

    await expect(tx)
      .to.emit(shop, "Bought")
      .withArgs(tokenAmount, buyer.address);
  });

  it("allows to sell", async function () {
    const { shop, buyer, erc20 } = await loadFixture(beforeEach);

    const tx = await buyer.sendTransaction({
      value: 3,
      to: shop.target,
    });
    await tx.wait();

    const sellAmount = 2;

    //@ts-ignore
    const approval = await erc20.connect(buyer).approve(shop.target, sellAmount);

    await approval.wait();

    const sellTx = await shop.connect(buyer).sell(sellAmount);

    expect(await erc20.balanceOf(buyer.address)).to.eq(1);

    await expect(() => sellTx).to.changeEtherBalance(shop, -sellAmount);

    await expect(sellTx)
      .to.emit(shop, "Solid")
      .withArgs(sellAmount, buyer.address);
  });
});
