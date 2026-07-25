import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
  });

  useEffect(() => {
    fetchOrders();
    fetchMenu();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data.reverse());
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_URL}/menu`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          price: parseFloat(newItem.price),
          image: newItem.image,
        }),
      });
      setNewItem({ name: '', category: '', price: '', image: '' });
      fetchMenu();
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await fetch(`${API_URL}/menu/${id}`, { method: 'DELETE' });
      fetchMenu();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'placed': return '#F59E0B';
      case 'preparing': return '#3B82F6';
      case 'ready': return '#10B981';
      case 'completed': return '#6B7280';
      default: return '#999';
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>QwikQ Vendor Dashboard</h1>
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </button>
        </div>
      </header>

      {activeTab === 'orders' && (
        <>
          {loading ? (
            <p className="loading-text">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="loading-text">No orders yet</p>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <span className="order-id">#{order.order_id}</span>
                    <span
                      className="order-status"
                      style={{ backgroundColor: statusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item-row">
                        <span>{item.item_name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    Total: ₹{order.total_amount}
                  </div>

                  <div className="status-buttons">
                    {order.status === 'placed' && (
                      <button className="status-btn" onClick={() => updateStatus(order.order_id, 'preparing')}>
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button className="status-btn" onClick={() => updateStatus(order.order_id, 'ready')}>
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button className="status-btn" onClick={() => updateStatus(order.order_id, 'completed')}>
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'menu' && (
        <div className="menu-management">
          <form className="add-item-form" onSubmit={addMenuItem}>
            <h3>Add New Menu Item</h3>
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category (e.g. Snacks)"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
            />
            <button type="submit" className="add-btn">Add Item</button>
          </form>

          <div className="menu-list">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item-row">
                <img src={item.image} alt={item.name} className="menu-item-image" />
                <div className="menu-item-details">
                  <span className="menu-item-name">{item.name}</span>
                  <span className="menu-item-category">{item.category}</span>
                </div>
                <span className="menu-item-price">₹{item.price}</span>
                <button className="delete-btn" onClick={() => deleteMenuItem(item.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;