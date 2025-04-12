import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <Home className="w-24 h-24 text-white" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-white"
        >
          Creating your profile...
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1 bg-white/30 mt-4 rounded-full overflow-hidden"
        >
          <div className="h-full w-1/2 bg-white rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}