//app/dashboard/page.tsx

'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import useAuthStore from '@/lib/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user');
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute roles={['admin', 'customer']}>
      <DashboardPage />
    </ProtectedRoute>
  );
}
