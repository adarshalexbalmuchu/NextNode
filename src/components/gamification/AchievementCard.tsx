
import { motion } from 'framer-motion';
import { Achievement } from '@/hooks/useGamification';
import { Badge } from '@/components/ui/badge';
import { Check, Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const rarityColors = {
  common: 'border-gray-400 bg-gray-50/10',
  rare: 'border-blue-400 bg-blue-50/10',
  epic: 'border-purple-400 bg-purple-50/10',
  legendary: 'border-yellow-400 bg-yellow-50/10'
};

const rarityGlows = {
  common: 'shadow-gray-400/20',
  rare: 'shadow-blue-400/30',
  epic: 'shadow-purple-400/30',
  legendary: 'shadow-yellow-400/40'
};

const AchievementCard = ({ achievement, index }: AchievementCardProps) => {
  const isUnlocked = !!achievement.unlockedAt;
  const progress = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        ${rarityColors[achievement.rarity]}
        ${isUnlocked ? 'border-opacity-100' : 'border-opacity-30'}
        ${isUnlocked ? rarityGlows[achievement.rarity] : ''}
        hover:scale-105 cursor-pointer group
      `}
    >
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        <Badge 
          variant={isUnlocked ? 'default' : 'secondary'}
          className={`
            text-xs capitalize
            ${achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : ''}
            ${achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-400 to-pink-500' : ''}
            ${achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' : ''}
          `}
        >
          {achievement.rarity}
        </Badge>
      </div>

      {/* Icon */}
      <div className="text-center mb-3">
        <div 
          className={`
            text-4xl mb-2 transition-all duration-300
            ${isUnlocked ? 'filter-none' : 'grayscale opacity-50'}
            group-hover:scale-110
          `}
        >
          {achievement.icon}
        </div>
        
        {isUnlocked ? (
          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center w-6 h-6 bg-muted rounded-full">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className={`font-semibold mb-1 ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {achievement.title}
        </h3>
        <p className={`text-sm mb-3 ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
          {achievement.description}
        </p>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium">
              {achievement.progress}/{achievement.maxProgress}
            </span>
          </div>
          <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              className={`
                h-full rounded-full transition-all duration-300
                ${isUnlocked 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-primary/50 to-accent/50'
                }
              `}
            />
          </div>
        </div>

        {/* XP Reward */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground">Reward:</span>
          <span className={`text-xs font-medium ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>
            +{achievement.xpReward} XP
          </span>
        </div>

        {isUnlocked && achievement.unlockedAt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-xs text-green-500"
          >
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </motion.div>
        )}
      </div>

      {/* Unlock animation overlay */}
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, delay: index * 0.1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent rounded-xl"
        />
      )}
    </motion.div>
  );
};

export default AchievementCard;
