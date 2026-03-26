import { useNavigate } from 'react-router-dom';

const RATES_DISPLAY = {
  'Flex Normal': { price: 'From ₹7 – ₹15', tiered: true },
  'Star Flex': { price: 'From ₹18 – ₹20', tiered: true },
  'Vinyl Normal': { price: 'From ₹25 – ₹30', tiered: true },
  'Vinyl OneWay': { price: '₹45', tiered: false },
  'Vinyl Reflective': { price: '₹50', tiered: false },
  'Clear Matte': { price: '₹30', tiered: false },
  'Clear Glossy': { price: '₹30', tiered: false },
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const rateInfo = RATES_DISPLAY[product.name] || { price: `₹${product.price_per_sqft}`, tiered: false };

  return (
    <div className="card" style={{ cursor: 'pointer' }}>

      {/* Product Image */}
      <div className="product-image" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.img} alt={product.name} />
      </div>

      {/* Product Content */}
      <div className="product-content">
        <div className="product-title">
          <h3>{product.name}</h3>
          <div className="product-desc">{product.description}</div>
        </div>

        {/* Price Badge */}
        <div style={{
          marginTop: '0.75rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
            Price per sqft
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0052cc' }}>
            {rateInfo.price} /sqft
          </span>
        </div>

        {/* Bulk Discount Badge */}
        {rateInfo.tiered && (
          <div style={{
            marginTop: '0.4rem',
            fontSize: '0.75rem',
            color: '#16a34a',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            📉 Bulk discounts available
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className="product-footer">
        <button
          className="btn-primary full-width"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          View Details & Pricing
        </button>
      </div>

    </div>
  );
}