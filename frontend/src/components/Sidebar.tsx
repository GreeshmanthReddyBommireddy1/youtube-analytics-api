import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getRole } from '../services/tokenService';

type UserRole = 'admin' | 'creator' | 'viewer';

interface SidebarProps {
  onLogout: () => void;
}

interface NavItem {
  label: string;
  path: string;
}

const Sidebar = ({ onLogout }: SidebarProps) => {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const currentRole = getRole() as UserRole | null;
    setRole(currentRole);
    console.log('Sidebar: Current role =', currentRole);
  }, []);

 
  const getNavItems = (): NavItem[] => {
  const baseItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' }
  ];

  switch (role) {
    case 'admin':
      return [
        ...baseItems,
        { label: 'Users', path: '/users' },
        { label: 'Channels', path: '/channels' },
        { label: 'Videos', path: '/videos' },
        { label: 'Change Password', path: '/change-password' },
      ];

    case 'creator':
      return [
        ...baseItems,
        { label: 'Channels', path: '/channels' },
        { label: 'Videos', path: '/videos' },
        { label: 'Change Password', path: '/change-password' },
      ];

    case 'viewer':
      return [
        ...baseItems,
        { label: 'Channels', path: '/channels' },
        { label: 'Videos', path: '/videos' },
        { label: 'Change Password', path: '/change-password' },
      ];

    default:
      return baseItems;
  }
};

  const navItems = getNavItems();

  return (
    <aside className="hidden w-72 flex-col bg-slate-900 text-slate-100 py-8 px-6 md:flex">
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] text-slate-400">YT ANALYTICS</p>
        <p className="mt-2 text-xs text-slate-500">Role: <span className="text-slate-300 capitalize">{role || 'Loading...'}</span></p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto rounded-2xl bg-rose-500 px-4 py-3 font-medium text-white transition hover:bg-rose-600"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
