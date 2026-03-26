import Profile from './pages/Profile';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, Save, X, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    company: profile?.company || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await updateProfile(form);
      setMessage('Profile updated successfully! ✅');
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
    });
    setEditing(false);
    setError('');
  };

  const handlePasswordReset = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      if (error) throw error;
      setMessage('Password updated successfully! ✅');
      setShowPasswordForm(false);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="container py-8" style={{ maxWidth: '600px' }}>
      <h2 className="section-title">My Profile</h2>

      {/* Success/Error Messages */}
      {message && (
        <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {(profile?.full_name || user.email)?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{profile?.full_name || 'Your Name'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{profile?.company || 'Company'}</p>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Full Name */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              disabled={!editing}
              style={{ background: editing ? 'white' : '#f8fafc' }}
              placeholder="Your full name"
            />
          </div>

          {/* Email (read only) */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Email cannot be changed</small>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} /> Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              disabled={!editing}
              style={{ background: editing ? 'white' : '#f8fafc' }}
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Company */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏢 Company Name
            </label>
            <input
              type="text"
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              disabled={!editing}
              style={{ background: editing ? 'white' : '#f8fafc' }}
              placeholder="Your company"
            />
          </div>

          {/* Action Buttons */}
          {!editing ? (
            <button
              className="btn-primary"
              onClick={() => setEditing(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', border: '1px solid var(--border)', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
              >
                <X size={16} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reset Password Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} /> Reset Password
          </h3>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              style={{ background: '#fef9c3', border: '1px solid #fde047', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', color: '#854d0e' }}
            >
              🔑 Change Password
            </button>
          ) : (
            <div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Min 6 characters"
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" onClick={handlePasswordReset} disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  onClick={() => { setShowPasswordForm(false); setPasswordForm({ newPassword: '', confirmPassword: '' }); }}
                  style={{ background: '#f1f5f9', border: '1px solid var(--border)', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', color: '#dc2626' }}
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}