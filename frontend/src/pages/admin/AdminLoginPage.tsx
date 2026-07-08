import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Heading from '../../components/ui/Heading';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login/`, {
        email,
        password,
      });

      if (data.access) {
        // Assume super_admin role for simplicity based on the successful login
        // Real implementation would decode the JWT or fetch /api/auth/me/
        login(data.access, 'super_admin');
        navigate('/admin/dashboard', { replace: true });
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'An error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <Logo className="h-10 mx-auto" />
          </div>
          <Heading variant="h2" className="text-2xl font-bold tracking-tight text-primary-text mb-2">
            Administrator Login
          </Heading>
          <Text variant="small" className="text-secondary-text">
            Sign in to access the Enterprise Analytics Dashboard.
          </Text>
        </div>

        <div className="bg-surface-light border border-border-primary rounded-xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary-text block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-secondary-text" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-primary-bg border border-border-primary text-primary-text rounded-md pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
                  placeholder="admin@infinyttech.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary-text block">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-secondary-text" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-primary-bg border border-border-primary text-primary-text rounded-md pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-secondary-text hover:text-primary-text transition-colors"
          >
            ← Return to Website
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
