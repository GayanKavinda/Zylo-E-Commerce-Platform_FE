//app/login/page.tsx

'use client';
import { useState } from 'react';
import api from '@/lib/api';
import useAuthStore from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.token);

      // Redirect based on role
      if (res.data.user.role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md border rounded-lg p-6 bg-card">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
  
        {error && <p className="text-red-500 mb-2">{error}</p>}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border p-2 rounded"
          />
  
          <button className="w-full bg-primary text-primary-foreground p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );  
};

export default LoginPage;
