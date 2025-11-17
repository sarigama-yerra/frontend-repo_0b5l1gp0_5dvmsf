import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'

export default function Dashboard({ token, user }) {
  const [data, setData] = useState(null)
  const [notifs, setNotifs] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const d = await api('/metrics', { token })
        const n = await api('/notifications', { token })
        setData(d)
        setNotifs(n)
      } catch (e) {
        setError(e.message)
      }
    }
    load()
  }, [token])

  if (error) return <div className="text-red-600">{error}</div>
  if (!data) return <div className="text-gray-600">Loading dashboard...</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome, {user?.name || 'User'}</h2>
          <p className="text-gray-600">Here's what's happening with your product today.</p>
        </div>
        <div className="text-sm px-3 py-1 rounded-full bg-gray-100">Role: {user?.role}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.kpis.map((k, i) => (
          <motion.div key={i} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}} className="p-5 rounded-xl bg-white shadow hover:shadow-lg transition-shadow">
            <div className="text-gray-500 text-sm">{k.title}</div>
            <div className="text-2xl font-semibold">{k.value}</div>
            <div className="text-xs text-emerald-600 mt-1">{k.delta}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-white shadow">
          <h3 className="font-semibold mb-3">Trends</h3>
          <div className="h-48 w-full grid grid-cols-7 items-end gap-2">
            {data.series[0].data.map((v, i) => (
              <motion.div key={i} initial={{height:0}} animate={{height: `${v*4}px`}} transition={{type:'spring', stiffness:120, damping:20}} className="bg-blue-500/80 rounded-t-md" />
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-white shadow">
          <h3 className="font-semibold mb-3">Notifications</h3>
          <div className="space-y-3">
            {notifs.map(n => (
              <motion.div key={n.id} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-gray-600">{n.message}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-white shadow">
        <h3 className="font-semibold mb-4">Customers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Name</th>
                <th>Plan</th>
                <th>Seats</th>
                <th>MRR</th>
              </tr>
            </thead>
            <tbody>
              {data.table.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 font-medium">{r.name}</td>
                  <td>{r.plan}</td>
                  <td>{r.seats}</td>
                  <td>${r.mrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
