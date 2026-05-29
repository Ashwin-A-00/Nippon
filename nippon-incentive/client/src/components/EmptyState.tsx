interface EmptyStateProps {
  title?: string
  description?: string
}

const EmptyState = ({ title = 'No data', description = 'Nothing to show yet.' }: EmptyStateProps) => {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] px-6 py-12 text-center">
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm text-[#888888]">{description}</p>
    </section>
  )
}

export default EmptyState
