interface IWaitingForTransactionMessage {
  message: any;
  dismiss: any;
}

export function TransactionErrorMessage({
  message,
  dismiss,
}: IWaitingForTransactionMessage) {
  return (
    <div>
      TX error: {message}
      <button type="button" onClick={dismiss}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
