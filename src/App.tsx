import React, { useState } from 'react';
import { CitizenFeedbackForm } from './components/CitizenFeedbackForm';
import { AdminLogin } from './components/AdminLogin';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { Button } from './components/ui/button';
import { motion } from 'motion/react';

type View = 'citizen' | 'admin-login' | 'dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('citizen');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Header */}
      <motion.header 
        className="relative z-10 p-6 flex justify-between items-center backdrop-blur-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div 
            className="size-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <h1 className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            PulseGov
          </h1>
          <motion.span 
            className="text-sm bg-yellow-200 px-2 py-1 rounded-full border border-yellow-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            BETA → Democracy 2.0
          </motion.span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={currentView === 'citizen' ? 'default' : 'outline'}
            onClick={() => setCurrentView('citizen')}
            className="hover:scale-105 transition-transform"
          >
            Citizen Portal
          </Button>
          <Button
            variant={currentView === 'admin-login' || currentView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => {
              if (isLoggedIn) {
                setCurrentView('dashboard');
              } else {
                setCurrentView('admin-login');
              }
            }}
            className="hover:scale-105 transition-transform"
          >
            {isLoggedIn ? 'Dashboard' : 'Admin'}
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative">
        {currentView === 'citizen' && <CitizenFeedbackForm />}
        {currentView === 'admin-login' && <AdminLogin onLogin={handleAdminLogin} />}
        {currentView === 'dashboard' && isLoggedIn && <GovernmentDashboard />}
      </main>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 size-32 bg-orange-200 rounded-full opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 size-48 bg-blue-200 rounded-full opacity-10"
          animate={{ y: [0, 30, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 size-16 bg-red-300 rounded-full opacity-15"
          animate={{ scale: [1, 1.5, 1], rotate: [0, -180, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
    </div>
  );
}