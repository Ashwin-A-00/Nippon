import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Access Denied</h1>
        <p className="mt-3 text-base text-gray-600">You don't have permission to view this page</p>
        <Link
          to="/login"
          className="mt-8 inline-flex rounded-lg bg-[#CC0000] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a80000]"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized
