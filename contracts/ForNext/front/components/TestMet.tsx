"use client";

import { ethers, formatUnits, getDefaultProvider } from "ethers";

// Import just a few select items
import { BrowserProvider, parseUnits } from "ethers";

// Import from a specific export
import { HDNodeWallet } from "ethers/wallet";

import auctionAddress from "../contracts/DutchAuction-contract-address.json";
import auctionArtifact from "../contracts/DutchAuction.json";
import { useEffect, useState } from "react";

const TestMet = () => {
  const [qwe, setQwe] = useState("");

  // const provider = getDefaultProvider("http://localhost:8545/");
  // const provider = new ethers.JsonRpcProvider();

  // const signer = provider.getSigner();

  // const contract = new ethers.Contract(
  //   auctionAddress.DutchAuction,
  //   auctionArtifact.abi,
  //   provider
  // );

  useEffect(() => {
    (async () => {
      const provider = new ethers.JsonRpcProvider();

      const [selectedAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const newBalance = (
        await provider.getBalance(selectedAddress)
      ).toString();

      console.log("provider", provider, selectedAddress);

      // Format the balance for humans, such as in a UI
      setQwe(newBalance);
    })();
  }, []);

  return (
    <div>{qwe && <p>Your balance: {ethers.formatEther(qwe)} ETH</p>} </div>
  );
};

export default TestMet;
