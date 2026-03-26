import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, cartTotal } = useCart();

  return (
    <section className="page-section">
      <div className="container py-8">
        <h2 className="section-title">Your Order</h2>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart" style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                Your cart is empty. <br/><br/>
                <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Browse materials</Link>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={item.id} className="cart-item">
                  <div>
                    <h4>{item.product.name}</h4>
                    <small className="text-muted">
                      {item.width} {item.unit} x {item.height} {item.unit} ({item.sqft} sqft)
                    </small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>₹{item.total}</div>
                    <button 
                      onClick={() => removeFromCart(index)} 
                      style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="cart-summary card">
              <h3>Order Summary</h3>
              <div className="summary-row" style={{ marginTop: '1rem' }}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn-primary full-width" onClick={() => alert('Checkout flow coming soon!')}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}