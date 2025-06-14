
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

interface LevelUpAnimationProps {
  isVisible: boolean;
  newLevel: number;
}

const LevelUpAnimation = ({ isVisible, newLevel }: LevelUpAnimationProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="relative">
            {/* Background glow */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 2 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-radial from-primary/30 to-transparent rounded-full blur-3xl"
            />
            
            {/* Main card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl text-center max-w-sm mx-auto"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-3xl font-bold text-primary mb-2"
              >
                Level Up!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="text-lg text-foreground mb-4"
              >
                You reached Level {newLevel}!
              </motion.p>
              
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 100,
                    y: Math.sin(i * 60 * Math.PI / 180) * 100
                  }}
                  transition={{ 
                    delay: 0.8 + i * 0.1,
                    duration: 1.5,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-4 h-4"
                >
                  {i % 2 === 0 ? (
                    <Star className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Zap className="w-4 h-4 text-primary" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpAnimation;
