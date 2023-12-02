import { loadFixture, ethers, expect } from "./setup";

describe("HolandAukcion", function () {
  async function beforeEach() {
    const [owner, seller, buyer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("HolandAukcion", owner);
    const auct = await Factory.deploy();
    await auct.waitForDeployment();

    return { owner, seller, buyer, auct };
  }

  it("sets owner", async function () {
    const { auct, owner } = await loadFixture(beforeEach);

    const currentOwner = await auct.owner();

    expect(currentOwner).to.eq(owner.address);
  });

  async function getTimestamp(bn: number) {
    const block = await ethers.provider.getBlock(bn);
    if (block) {
      return block.timestamp;
    } else {
      console.log("Block not found");
      return 0; // or any other default value
    }
  }

  // describe("createAuction", function () {
  //   it("creates auction correctly", async function () {
  //     const { auct, seller, owner } = await loadFixture(beforeEach);

  //     const duration = 60;

  //     const tx = await auct
  //       .connect(seller)
  //       .createAuction(ethers.parseEther("0.0001"), 3, "fake item", duration);

  //     await tx.wait();

  //     const cAuction = await auct.auctions(0);

  //     expect(cAuction.item).to.eq("fake item");

  //     if (tx.blockNumber) {
  //       const ts = await getTimestamp(tx.blockNumber);
  //       expect(cAuction.endsAt).to.eq(ts + duration);
  //     } else {
  //       console.log("tx.blockNumber not found");
  //     }
  //   });
  // });

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  describe("buy", function () {
    it("allows to buy", async function () {
      const { owner, seller, buyer, auct } = await loadFixture(beforeEach);

      await auct
        .connect(seller)
        .createAuction(ethers.parseEther("0.0001"), 3, "fake item", 60);

      this.timeout(5000); // 5s
      await delay(1000);

      const buyTx = await auct
        .connect(buyer)
        .buy(0, { value: ethers.parseEther("0.0001") });

      const cAuction = await auct.auctions(0);
      const finalPrice = cAuction.finalPrice;
      await expect(buyTx).to.changeEtherBalance(
        seller,
        Number(finalPrice) - Math.floor((Number(finalPrice) * 10) / 100)
      );

      await expect(buyTx)
        .to.emit(auct, "AuctionEnded")
        .withArgs(0, finalPrice, buyer.address);

      await expect(
        auct.connect(buyer).buy(0, { value: ethers.parseEther("0.0001") })
      ).to.be.revertedWith("stopped!");
    });
  });
});
