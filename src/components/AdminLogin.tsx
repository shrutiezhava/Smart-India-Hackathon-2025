import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Eye, EyeOff, Lock, Zap } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'democracy123' || password === 'admin') {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      onLogin();
    } else {
      setAttempts(prev => prev + 1);
      setPassword('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 size-2 bg-white rounded-full opacity-60"
          animate={{ 
            scale: [1, 2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 size-1 bg-white rounded-full opacity-40"
          animate={{ 
            scale: [1, 3, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 size-1.5 bg-white rounded-full opacity-50"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main Login Interface */}
      <AnimatePresence mode="wait">
        {!isLoading ? (
          <motion.div
            key="login-form"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center"
          >
            <motion.div
              className="mb-8"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Lock className="size-16 text-white mx-auto mb-4" />
            </motion.div>

            <motion.h1 
              className="text-4xl text-white mb-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Access Control Room
            </motion.h1>
            
            <p className="text-gray-400 mb-8">
              Democracy's nerve center awaits your credentials
            </p>

            {attempts > 0 && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="mb-4 text-red-400 text-sm"
              >
                {attempts === 1 && "Nice try. Democracy isn't that easy."}
                {attempts === 2 && "Still not it. The system is watching."}
                {attempts >= 3 && "Persistent, aren't we? Try 'democracy123' or 'admin'"}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 blur-sm"
                  animate={{ 
                    scale: [1, 1.02, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="relative flex">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the sacred password..."
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 h-14 text-lg pl-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </Button>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  disabled={!password}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  <Zap className="size-5 mr-2" />
                  Unlock Dashboard
                </Button>
              </motion.div>
            </form>

            <motion.p 
              className="text-gray-600 text-sm mt-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Hint: It's either 'democracy123' or 'admin'
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="loading-burst"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <motion.div
              className="size-32 mx-auto mb-6 border-4 border-white rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.h2
              className="text-2xl mb-2"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Unlocking Control Room...
            </motion.h2>
            
            <motion.p
              className="text-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Democracy is booting up
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dramatic Grid Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-white/20"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: (i % 20) * 0.1 + Math.floor(i / 20) * 0.05
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}