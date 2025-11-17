import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { API_BASE } from './lib/api'

function App() {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem('session')
    return raw ? JSON.parse(raw) : null
  })
  const [route, setRoute] = useState('home')

  useEffect(() => {
    localStorage.setItem('session', JSON.stringify(session))
  }, [session])

  useEffect(() => {
    const onHash = () => {
      const r = window.location.hash.replace('#','') || 'home'
      setRoute(r)
    }
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const onAuth = (data) => {
    setSession({ token: data.access_token, user: data.user })
    window.location.hash = 'app'
  }

  const logout = () => {
    setSession(null)
    window.location.hash = 'home'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#home" className="font-bold text-lg">HoloID</a>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#home" className="text-gray-600 hover:text-gray-900 transition">Home</a>
            <a href="#auth" className="text-gray-600 hover:text-gray-900 transition">Auth</a>
            {session && <a href="#app" className="text-gray-600 hover:text-gray-900 transition">Dashboard</a>}
            <span className="text-gray-400">API: {API_BASE.replace('https://','').replace('http://','')}</span>
            {session ? (
              <button onClick={logout} className="px-3 py-1 rounded-md bg-gray-900 text-white text-xs hover:bg-black transition">Logout</button>
            ) : (
              <a href="#auth" className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700 transition">Sign in</a>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {route === 'home' && (
            <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <Hero />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {["Auth", "Dashboard", "RBAC"].map((t, i) => (
                  <motion.div key={t} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}} className="p-6 rounded-2xl bg-white shadow border">
                    <div className="text-sm text-gray-500">Feature</div>
                    <div className="text-xl font-semibold">{t}</div>
                    <p className="text-gray-600 mt-2">Modern patterns with smooth micro-interactions.</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {route === 'auth' && (
            <motion.div key="auth" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="py-10">
              <Auth onAuth={onAuth} />
            </motion.div>
          )}

          {route === 'app' && session && (
            <motion.div key="app" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="py-6">
              <Dashboard token={session.token} user={session.user} />
            </motion.div>
          )}

          {route === 'app' && !session && (
            <motion.div key="need-auth" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center py-20">
              <p className="text-gray-600">Please sign in to access the dashboard.</p>
              <a href="#auth" className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white">Go to Sign in</a>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-10 text-center text-sm text-gray-500">Built with love • Smooth motion everywhere</footer>
    </div>
  )
}

export default App
