import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

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

    setLoading(true)
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
      .finally(() => setLoading(false))
  }

  return (
    <div className="container">
      {/* StudentMart Header */}
      <header className="header">
        <h1>StudentMart</h1>
        <h2>Welcome to StudentMart</h2>
        <p>Your Online Shopping Application</p>
        <div className="student-card">
          Name: Ryan Michael &nbsp;|&nbsp; USN: 1AT24CS176
        </div>
      </header>

      {/* Interactive Form Section */}
      <form onSubmit={handleSubmit} className="item-form">
        <input
          type="text"
          className="item-input"
          placeholder="Enter item name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn-add" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      {/* Dynamic Data Display */}
      <h3 className="items-heading">Saved Items ({items.length})</h3>
      {items.length === 0 ? (
        <p className="empty-state">No items added yet. Type an item above!</p>
      ) : (
        <ul className="items-list">
          {items.map((item) => (
            <li key={item._id} className="item-card">
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App