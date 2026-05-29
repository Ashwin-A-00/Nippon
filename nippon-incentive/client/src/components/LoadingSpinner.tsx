const LoadingSpinner = () => {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/[0.08] border-t-[#DC1428]" />
  )
}

export const FullPageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F]">
      <LoadingSpinner />
    </div>
  )
}

export default LoadingSpinner
