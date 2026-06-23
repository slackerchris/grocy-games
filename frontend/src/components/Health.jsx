import { useEffect, useState } from 'react'
import './Health.css'

function Health() {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (!response.ok) throw new Error('Backend not responding')
        const data = await response.json()
        if (data.status !== 'ok') throw new Error(data.error || 'Grocy unreachable')
        setStatus(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setStatus(null)
        setCollapsed(false)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  // Collapse to dot after 4 seconds of confirmed ok
  useEffect(() => {
    if (!status) return
    const t = setTimeout(() => setCollapsed(true), 4000)
    return () => clearTimeout(t)
  }, [status])

  if (error) {
    return (
      <div className="health error">
        <span className="dot" /> {error}
      </div>
    )
  }

  if (collapsed) {
    return (
      <div
        className="health dot-only"
        title={`Connected to ${status?.grocy}`}
        onClick={() => setCollapsed(false)}
      >
        <span className="dot" />
      </div>
    )
  }

  return (
    <div className="health ok" onClick={() => setCollapsed(true)}>
      <span className="dot" />
      {status ? `Connected to ${status.grocy}` : 'Connecting…'}
    </div>
  )
}

export default Health
