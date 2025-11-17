import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm"
        >
          Identity-first SaaS Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-xl text-gray-700"
        >
          Secure auth, smooth motion, and a modern, scalable foundation.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex gap-4"
        >
          <a href="/app" className="px-5 py-3 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">Open App</a>
          <a href="/auth" className="px-5 py-3 rounded-lg bg-white/80 backdrop-blur border border-gray-200 text-gray-900 hover:bg-white transition-colors">Sign In</a>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white"></div>
    </section>
  )
}
