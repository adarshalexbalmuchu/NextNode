
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  articlesRead: number;
  toolsUsed: number;
  achievementsUnlocked: number;
  rank: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_read',
    title: 'Getting Started',
    description: 'Read your first article',
    icon: '🎯',
    progress: 0,
    maxProgress: 1,
    rarity: 'common',
    xpReward: 50
  },
  {
    id: 'tool_master',
    title: 'Tool Master',
    description: 'Use 5 different AI tools',
    icon: '🛠️',
    progress: 0,
    maxProgress: 5,
    rarity: 'rare',
    xpReward: 200
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    progress: 0,
    maxProgress: 7,
    rarity: 'epic',
    xpReward: 500
  },
  {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Read 25 articles',
    icon: '📚',
    progress: 0,
    maxProgress: 25,
    rarity: 'legendary',
    xpReward: 1000
  }
];

export const useGamification = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0,
    streak: 0,
    articlesRead: 0,
    toolsUsed: 0,
    achievementsUnlocked: 0,
    rank: 'Novice'
  });

  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('nextnode-user-stats');
    const savedAchievements = localStorage.getItem('nextnode-achievements');
    
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('nextnode-user-stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('nextnode-achievements', JSON.stringify(achievements));
  }, [achievements]);

  const calculateLevel = (totalXp: number) => {
    return Math.floor(totalXp / 100) + 1;
  };

  const calculateXpToNextLevel = (totalXp: number) => {
    const currentLevel = calculateLevel(totalXp);
    const xpForNextLevel = currentLevel * 100;
    return xpForNextLevel - totalXp;
  };

  const getRank = (level: number) => {
    if (level >= 50) return 'Legend';
    if (level >= 30) return 'Master';
    if (level >= 20) return 'Expert';
    if (level >= 10) return 'Advanced';
    if (level >= 5) return 'Intermediate';
    return 'Novice';
  };

  const addXp = useCallback((amount: number, reason: string) => {
    setUserStats(prev => {
      const newTotalXp = prev.totalXp + amount;
      const newLevel = calculateLevel(newTotalXp);
      const wasLevelUp = newLevel > prev.level;
      
      if (wasLevelUp) {
        setIsLevelingUp(true);
        setTimeout(() => setIsLevelingUp(false), 3000);
        
        toast({
          title: `🎉 Level Up! Level ${newLevel}`,
          description: `You earned ${amount} XP for ${reason}!`,
          duration: 5000,
        });
      } else {
        toast({
          title: `+${amount} XP`,
          description: reason,
          duration: 2000,
        });
      }

      return {
        ...prev,
        xp: prev.xp + amount,
        totalXp: newTotalXp,
        level: newLevel,
        xpToNextLevel: calculateXpToNextLevel(newTotalXp),
        rank: getRank(newLevel)
      };
    });
  }, []);

  const checkAchievements = useCallback((type: string, progress?: number) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.unlockedAt) return achievement;

        let shouldUpdate = false;
        let newProgress = achievement.progress;

        switch (achievement.id) {
          case 'first_read':
            if (type === 'article_read') {
              newProgress = 1;
              shouldUpdate = true;
            }
            break;
          case 'tool_master':
            if (type === 'tool_used') {
              newProgress = Math.min(achievement.maxProgress, userStats.toolsUsed + 1);
              shouldUpdate = newProgress > achievement.progress;
            }
            break;
          case 'streak_warrior':
            if (type === 'streak_update') {
              newProgress = Math.min(achievement.maxProgress, progress || 0);
              shouldUpdate = newProgress > achievement.progress;
            }
            break;
          case 'knowledge_seeker':
            if (type === 'article_read') {
              newProgress = Math.min(achievement.maxProgress, userStats.articlesRead + 1);
              shouldUpdate = newProgress > achievement.progress;
            }
            break;
        }

        if (shouldUpdate) {
          const isUnlocked = newProgress >= achievement.maxProgress;
          
          if (isUnlocked && !achievement.unlockedAt) {
            addXp(achievement.xpReward, `Achievement: ${achievement.title}`);
            
            toast({
              title: `🏆 Achievement Unlocked!`,
              description: `${achievement.icon} ${achievement.title} - ${achievement.description}`,
              duration: 5000,
            });

            setUserStats(prev => ({
              ...prev,
              achievementsUnlocked: prev.achievementsUnlocked + 1
            }));

            return {
              ...achievement,
              progress: newProgress,
              unlockedAt: new Date()
            };
          }

          return {
            ...achievement,
            progress: newProgress
          };
        }

        return achievement;
      });

      return updated;
    });
  }, [addXp, userStats]);

  const trackAction = useCallback((action: string, data?: any) => {
    switch (action) {
      case 'article_read':
        setUserStats(prev => ({ ...prev, articlesRead: prev.articlesRead + 1 }));
        addXp(25, 'Reading an article');
        checkAchievements('article_read');
        break;
      
      case 'tool_used':
        setUserStats(prev => ({ ...prev, toolsUsed: prev.toolsUsed + 1 }));
        addXp(50, `Using ${data?.toolName || 'AI tool'}`);
        checkAchievements('tool_used');
        break;
      
      case 'daily_visit':
        setUserStats(prev => ({ ...prev, streak: prev.streak + 1 }));
        addXp(10, 'Daily visit');
        checkAchievements('streak_update', userStats.streak + 1);
        break;
    }
  }, [addXp, checkAchievements, userStats.streak]);

  return {
    userStats,
    achievements,
    isLevelingUp,
    addXp,
    trackAction,
    checkAchievements
  };
};
