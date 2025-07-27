'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiHome, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <FiHome className="mr-2" /> },
    { name: 'Profile', href: '/admin/profile', icon: <FiUser className="mr-2" /> },
    { name: 'Settings', href: '/admin/settings', icon: <FiSettings className="mr-2" /> },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-800">
                Admin Panel
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-3">
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                  >
                    <FiLogOut className="mr-1" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login?from=/admin"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                <div className="flex items-center">
                  <FiLogOut className="mr-2" />
                  Logout
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
