interface IWaitingForTransactionMessage {
  txHash: string;
}

const WaitingForTransactionMessage = ({
  txHash,
}: IWaitingForTransactionMessage) => {
  return (
    <div>
      Waiting for transaction <strong>{txHash}</strong>
    </div>
  );
};

export default WaitingForTransactionMessage;
