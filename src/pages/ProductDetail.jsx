import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, TrendingDown } from 'lucide-react';

const RATES = {
  'Flex Normal': { type: 'tiered', ranges: [
    { max: 12, rate: 15 },
    { max: 30, rate: 12 },
    { max: 50, rate: 10 },
    { max: 100, rate: 7.5 },
    { max: Infinity, rate: 7 },
  ]},
  'Star Flex': { type: 'tiered', ranges: [
    { max: 20, rate: 20 },
    { max: Infinity, rate: 18 },
  ]},
  'Vinyl Normal': { type: 'tiered', ranges: [
    { max: 12, rate: 30 },
    { max: Infinity, rate: 25 },
  ]},
  'Vinyl OneWay':     { type: 'fixed', rate: 45 },
  'Vinyl Reflective': { type: 'fixed', rate: 50 },
  'Clear Matte':      { type: 'fixed', rate: 30 },
  'Clear Glossy':     { type: 'fixed', rate: 30 },
};

function getRate(productName, sqft) {
  const config = RATES[productName];
  if (!config) return { rate: 0, isDiscounted: false };

  if (config.type === 'fixed') {
    return { rate: config.rate, isDiscounted: false };
  }

  // Tiered
  for (let i = 0; i < config.ranges.length; i++) {
    if (sqft <= config.ranges[i].max) {
      return { rate: config.ranges[i].rate, isDiscounted: i > 0 };
    }
  }
  return { rate: 0, isDiscounted: false };
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState('ft');

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (data) setProduct(data);
    }
    fetchProduct();
  }, [id]);

  const convertToFeet = (val, u) => {
    const v = parseFloat(val) || 0;
    if (u === 'in') return v / 12;
    if (u === 'cm') return v / 30.48;
    if (u === 'mm') return v / 304.8;
    if (u === 'm') return v * 3.28084;
    return v;
  };

  const wFt = convertToFeet(width, unit);
  const hFt = convertToFeet(height, unit);
  const sqft = parseFloat((wFt * hFt).toFixed(2));

  const { rate, isDiscounted } = product
    ? getRate(product.name, sqft)
    : { rate: 0, isDiscounted: false };

  const total = (sqft * rate).toFixed(2);
  const isValid = sqft > 0;

  const handleAddToCart = () => {
    addToCart({ id: Date.now(), product, width, height, unit, sqft, rate, total });
    navigate('/');
  };

  if (!product) return <div className="container py-8">Loading...</div>;

  const rateConfig = RATES[product.name];

  return (
    <div className="container py-8">
      <button className="btn-text mb-4"
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={20} /> Back to All Materials
      </button>

      <div className="product-detail-layout">

        {/* Left - Image */}
        <div className="product-detail-image">
          <img src={product.img} alt={product.name} />
        </div>

        {/* Right - Calculator Card */}
        <div className="card">
          <div className="product-content">
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{product.name}</h2>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{product.description}</p>

            {/* Pricing Tiers Table */}
            <div style={{ marginBottom: '1.5rem', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ padding: '0.6rem 1rem', background: '#0052cc', color: 'white', fontWeight: '600', fontSize: '0.875rem' }}>
                📊 Pricing Tiers (per sqft)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#eff6ff' }}>
                    <th style={{ padding: '0.5rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Area</th>
                    <th style={{ padding: '0.5rem 1rem', textAlign: 'right', borderBottom: '1px solid var(--border)' }}>Rate/sqft</th>
                  </tr>
                </thead>
                <tbody>
                  {rateConfig?.type === 'tiered' ? (
                    rateConfig.ranges.map((r, i) => (
                      <tr key={i} style={{ background: rate === r.rate && sqft > 0 ? '#f0fdf4' : 'white' }}>
                        <td style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                          {i === 0
                            ? `Up to ${r.max} sqft`
                            : r.max === Infinity
                            ? `${rateConfig.ranges[i-1].max}+ sqft (Bulk)`
                            : `${rateConfig.ranges[i-1].max + 1} – ${r.max} sqft`}
                          {rate === r.rate && sqft > 0 && (
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: '#16a34a', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '99px' }}>
                              ✓ Active
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: '700',
                          color: r.max === Infinity ? '#16a34a' : '#0052cc',
                          borderBottom: '1px solid #f1f5f9' }}>
                          ₹{r.rate}
                          {r.max === Infinity && ' 🏷️'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ padding: '0.5rem 1rem' }}>All sizes</td>
                      <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: '700', color: '#0052cc' }}>
                        ₹{rateConfig?.rate}/sqft
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculator Inputs */}
            <div className="product-inputs">
              <div className="input-group">
                <label>Width</label>
                <input type="number" value={width}
                  onChange={e => setWidth(e.target.value)} placeholder="0" min="0" />
              </div>
              <div className="input-group">
                <label>Height</label>
                <input type="number" value={height}
                  onChange={e => setHeight(e.target.value)} placeholder="0" min="0" />
              </div>
              <div className="input-group">
                <label>Unit</label>
                <select value={unit} onChange={e => setUnit(e.target.value)}>
                  <option value="ft">ft</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>

            {/* Calculated Area */}
            <div className="sqft-view">
              <span>Calculated Area:</span>
              <span className="sqft-value">{sqft} sqft</span>
            </div>

            {/* Rate */}
            <div className="rate-display">
              <span>Rate:</span>
              <span className={`rate-value ${isDiscounted ? 'discounted' : ''}`}>
                ₹{rate}/sqft
              </span>
            </div>

            {/* Bulk Badge */}
            {isDiscounted && (
              <div className="bulk-badge">
                <TrendingDown size={16} /> Bulk Price Applied!
              </div>
            )}
          </div>

          {/* Footer - Total + Add to Cart */}
          <div className="product-footer">
            <div className="price-row">
              <span className="product-desc">{sqft} sqft × ₹{rate}</span>
              <span className="total-price">₹{total}</span>
            </div>
            <button
              className="btn-add"
              disabled={!isValid}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} /> Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}