import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Somil Yadav',
    email: 'somil@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    joinDate: 'January 2024',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  });

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={userInfo.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-cadbury-200 dark:border-cadbury-700"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-2 right-2 bg-cadbury-500 text-white p-2 rounded-full shadow-lg hover:bg-cadbury-600 transition-colors duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                  </motion.button>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {userInfo.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Developer
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="bg-cadbury-500 hover:bg-cadbury-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  <span>{isEditing ? 'Save' : 'Edit'}</span>
                </motion.button>
              </div>

              <div className="space-y-6">
                {[
                  { icon: User, label: 'Full Name', field: 'name', value: userInfo.name, editable: true },
                  { icon: Mail, label: 'Email', field: 'email', value: userInfo.email, editable: true },
                  { icon: Phone, label: 'Phone', field: 'phone', value: userInfo.phone, editable: true },
                  { icon: MapPin, label: 'Location', field: 'location', value: userInfo.location, editable: true },
                  { icon: Calendar, label: 'Member Since', field: 'joinDate', value: userInfo.joinDate, editable: false },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="bg-cadbury-100 dark:bg-cadbury-900 p-2 rounded-full">
                        <Icon className="h-5 w-5 text-cadbury-600 dark:text-cadbury-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {item.label}
                        </p>
                        {isEditing && item.editable ? (
                          <input
                            type={item.field === 'email' ? 'email' : 'text'}
                            value={item.value}
                            onChange={(e) => handleInputChange(item.field, e.target.value)}
                            className="mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cadbury-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Theme Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={theme === 'dark' ? toggleTheme : undefined}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === 'light'
                    ? 'border-cadbury-500 bg-cadbury-50 dark:bg-cadbury-900'
                    : 'border-gray-300 dark:border-gray-600 hover:border-cadbury-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-cadbury-500' : 'bg-gray-400'}`}>
                    <Sun className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Light Mode 🌞</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Clean and bright interface</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={theme === 'light' ? toggleTheme : undefined}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-cadbury-500 bg-cadbury-50 dark:bg-cadbury-900'
                    : 'border-gray-300 dark:border-gray-600 hover:border-cadbury-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-cadbury-500' : 'bg-gray-400'}`}>
                    <Moon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Dark Mode 🌙</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Easy on the eyes</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Additional Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Account Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Change Password',
                'Privacy Settings',
                'Notification Preferences',
                'Two-Factor Authentication',
                'Connected Accounts',
                'Delete Account',
              ].map((setting) => (
                <motion.button
                  key={setting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                >
                  {setting}
                </motion.button>
              ))}
              
              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left p-4 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
