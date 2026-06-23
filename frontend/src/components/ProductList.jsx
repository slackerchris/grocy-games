import { useState } from 'react'
import './ProductList.css'

function ProductList({ products, stock, units, onStockUpdate }) {
  const [search, setSearch] = useState('')

  if (products.length === 0) {
    return <div className="empty-state">No products found. Check your Grocy instance.</div>
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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
            return (
              <div
                key={product.id}
                className={`product-card ${empty ? 'empty' : ''}`}
                onClick={() => !empty && onStockUpdate(product.id, 'remove', product.quick_consume_amount || 1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && !empty && onStockUpdate(product.id, 'remove', 1)}
              >
                <div className="card-name">{product.name}</div>
                <div className="card-qty">
                  {empty ? 'Out!' : `${qty} ${unit}`}
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
