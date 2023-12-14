import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/taskDemo_task";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: {
    sources: "./contracts",
  },
  //@ts-ignore
  namedAccounts: {
    deployer: 0,
    user: 1,
  },
};

export default config;
