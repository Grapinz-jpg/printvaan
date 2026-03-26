import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import ThreeBackground from './ThreeBackground';

export default function Layout() {
  return (
    <>
      {/* 3D Background sits behind everything */}
      <ThreeBackground />
      
      {/* Navbar stays at the top */}
      <Navbar />
      
      {/* <Outlet /> is a placeholder where React Router will render your pages (Home, Cart, etc.) */}
      <main id="app" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </main>

      {/* Your original Footer! */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="brand" style={{ color: 'white', marginBottom: '1rem' }}>
                <div className="logo" style={{ background: 'white', color: '#0f172a' }}>P</div>
                <h3>PrintVaan</h3>
              </div>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Premium wholesale printing solutions for dealers and agencies across the region.
              </p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Products</Link></li>
                <li><Link to="/cart">My Cart</Link></li>
                <li><Link to="/login">Dealer Login</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li><a href="#">support@printvaan.com</a></li>
                <li><a href="#">+91 98765 43210</a></li>
                <li><a href="#">Mumbai, India</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} PrintVaan. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}