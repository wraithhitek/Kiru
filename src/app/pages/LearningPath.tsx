import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FeatureLayout } from '../components/FeatureLayout';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  Flame,
  CheckCircle2,
  Circle,
  Lock,
  ChevronRight,
  Star
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { ProgressTracker, LearningGoal, LearningPath } from '../utils/progressTracker';

export default function LearningPath() {
  const [streak, setStreak] = useState(0);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState('');

  useEffect(() => {
    // Load data from ProgressTracker
    loadData();

    // Listen for progress updates
    const handleProgressUpdate = () => {
      loadData();
    };

    window.addEventListener('progressUpdated', handleProgressUpdate);
    return () => window.removeEventListener('progressUpdated', handleProgressUpdate);
  }, []);

  const loadData = () => {
    setStreak(ProgressTracker.getStreak());
    setGoals(ProgressTracker.getGoals());
    setLearningPaths(ProgressTracker.getLearningPaths());
    setSelectedPath(ProgressTracker.getSelectedPath());
  };

  const handlePathChange = (pathId: string) => {
    setSelectedPath(pathId);
    ProgressTracker.setSelectedPath(pathId);
  };

  const currentPath = learningPaths.find(p => p.id === selectedPath);
  const overallProgress = currentPath 
    ? Math.round((currentPath.topics.reduce((sum, t) => sum + t.progress, 0) / currentPath.topics.length))
    : 0;

  return (
    <FeatureLayout
      title="Learning Path"
      description="Track your progress and achieve your learning goals"
      icon={<Target className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold">{streak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold">{overallProgress}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-emerald-500" />
              <span className="text-3xl font-bold">
                {currentPath?.topics.filter(t => t.status === 'completed').length || 0}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Topics Completed</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold">
                {currentPath?.topics.reduce((sum, t) => sum + t.completedLessons, 0) || 0}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Lessons Done</p>
          </Card>
        </div>

        {/* Daily/Weekly Goals */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Learning Goals</h3>
          </div>
          
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{goal.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {goal.current} / {goal.target} {goal.unit} ({goal.period})
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Path Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Select Learning Path</h3>
          <div className="grid grid-cols-3 gap-4">
            {learningPaths.map(path => (
              <motion.button
                key={path.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePathChange(path.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPath === path.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-border bg-card hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                    {path.level}
                  </span>
                  {selectedPath === path.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                </div>
                <h4 className="font-semibold mb-1">{path.name}</h4>
                <p className="text-sm text-muted-foreground">{path.topics.length} topics</p>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Current Path Progress */}
        {currentPath && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">{currentPath.name}</h3>
                <p className="text-sm text-muted-foreground">{currentPath.level} Level</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>

            <div className="space-y-3">
              {currentPath.topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    topic.status === 'locked'
                      ? 'border-border bg-card/50 opacity-60'
                      : 'border-border bg-card hover:border-blue-500/50'
                  } transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div>
                        {topic.status === 'completed' && (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        )}
                        {topic.status === 'in-progress' && (
                          <Circle className="w-6 h-6 text-blue-500" />
                        )}
                        {topic.status === 'locked' && (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{topic.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {topic.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {topic.completedLessons} / {topic.totalLessons} lessons
                        </p>
                        {topic.status !== 'locked' && (
                          <Progress value={topic.progress} className="h-1.5 mt-2" />
                        )}
                      </div>
                    </div>
                    {topic.status !== 'locked' && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Activity Tips */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
          <h3 className="text-lg font-semibold mb-3">💡 How to Progress</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-400 mb-1">Study Time Goal:</p>
              <p className="text-muted-foreground">Use AI Tutor, Code Explainer, or Simplify Docs</p>
            </div>
            <div>
              <p className="font-medium text-emerald-400 mb-1">Complete Lessons:</p>
              <p className="text-muted-foreground">Take quizzes and score 70%+ to count as lessons</p>
            </div>
            <div>
              <p className="font-medium text-orange-400 mb-1">Practice Problems:</p>
              <p className="text-muted-foreground">Debug errors or generate projects</p>
            </div>
            <div>
              <p className="font-medium text-purple-400 mb-1">Topic Progress:</p>
              <p className="text-muted-foreground">Activities automatically update relevant topics</p>
            </div>
          </div>
        </Card>
      </div>
    </FeatureLayout>
  );
}