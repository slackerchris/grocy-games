import { useState } from 'react'
import './UserPicker.css'

function UserPicker({ users, onSelect }) {
  const [customName, setCustomName] = useState('')

  const handleCustom = () => {
    if (customName.trim()) onSelect(customName.trim())
  }

  return (
    <div className="user-picker-overlay">
      <div className="user-picker">
        <h2>Who's grabbing snacks? 🍕</h2>

        {users.length > 0 ? (
          <div className="user-grid">
            {users.map(u => (
              <button
                key={u.id}
                className="user-btn"
                onClick={() => onSelect(u.display_name || u.username)}
              >
                <span className="user-avatar">
                  {(u.display_name || u.username).charAt(0).toUpperCase()}
                </span>
                <span>{u.display_name || u.username}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="custom-name">
            <input
              type="text"
              placeholder="Type your name..."
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustom()}
              autoFocus
            />
            <button className="go-btn" onClick={handleCustom} disabled={!customName.trim()}>
              Let's go!
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPicker
