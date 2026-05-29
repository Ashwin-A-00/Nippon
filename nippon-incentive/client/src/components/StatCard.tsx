import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  sublabel?: string
  highlight?: boolean
}

const StatCard = ({ label, value, icon: Icon, sublabel, highlight }: StatCardProps) => {
  return (
    <article className="h-full w-full rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-6 transition-colors duration-200 hover:bg-[#222222]">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-[#888888]">{label}</p>
        <Icon size={20} className={highlight ? 'text-[#DC1428]' : 'text-[#888888]'} />
      </div>

      <p className="mt-3 text-4xl font-bold text-white">{value}</p>
      {sublabel ? <p className="mt-1 text-sm text-[#888888]">{sublabel}</p> : null}

      <div className="mt-4 h-0.5 w-8 rounded-full bg-white/[0.08]" />
    </article>
  )
}

export default StatCard
