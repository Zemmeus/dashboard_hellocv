import React from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';

const TotalCountCard = ({ totalCount }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white card-shadow card-hover"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Ticket className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold">Всего тикетов</h2>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="mb-4"
          >
            <div className="text-5xl font-bold mb-2">
              {totalCount?.toLocaleString() || '0'}
            </div>
            <div className="text-blue-100 text-lg">
              Активных запросов в системе
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Система работает стабильно</span>
          </div>
        </div>
        
        {/* Декоративный элемент */}
        <div className="hidden md:block">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                rotate: [360, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-20 h-20 border-2 border-white/30 rounded-full flex items-center justify-center"
            >
              <Ticket className="w-10 h-10 text-white/70" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TotalCountCard;
