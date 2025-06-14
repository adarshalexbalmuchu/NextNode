
import { motion } from 'framer-motion';
import { UserStats } from '@/hooks/useGamification';
import { Trophy, Target, Flame, BookOpen, Wrench, Award } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface StatsDisplayProps {
  stats: UserStats;
  compact?: boolean;
}

const StatsDisplay = ({ stats, compact = false }: StatsDisplayProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Lv.{stats.level}</span>
        </div>
        <div className="flex-1 min-w-[100px]">
          <ProgressBar 
            current={stats.xp} 
            max={stats.xp + stats.xpToNextLevel} 
            level={stats.level}
            showLevel={false}
          />
        </div>
      </div>
    );
  }

  const statItems = [
    { icon: Target, label: 'Articles Read', value: stats.articlesRead, color: 'text-blue-400' },
    { icon: Wrench, label: 'Tools Used', value: stats.toolsUsed, color: 'text-green-400' },
    { icon: Flame, label: 'Current Streak', value: `${stats.streak} days`, color: 'text-orange-400' },
    { icon: Award, label: 'Achievements', value: stats.achievementsUnlocked, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Level and Rank */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Level {stats.level}</h3>
            <p className="text-sm text-muted-foreground">{stats.rank}</p>
          </div>
        </motion.div>
        
        <ProgressBar 
          current={stats.xp} 
          max={stats.xp + stats.xpToNextLevel} 
          level={stats.level}
          showLevel={false}
        />
        
        <div className="mt-2 text-sm text-muted-foreground">
          {stats.xpToNextLevel} XP to next level
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-4 rounded-lg text-center hover:scale-105 transition-transform"
          >
            <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
            <div className="text-lg font-bold">{item.value}</div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Total XP */}
      <div className="text-center glass-panel p-3 rounded-lg">
        <div className="text-sm text-muted-foreground">Total Experience</div>
        <div className="text-xl font-bold text-primary">{stats.totalXp.toLocaleString()} XP</div>
      </div>
    </div>
  );
};

export default StatsDisplay;
