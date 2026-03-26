import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cart } = useCart();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo">P</div>
          <h1>PrintVaan</h1>
        </Link>

        <nav className="nav-center">
          <Link to="/" className="nav-btn" style={{ textDecoration: 'none' }}>Home</Link>
          {!user && <Link to="/login" className="nav-btn" style={{ textDecoration: 'none' }}>Dealer Login</Link>}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && profile && (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              👋 {profile.name}
            </span>
          )}
          {user && (
            <>
              <Link to="/profile" className="nav-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={18} /> Profile
              </Link>
              <button onClick={handleLogout} className="btn-text" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
          <Link to="/cart" className="cart-btn" style={{ textDecoration: 'none' }}>
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}