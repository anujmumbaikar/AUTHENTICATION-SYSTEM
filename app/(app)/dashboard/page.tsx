'use client';
import React from 'react';
import { Settings, Shield, Users, Key, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
function Dashboard() {
    const router = useRouter();

  const onClick = () => {
    router.push('/settings');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">AuthFlow</h1>
            </div>
            <div>
              <button onClick={onClick} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
            <Button variant='destructive' onClick={() => signOut({ callbackUrl: '/' })} className="ml-4">
              Sign Out
            </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Made Simple
          </h2>
          <p className="text-lg text-gray-600">
            Secure, scalable, and developer-friendly authentication solutions
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-600">
              Industry-standard security with multi-factor authentication and encryption
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              User Management
            </h3>
            <p className="text-gray-600">
              Complete user lifecycle management with role-based access control
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Key className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              API Keys & Tokens
            </h3>
            <p className="text-gray-600">
              Manage API keys, JWT tokens, and session handling seamlessly
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Real-time Analytics
            </h3>
            <p className="text-gray-600">
              Monitor login attempts, user activity, and security events
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;