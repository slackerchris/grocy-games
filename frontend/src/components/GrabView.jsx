import { useState } from 'react'
import './GrabView.css'

const QUICK_AMOUNTS = [1, 2, 3]

function GrabView({ product, qty, unit, onGrab, onBack }) {
  const [selected, setSelected] = useState(1)
  const [custom, setCustom] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [grabbed, setGrabbed] = useState(false)

  const amount = showCustom ? parseFloat(custom) || 0 : selected
  const empty = qty <= 0

  const handleGrab = async () => {
    if (amount <= 0 || amount > qty) return
    await onGrab(product.id, 'remove', amount)
    setGrabbed(true)
    setTimeout(() => setGrabbed(false), 1500)
  }

  return (
    <div className="grab-view">
      <button className="back-btn" onClick={onBack}>← All Items</button>

      <div className="grab-card">
        <div className="grab-name">{product.name}</div>
        <div className={`grab-stock ${empty ? 'out' : ''}`}>
          {empty ? 'Out of stock' : `${qty} ${unit} left`}
        </div>
      </div>

      {!empty && (
        <>
          <p className="grab-label">How many are you grabbing?</p>

          <div className="amount-row">
            {QUICK_AMOUNTS.map(n => (
              <button
                key={n}
                className={`amount-btn ${!showCustom && selected === n ? 'active' : ''}`}
                onClick={() => { setSelected(n); setShowCustom(false) }}
              >
                {n}
              </button>
            ))}
            <button
              className={`amount-btn ${showCustom ? 'active' : ''}`}
              onClick={() => setShowCustom(true)}
            >
              ?
            </button>
          </div>

          {showCustom && (
            <input
              className="custom-input"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Enter amount"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              autoFocus
            />
          )}

          <button
            className={`grab-btn ${grabbed ? 'grabbed' : ''}`}
            onClick={handleGrab}
            disabled={amount <= 0 || amount > qty}
          >
            {grabbed ? '✓ Done!' : 'Grab it!'}
          </button>
        </>
      )}

      {empty && (
        <button className="back-btn-large" onClick={onBack}>← Go Back</button>
      )}
    </div>
  )
}

export default GrabView
