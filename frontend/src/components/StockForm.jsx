import { useState } from 'react'
import './StockForm.css'

function StockForm({ products, onSubmit }) {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [action, setAction] = useState('remove')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedProduct && quantity) {
      onSubmit(selectedProduct, action, quantity)
      setQuantity('1')
    }
  }

  return (
    <form className="stock-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Select Item</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
        >
          <option value="">-- Choose a product --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.quantity_unit_id && `(${p.quantity_unit_id})`}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Action</label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="add">Add Stock</option>
          <option value="remove">Remove Stock</option>
        </select>
      </div>

      <button type="submit" className={`btn ${action}`}>
        {action === 'add' ? '➕ Add' : '➖ Remove'}
      </button>
    </form>
  )
}

export default StockForm
