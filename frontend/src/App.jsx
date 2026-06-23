import { useState, useEffect, useCallback } from 'react'
import './App.css'
import ProductList from './components/ProductList'
import StockForm from './components/StockForm'
import Health from './components/Health'
import GrabView from './components/GrabView'

function App() {
  const [products, setProducts] = useState([])
  const [stock, setStock] = useState({})
  const [units, setUnits] = useState({})
  const [locations, setLocations] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [showRestock, setShowRestock] = useState(false)

  // NFC routing via URL params
  const params = new URLSearchParams(window.location.search)
  const nfcProductId = params.get('product')
  const nfcLocationId = params.get('location')

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2000)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [productsRes, stockRes, unitsRes, locationsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/stock'),
        fetch('/api/quantity-units'),
        fetch('/api/locations'),
      ])

      if (!productsRes.ok) throw new Error('Failed to fetch products')
      if (!stockRes.ok) throw new Error('Failed to fetch stock levels')
      if (!unitsRes.ok) throw new Error('Failed to fetch quantity units')
      if (!locationsRes.ok) throw new Error('Failed to fetch locations')

      const [productsData, stockData, unitsData, locationsData] = await Promise.all([
        productsRes.json(),
        stockRes.json(),
        unitsRes.json(),
        locationsRes.json(),
      ])

      setProducts(productsData)

      const stockMap = {}
      stockData.forEach(item => {
        stockMap[String(item.product_id)] = parseFloat(item.amount)
      })
      setStock(stockMap)

      const unitsMap = {}
      unitsData.forEach(unit => {
        unitsMap[String(unit.id)] = unit.name
      })
      setUnits(unitsMap)

      const locationsMap = {}
      locationsData.forEach(loc => {
        locationsMap[String(loc.id)] = loc.name
      })
      setLocations(locationsMap)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleStockUpdate = async (productId, action, quantity) => {
    try {
      const endpoint = action === 'add' ? '/api/stock/add' : '/api/stock/remove'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          quantity: parseFloat(quantity),
        }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || `Failed to ${action} stock`)
      }
      showToast(action === 'add' ? '✓ Added!' : '✓ Got it!')
      await fetchData()
    } catch (err) {
      showToast(err.message, 'error')
      setError(err.message)
    }
  }

  const clearNfc = () => {
    window.history.replaceState(null, '', window.location.pathname)
  }

  // NFC: single product grab view
  const nfcProduct = nfcProductId
    ? products.find(p => String(p.id) === String(nfcProductId))
    : null

  if (nfcProductId && !loading) {
    return (
      <div className="app">
        <header>
          <h1>🛒 Grocy Games</h1>
          <Health />
        </header>
        <main>
          {error && <div className="error">{error}</div>}
          {nfcProduct ? (
            <GrabView
              product={nfcProduct}
              qty={stock[String(nfcProduct.id)] ?? 0}
              unit={units[String(nfcProduct.quantity_unit_id)] || ''}
              onGrab={handleStockUpdate}
              onBack={clearNfc}
            />
          ) : (
            <div className="error">
              Product not found.{' '}
              <button className="link-btn" onClick={clearNfc}>Go back</button>
            </div>
          )}
        </main>
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      </div>
    )
  }

  // NFC: location-filtered grid
  const locationProducts = nfcLocationId
    ? products.filter(p => String(p.location_id) === String(nfcLocationId))
    : null
  const locationName = nfcLocationId ? locations[String(nfcLocationId)] : null

  if (nfcLocationId && !loading) {
    return (
      <div className="app">
        <header>
          <h1>{locationName ? `📍 ${locationName}` : '🛒 Grocy Games'}</h1>
          <Health />
        </header>
        <main>
          {error && <div className="error">{error}</div>}
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <ProductList
                products={locationProducts}
                stock={stock}
                units={units}
                onStockUpdate={handleStockUpdate}
              />
              <div className="restock-panel">
                <button className="restock-toggle" onClick={clearNfc}>
                  ← All Items
                </button>
              </div>
            </>
          )}
        </main>
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      </div>
    )
  }

  // Default: full grid
  return (
    <div className="app">
      <header>
        <h1>🛒 Grocy Games</h1>
        <Health />
      </header>

      <main>
        {error && <div className="error">{error}</div>}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ProductList
            products={products}
            stock={stock}
            units={units}
            onStockUpdate={handleStockUpdate}
          />
        )}

        <div className="restock-panel">
          <button
            className="restock-toggle"
            onClick={() => setShowRestock(v => !v)}
          >
            {showRestock ? '▲ Hide Restock' : '⚙ Restock Items'}
          </button>
          {showRestock && (
            <div className="restock-form">
              <StockForm products={products} onSubmit={handleStockUpdate} />
            </div>
          )}
        </div>
      </main>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  )
}

export default App
