import { AlertCircle, X } from 'lucide-react'

interface ErrorBannerProps {
  message: string
  onDismiss?: () => void
}

const ErrorBanner = ({ message, onDismiss }: ErrorBannerProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#DC1428]/30 bg-[#DC1428]/10 px-4 py-3">
      <AlertCircle className="text-[#DC1428]" size={18} />
      <p className="text-sm text-[#DC1428]">{message}</p>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto text-[#DC1428] hover:text-[#FF1A30]"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  )
}

export default ErrorBanner
