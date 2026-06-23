import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GROCY_URL = (process.env.GROCY_URL || 'http://localhost:81').replace(/\/api\/?$/, '');
const GROCY_API_TOKEN = process.env.GROCY_API_TOKEN || '';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

const grocyHeaders = {
  'GROCY-API-KEY': GROCY_API_TOKEN,
  'Content-Type': 'application/json',
};

// Health check — actually pings the Grocy API
app.get('/api/health', async (req, res) => {
  try {
    const response = await fetch(`${GROCY_URL}/api/system/info`, {
      headers: grocyHeaders,
    });
    if (!response.ok) throw new Error(`Grocy returned ${response.status}`);
    res.json({ status: 'ok', grocy: GROCY_URL });
  } catch (error) {
    res.status(503).json({ status: 'error', error: error.message, grocy: GROCY_URL });
  }
});

// Get all products (catalog)
app.get('/api/products', async (req, res) => {
  try {
    const response = await fetch(`${GROCY_URL}/api/objects/products`, {
      headers: grocyHeaders,
    });
    if (!response.ok) throw new Error(`Grocy API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });

  try {
    const response = await fetch(`${GROCY_URL}/api/objects/products/${id}`, {
      headers: grocyHeaders,
    });
    if (!response.ok) throw new Error(`Grocy API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get locations
app.get('/api/locations', async (req, res) => {
  try {
    const response = await fetch(`${GROCY_URL}/api/objects/locations`, {
      headers: grocyHeaders,
    });
    if (!response.ok) throw new Error(`Grocy API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get quantity units
app.get('/api/quantity-units', async (req, res) => {
  try {
    const response = await fetch(`${GROCY_URL}/api/objects/quantity_units`, {
      headers: grocyHeaders,
    });
    if (!response.ok) throw new Error(`Grocy API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching quantity units:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current stock levels
app.get('/api/stock', async (req, res) => {
  try {
    const response = await fetch(`${GROCY_URL}/api/stock`, {
      headers: grocyHeaders,
    });
    if (!response.ok) throw new Error(`Grocy API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add product to stock
app.post('/api/stock/add', async (req, res) => {
  const product_id = parseInt(req.body.product_id, 10);
  const quantity = parseFloat(req.body.quantity);

  if (isNaN(product_id) || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'Valid product_id and positive quantity required' });
  }

  try {
    const response = await fetch(`${GROCY_URL}/api/stock/products/${product_id}/add`, {
      method: 'POST',
      headers: grocyHeaders,
      body: JSON.stringify({ amount: quantity }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error_message || `Grocy error ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove product from stock
app.post('/api/stock/remove', async (req, res) => {
  const product_id = parseInt(req.body.product_id, 10);
  const quantity = parseFloat(req.body.quantity);

  if (isNaN(product_id) || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'Valid product_id and positive quantity required' });
  }

  try {
    const response = await fetch(`${GROCY_URL}/api/stock/products/${product_id}/consume`, {
      method: 'POST',
      headers: grocyHeaders,
      body: JSON.stringify({ amount: quantity }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error_message || `Grocy error ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error removing stock:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Grocy API: ${GROCY_URL}`);
});
