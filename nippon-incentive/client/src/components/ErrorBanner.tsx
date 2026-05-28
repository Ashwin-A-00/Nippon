interface ErrorBannerProps {
  message: string;
}

const ErrorBanner = ({ message }: ErrorBannerProps) => {
  return <div role="alert">{message}</div>;
};

export default ErrorBanner;
