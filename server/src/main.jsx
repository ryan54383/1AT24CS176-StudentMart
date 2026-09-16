import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')

  const fetchItems = () => {
    fetch('http://localhost:5000/api/items')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('Error fetching items:', err))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then(() => {
        setName('')
        fetchItems()
      })
      .catch((err) => console.error('Error adding item:', err))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>React + Express + MongoDB Lab</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Enter item name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.6rem', width: '250px', marginRight: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.6rem 1rem', cursor: 'pointer' }}>
          Add Item
        </button>
      </form>

      <h2>Saved Items:</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)