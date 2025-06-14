
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  max: number;
  level: number;
  showLevel?: boolean;
  className?: string;
}

const ProgressBar = ({ current, max, level, showLevel = true, className = '' }: ProgressBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={`relative ${className}`}>
      {showLevel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Level {level}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {current}/{max} XP
          </span>
        </div>
      )}
      
      <div className="relative w-full h-3 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
        >
          {/* Animated shine effect */}
          <motion.div
            animate={{ x: ['0%', '100%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: 1
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
        
        {/* Pulse effect when near completion */}
        {percentage > 90 && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
