import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMsg('')
    const form = new FormData(e.currentTarget)
    const name = form.get('name')
    const email = form.get('email')
    const password = form.get('password')

    try {
      if (mode === 'signup') {
        const data = await api('/auth/signup', { method: 'POST', body: { name, email, password } })
        onAuth?.(data)
      } else if (mode === 'login') {
        const data = await api('/auth/login', { method: 'POST', body: { email, password } })
        onAuth?.(data)
      } else if (mode === 'reset') {
        const data = await api('/auth/request-password-reset', { method: 'POST', body: { email } })
        setMsg('Reset link generated. Use token below to set a new password.')
        setError('Token (demo): ' + (data?.reset_token || 'N/A'))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur p-6 rounded-2xl shadow-xl border border-gray-200">
      <div className="flex gap-2 mb-6">
        {['login','signup','reset'].map(m => (
          <button key={m} onClick={() => setMode(m)} className={`relative flex-1 py-2 rounded-lg text-sm font-medium ${mode===m?'text-white':'text-gray-600'}`}>
            <AnimatePresence>
              {mode===m && (
                <motion.span layoutId="pill" className="absolute inset-0 bg-blue-600 rounded-lg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
              )}
            </AnimatePresence>
            <span className="relative z-10 capitalize">{m}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode==='signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>
        {mode!=='reset' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
        )}
        <button disabled={loading} className="w-full py-2 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-60">
          {loading ? 'Please wait...' : mode==='signup' ? 'Create account' : mode==='login' ? 'Sign in' : 'Send reset link'}
        </button>
      </form>

      {(error || msg) && (
        <div className="mt-4 text-sm">
          {msg && <p className="text-green-700">{msg}</p>}
          {error && <p className="text-amber-700">{error}</p>}
        </div>
      )}
    </div>
  )
}
