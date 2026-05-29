import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F0F0F] px-4">
      <div className="flex flex-col items-center text-center">
        <ShieldX className="mb-6 text-[#888888]" size={64} />
        <h1 className="text-2xl font-semibold text-white">Access Denied</h1>
        <p className="mt-2 mb-8 text-sm text-[#888888]">
          You don't have permission to view this page.
        </p>
        <Link
          to="/login"
          className="inline-block rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-6 py-2.5 text-sm text-white transition-all hover:border-[#DC1428]"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized
