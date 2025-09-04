import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  User, 
  BookOpen, 
  FileText,
  Calculator 
} from 'lucide-react';

export function Sidebar() {
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Library', href: '/library', icon: BookOpen },
    { name: 'Reports & Export', href: '/reports', icon: FileText },
  ];

  return (
    <motion.div 
      id="tour-step-1"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gradient-to-b from-cadbury-800 to-cadbury-900 dark:from-cadbury-900 dark:to-black text-white w-64 min-h-screen flex flex-col shadow-xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-cadbury-700 dark:border-cadbury-600">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center space-x-3"
        >
          <div className="bg-gold-400 p-2 rounded-lg shadow-lg">
            <Calculator className="h-6 w-6 text-cadbury-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Taxync</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">by Somil Yadav</p>
            <p className="text-cadbury-300 dark:text-cadbury-400 text-sm">Smart Tax Platform</p>
          </div>
        </motion.div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.3 }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gold-400 text-cadbury-900 shadow-lg transform scale-105'
                      : 'text-cadbury-200 dark:text-cadbury-300 hover:bg-cadbury-700 dark:hover:bg-cadbury-800 hover:text-white hover:transform hover:scale-105'
                  }`
                }
              >
                <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>
      
    </motion.div>
  );
}