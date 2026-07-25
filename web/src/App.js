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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;