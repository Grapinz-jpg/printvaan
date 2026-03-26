import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="page-section">
      <div className="hero-section">
        <div className="container hero-content">
          <h2>Wholesale Printing Solutions</h2>
          <p>Enter your dimensions below to unlock live dealer pricing.</p>
          <div className="search-wrapper" style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '50px', padding: '0.5rem 1rem' }}>
            <Search color="#64748b" size={20} />
            <input
              type="text"
              className="search-input"
              style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: '0.5rem' }}
              placeholder="Search materials (e.g. Vinyl, Flex)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <h3 className="section-title">Available Materials</h3>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b' }}>
                No products found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}