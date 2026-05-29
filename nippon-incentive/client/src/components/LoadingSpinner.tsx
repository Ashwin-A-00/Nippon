type LoaderSize = 'sm' | 'md' | 'lg'

interface NoirLoaderProps {
  size?: LoaderSize
  /** White bars for use on red buttons */
  variant?: 'default' | 'light'
}

const sizeConfig: Record<LoaderSize, { bar: string; gap: string; track: string }> = {
  sm: { bar: 'h-3.5 w-[2px]', gap: 'gap-[3px]', track: 'h-3.5' },
  md: { bar: 'h-5 w-[2.5px]', gap: 'gap-1', track: 'h-5' },
  lg: { bar: 'h-7 w-[3px]', gap: 'gap-1.5', track: 'h-7' }
}

const NoirLoader = ({ size = 'md', variant = 'default' }: NoirLoaderProps) => {
  const { bar, gap, track } = sizeConfig[size]
  const accent = variant === 'light' ? 'noir-bar-light-accent' : 'noir-bar-accent'
  const base = variant === 'light' ? 'noir-bar-light' : 'noir-bar'

  return (
    <div
      className={`flex items-end ${gap} ${track}`}
      role="status"
      aria-label="Loading"
    >
      <span className={`${bar} ${base} rounded-full`} style={{ animationDelay: '0ms' }} />
      <span className={`${bar} ${accent} rounded-full`} style={{ animationDelay: '160ms' }} />
      <span className={`${bar} ${base} rounded-full`} style={{ animationDelay: '320ms' }} />
      <span className={`${bar} ${base} rounded-full`} style={{ animationDelay: '480ms' }} />
    </div>
  )
}

export const FullPageLoader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F0F0F]">
      <div className="noir-loader-enter flex flex-col items-center gap-6">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-white/[0.08]" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#DC1428] noir-arc-spin" />
          <NoirLoader size="sm" />
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#444444] noir-text-pulse">
          Loading
        </p>
      </div>
    </div>
  )
}

/** Compact loader for buttons and inline states */
export const ButtonLoader = () => <NoirLoader size="sm" variant="light" />

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-2">
    <NoirLoader size="md" />
  </div>
)

export default LoadingSpinner
