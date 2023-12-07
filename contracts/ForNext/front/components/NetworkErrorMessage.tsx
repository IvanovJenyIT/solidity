interface NetworkErrorMessageProps {
  message: string;
  dismiss: () => void;
}

export default function NetworkErrorMessage({
  message,
  dismiss,
}: NetworkErrorMessageProps) {
  return (
    <div>
      {message}
      <button type="button" onClick={dismiss}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
