import { task, types } from "hardhat/config";
import type { TaskDemo } from "../typechain-types";
import { TaskDemo__factory } from "../typechain-types/factories";

task("balance", "Displays balance")
  .addParam("account", "Account address")
  .addOptionalParam(
    "greeting",
    "Greeting to print",
    "Default greeting",
    types.string
  )
  .setAction(async (taskArgs, { ethers }) => {
    const account = taskArgs.account;
    const msg = taskArgs.greeting;

    console.log(msg);
    const balance = await ethers.provider.getBalance(account);

    console.log(balance.toString());
  });

task("callme", "Call demo func")
  .addParam("contract", "Contract address")
  .addOptionalParam("account", "Account name", "deployer", types.string)
  //@ts-ignore
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const account = (await getNamedAccounts())[taskArgs.account];

    const demo = TaskDemo__factory.connect(
      taskArgs.contract,
      await ethers.getSigner(account)
    );

    console.log(await demo.callme());
  });

task("pay", "Call pay func")
  .addParam("value", "Value to send", 0, types.int)
  .addOptionalParam("account", "Account name", "deployer", types.string)
  //@ts-ignore
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const account = (await getNamedAccounts())[taskArgs.account];
    //@ts-ignore
    const demo = await ethers.getContractAt<TaskDemo>("TaskDemo", account);

    const tx = await demo.pay(`Hello from ${account}`, {
      value: taskArgs.value,
    });
    await tx.wait();

    console.log(await demo.message());
    console.log((await ethers.provider.getBalance(demo.target)).toString());
  });

task("distribute", "Distribute funds")
  .addParam("addresses", "Addresses to distribute to")
  .setAction(async (taskArgs, { ethers }) => {
    //@ts-ignore
    const demo = await ethers.getContractAt<TaskDemo>("TaskDemo");

    const addrs = taskArgs.addresses.split(",");

    const tx = await demo.distribute(addrs);
    await tx.wait();

    await Promise.all(
      addrs.map(async (addr: string) => {
        console.log((await ethers.provider.getBalance(addr)).toString());
      })
    );
  });
