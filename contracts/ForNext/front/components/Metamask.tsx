"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ethers, Contract, AddressLike, JsonRpcSigner } from "ethers";
import auctionAddress from "../contracts/DutchAuction-contract-address.json";
import auctionArtifact from "../contracts/DutchAuction.json";
import ConnectWallet from "./ConnectWallet";
import WaitingForTransactionMessage from "./WaitingForTransactionMessage";
import { TransactionErrorMessage } from "./TransactionErrorMessage";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Metamask() {
  const [selectedAccount, setSelectedAccount] = useState<AddressLike>("");
  const [txBeingSent, setTxBeingSent] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<
    string | unknown | null
  >(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [stopped, setStopped] = useState<Boolean>(false);

  const provider = useRef<ethers.BrowserProvider | null>(null);
  const signer = useRef<JsonRpcSigner | null>(null);
  const auction = useRef<Contract | null>(null);
  const checkPriceInterval = useRef<NodeJS.Timeout | null>(null);

  const updateBalance = useCallback(async () => {
    if (provider.current) {
      const newBalance = (
        await provider.current.getBalance(selectedAccount)
      ).toString();
      setBalance(newBalance);
    }
  }, [selectedAccount]);

  const initialize = useCallback(
    async (selectedAddress: AddressLike) => {
      provider.current = new ethers.BrowserProvider(window.ethereum);

      signer.current = await provider.current.getSigner();

      auction.current = new Contract(
        auctionAddress.DutchAuction,
        auctionArtifact.abi,
        await provider.current.getSigner(0)
      );

      setSelectedAccount(selectedAddress);
      updateBalance();

      const startingPrice = await auction.current.startingPrice();
      const startAt = BigInt(Number(await auction.current.startAt()));
      const discountRate = await auction.current.discountRate();

      if (await updateStopped()) {
        return;
      }

      checkPriceInterval.current = setInterval(() => {
        const elapsed = BigInt(Date.now() / 1000) - startAt;
        const discont = discountRate * elapsed;
        const newPricce = startingPrice - discont;
        setCurrentPrice(Number(ethers.formatEther(newPricce)));
      }, 1000);

      // const startBlockNumber = await provider.current.getBlockNumber()

      // auction.current.on("Bought", (...args) => {
      //   const event = args[args.length - 1];
      //   if(event.blockNumber <= startBlockNumber) return
      //   args[0], args[1]
      //  });
    },
    [updateBalance]
  );

  const updateStopped = async () => {
    const stopped = await auction.current?.stopped();

    if (stopped && checkPriceInterval.current) {
      clearInterval(checkPriceInterval.current);
    }

    setStopped(stopped);

    return stopped;
  };

  useEffect(() => {
    if (checkPriceInterval.current) {
      clearInterval(checkPriceInterval.current);
    }
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      initialize(selectedAccount);
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", ([newAddress]: string[]) => {
        if (newAddress === undefined) {
          return resetState();
        }

        initialize(newAddress);
      });

      window.ethereum.on("chainChanged", () => {
        resetState();
      });
    }
  }, [initialize, selectedAccount]);

  const connectWallet = async () => {
    if (window.ethereum === null) {
      setNetworkError("Please install Metamask!");
      return;
    }

    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setSelectedAccount(selectedAddress);
  };

  const resetState = () => {
    setSelectedAccount("");
    setTxBeingSent(null);
    setNetworkError(null);
    setTransactionError(null);
    setBalance(null);
  };

  const dismissNetworkError = () => {
    setNetworkError(null);
  };

  const dismissTransactionError = () => {
    setTransactionError(null);
  };

  const buy = async () => {
    //@ts-ignore
    try {
      let tx;
      if (currentPrice) {
        console.log("tx", tx);

        const qqq = (currentPrice + 1).toString();

        tx = await auction.current?.buy({
          value: ethers.parseEther(qqq),
        });
        console.log("tx1", tx);
      }

      setTxBeingSent(tx.hash);

      await tx.wait();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === ERROR_CODE_TX_REJECTED_BY_USER
      ) {
        return;
      }

      console.error(error);

      setTransactionError(error);
    } finally {
      setTxBeingSent(null);

      await updateBalance();
      await updateStopped();
    }
  };

  if (!selectedAccount) {
    return (
      <ConnectWallet
        connectWallet={connectWallet}
        networkError={networkError}
        dismiss={dismissNetworkError}
      />
    );
  }

  if (stopped) {
    return <p>Auction stopped.</p>;
  }

  const getRpcErrorMessage = (error: any) => {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  };

  return (
    <>
      {txBeingSent && <WaitingForTransactionMessage txHash={txBeingSent} />}

      {transactionError && (
        <TransactionErrorMessage
          message={getRpcErrorMessage(transactionError)}
          dismiss={dismissTransactionError()}
        />
      )}

      {balance && <p>Your balance: {ethers.formatEther(balance)} ETH</p>}

      {currentPrice && (
        <div>
          <p>Current item price: {currentPrice} ETH</p>
          <button onClick={buy}>Buy!</button>
        </div>
      )}
    </>
  );
}
