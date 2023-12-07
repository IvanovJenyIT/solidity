import { FC } from "react";
import NetworkErrorMessage from "./NetworkErrorMessage";

interface ConnectWalletProps {
  connectWallet: () => Promise<void>;
  networkError: string | null;
  dismiss: () => void;
}

const ConnectWallet: FC<ConnectWalletProps> = ({
  connectWallet,
  networkError,
  dismiss,
}: ConnectWalletProps) => {
  return (
    <>
      <div>
        {networkError && (
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        )}
      </div>

      <p>Please connect your account...</p>
      <div onClick={connectWallet}>Connect Wallet</div>
    </>
  );
};

export default ConnectWallet;
