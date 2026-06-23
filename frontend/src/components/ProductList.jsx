import { useState, useRef } from 'react'
import './ProductList.css'

function ProductList({ products, stock, units, onStockUpdate }) {
  const [search, setSearch] = useState('')
  const [flashId, setFlashId] = useState(null)
  const flashTimer = useRef(null)

  if (products.length === 0) {
    return <div className="empty-state">No products found. Check your Grocy instance.</div>
  }

  const filtered = products.filter(p =>
    (stock[String(p.id)] ?? 0) > 0 &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRemove = (product) => {
    const qty = stock[String(product.id)] ?? 0
    if (qty <= 0) return

    clearTimeout(flashTimer.current)
    setFlashId(product.id)
    flashTimer.current = setTimeout(() => setFlashId(null), 1200)

    onStockUpdate(product.id, 'remove', product.quick_consume_amount || 1)
  }

  return (
    <div className="product-list-wrapper">
      <input
        className="search"
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="product-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">No items match "{search}"</div>
        ) : (
          filtered.map((product) => {
            const qty = stock[String(product.id)] ?? 0
            const unit = units[String(product.quantity_unit_id)] || ''
            const empty = qty <= 0
            const flashing = flashId === product.id

            return (
              <div
                key={product.id}
                className={`product-card ${empty ? 'empty' : ''} ${flashing ? 'flash' : ''}`}
                onClick={() => handleRemove(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleRemove(product)}
              >
                <div className="card-name">{product.name}</div>
                <div className="card-qty">
                  {flashing ? '✓' : empty ? 'Out!' : `${qty} ${unit}`}
                </div>
                <button
                  className="btn-add"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStockUpdate(product.id, 'add', 1)
                  }}
                  title="Add 1"
                  aria-label={`Add ${product.name}`}
                >
                  +
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ProductList
