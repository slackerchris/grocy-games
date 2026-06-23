import { useEffect, useState } from 'react'
import './Health.css'

function Health() {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (!response.ok) throw new Error('Backend not responding')
        const data = await response.json()
        setStatus(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setStatus(null)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`health ${status ? 'ok' : 'error'}`}>
      {status ? (
        <span>✓ Connected to Grocy at {status.grocy}</span>
      ) : (
        <span>✗ {error || 'Connecting...'}</span>
      )}
    </div>
  )
}

export default Health
