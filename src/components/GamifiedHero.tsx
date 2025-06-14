
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Zap, Target, BookOpen, Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import ProgressBar from '@/components/gamification/ProgressBar';
import LevelUpAnimation from '@/components/gamification/LevelUpAnimation';

const GamifiedHero = () => {
  const { userStats, isLevelingUp, trackAction } = useGamification();
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    });
  }, [controls]);

  const floatingElements = [
    { icon: Sparkles, delay: 0, x: 100, y: 50 },
    { icon: Zap, delay: 0.5, x: -80, y: 80 },
    { icon: Target, delay: 1, x: 120, y: -40 },
    { icon: BookOpen, delay: 1.5, x: -100, y: -60 },
    { icon: Trophy, delay: 2, x: 80, y: 100 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 overflow-hidden">
      <LevelUpAnimation isVisible={isLevelingUp} newLevel={userStats.level} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3], 
              scale: [0.8, 1.2, 0.8],
              x: element.x,
              y: element.y
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: element.delay,
              ease: "easeInOut"
            }}
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <element.icon className="w-8 h-8 text-primary/30" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center max-w-5xl mx-auto relative z-10">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="glass-panel p-4 rounded-xl max-w-md mx-auto">
            <ProgressBar 
              current={userStats.xp} 
              max={userStats.xp + userStats.xpToNextLevel} 
              level={userStats.level}
            />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center glass px-4 py-2 rounded-full text-sm text-muted-foreground mb-8 group hover:scale-105 transition-transform cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-2 h-2 bg-primary rounded-full mr-2"
          />
          <Sparkles className="w-4 h-4 mr-2 text-primary" />
          Level {userStats.level} • {userStats.rank} • {userStats.totalXp} XP
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight"
        >
          Your{' '}
          <motion.span
            className="text-primary text-glow relative inline-block"
            animate={controls}
          >
            AI-Powered
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.span>
          <br />
          Career Quest
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto"
        >
          🎮 <strong>Level up</strong> your skills • 🏆 <strong>Unlock</strong> achievements • ⚡ <strong>Master</strong> AI tools
          <br className="hidden sm:block" />
          <span className="text-base sm:text-lg block sm:inline mt-2 sm:mt-0">
            Transform learning into an epic adventure with rewards, progress tracking, and gamified growth!
          </span>
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="btn-primary w-full sm:w-auto text-lg px-8 py-4 min-h-[56px] relative overflow-hidden group"
              onClick={() => trackAction('daily_visit')}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <Zap className="w-5 h-5 mr-2" />
              Start Your Quest
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2"
              >
                🚀
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="btn-glass w-full sm:w-auto text-lg px-8 py-4 min-h-[56px] group"
            >
              <Trophy className="w-5 h-5 mr-2 group-hover:text-yellow-400 transition-colors" />
              View Achievements
            </Button>
          </motion.div>
        </motion.div>

        {/* Achievement Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-panel p-6 rounded-xl max-w-2xl mx-auto mb-12"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{userStats.articlesRead}</div>
              <div className="text-sm text-muted-foreground">Articles Read</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{userStats.achievementsUnlocked}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{userStats.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
          >
            <ArrowDown className="w-6 h-6 mx-auto text-muted-foreground" />
            <span className="sr-only">Scroll down to see more content</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GamifiedHero;
