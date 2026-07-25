import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:8000'; // Since this runs on your laptop, localhost works fine here

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Refresh every 10 seconds to simulate real-time updates
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data.reverse()); // newest first
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders(); // refresh list
    } catch (err) {
      console.error('Failed to update status:', err);
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
        <p>Live incoming orders</p>
      </header>

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
                  <button
                    className="status-btn"
                    onClick={() => updateStatus(order.order_id, 'preparing')}
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    className="status-btn"
                    onClick={() => updateStatus(order.order_id, 'ready')}
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    className="status-btn"
                    onClick={() => updateStatus(order.order_id, 'completed')}
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;