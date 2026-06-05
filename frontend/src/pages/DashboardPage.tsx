import { useEffect, useState } from 'react';
import { getRole } from '../services/tokenService';

type UserRole = 'admin' | 'creator' | 'viewer';

const DashboardPage = () => {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const currentRole = getRole() as UserRole | null;
    setRole(currentRole);
    console.log('DashboardPage: Current role =', currentRole);
  }, []);

  const getDashboardTitle = () => {
    switch (role) {
      case 'admin':
        return 'Welcome Admin Dashboard';
      case 'creator':
        return 'Welcome Creator Dashboard';
      case 'viewer':
        return 'Welcome Viewer Dashboard';
      default:
        return 'Loading Dashboard...';
    }
  };

  const getDashboardDescription = () => {
    switch (role) {
      case 'admin':
        return 'Manage users, channels, and videos. Monitor all platform activities.';
      case 'creator':
        return 'Create and manage your channels and videos.';
      case 'viewer':
        return 'Explore and watch videos from your favorite channels.';
      default:
        return 'Dashboard overview';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'admin':
        return 'from-purple-50 to-purple-100 text-purple-700 text-purple-900';
      case 'creator':
        return 'from-blue-50 to-blue-100 text-blue-700 text-blue-900';
      case 'viewer':
        return 'from-green-50 to-green-100 text-green-700 text-green-900';
      default:
        return 'from-slate-50 to-slate-100 text-slate-700 text-slate-900';
    }
  };

  const colors = getRoleColor().split(' ');

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{getDashboardTitle()}</h1>
            <p className="mt-2 text-slate-600">{getDashboardDescription()}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`rounded-2xl bg-gradient-to-br ${colors[0]} ${colors[1]} p-6 ring-1 ${colors[2]}`}>
            <p className={`text-sm font-medium ${colors[2]}`}>Current Role</p>
            <p className={`mt-2 text-2xl font-bold ${colors[3]} capitalize`}>{role || 'Loading...'}</p>
          </div>
          
         
        </div>

        {role === 'admin' && (
          <div className="mt-8 rounded-2xl bg-purple-50 p-6 ring-1 ring-purple-200">
            <h3 className="text-lg font-semibold text-purple-900">Admin Features</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li className="flex items-center gap-2 text-purple-700">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Manage Users
              </li>
              <li className="flex items-center gap-2 text-purple-700">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Manage Channels
              </li>
              <li className="flex items-center gap-2 text-purple-700">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Manage Videos
              </li>
              <li className="flex items-center gap-2 text-purple-700">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Monitor Activities
              </li>
            </ul>
          </div>
        )}

        {role === 'creator' && (
          <div className="mt-8 rounded-2xl bg-blue-50 p-6 ring-1 ring-blue-200">
            <h3 className="text-lg font-semibold text-blue-900">Creator Features</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li className="flex items-center gap-2 text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Create Channels
              </li>
              <li className="flex items-center gap-2 text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Upload Videos
              </li>
              <li className="flex items-center gap-2 text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Manage Content
              </li>
              <li className="flex items-center gap-2 text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                View Analytics
              </li>
            </ul>
          </div>
        )}

        {role === 'viewer' && (
          <div className="mt-8 rounded-2xl bg-green-50 p-6 ring-1 ring-green-200">
            <h3 className="text-lg font-semibold text-green-900">Viewer Features</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li className="flex items-center gap-2 text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Browse Videos
              </li>
              <li className="flex items-center gap-2 text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Watch Content
              </li>
              <li className="flex items-center gap-2 text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Subscribe to Channels
              </li>
              <li className="flex items-center gap-2 text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                View Public Content
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
