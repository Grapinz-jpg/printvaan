import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name, form.phone, form.company);
      alert('Registration successful! Please check your email to confirm your account.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card" style={{ maxWidth: '500px' }}>
        <h2>Create Dealer Account</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Join PrintVaan as a wholesale dealer.</p>
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" type="text" value={form.name} onChange={handle} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input name="company" type="text" value={form.company} onChange={handle} required placeholder="Print Co." />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required placeholder="dealer@example.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" type="tel" value={form.phone} onChange={handle} required placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} required placeholder="Min. 6 characters" minLength={6} />
          </div>
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          <Link to="/login" style={{ color: 'var(--primary)' }}>Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}