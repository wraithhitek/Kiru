import { Navigation } from "../components/Navigation";
import { motion } from "motion/react";
import { MessageCircle, Code2, Bug, FileText, FolderPlus, Award, TrendingUp, Target, Calendar, Flame } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "User",
    level: "Beginner Pythonista",
    streak: 0,
    avatar: "U"
  });
  const [progressData, setProgressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    // Load user data
    const userData = localStorage.getItem('kiruUser');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        name: parsedUser.name,
        level: parsedUser.level || "Beginner Pythonista",
        streak: parsedUser.streak || 0,
        avatar: parsedUser.name.charAt(0).toUpperCase()
      });
      
      // Fetch progress data
      fetchProgressData(parsedUser.id);
    }
  }, [navigate]);

  const fetchProgressData = async (userId: string) => {
    try {
      console.log('Fetching progress for user ID:', userId);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      console.log('Progress API response status:', response.status);
      const data = await response.json();
      console.log('Progress API response data:', data);
      
      setProgressData(data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dailyGoal = {
    title: "Learn Python Functions",
    progress: 65,
    completed: false
  };

  const roadmap = [
    { title: "Python Basics", completed: true },
    { title: "Control Flow", completed: false, current: true },
    { title: "Data Structures", completed: false }
  ];

  const skills = [
    { name: "Python", level: 80, color: "from-blue-500 to-blue-600" },
    { name: "JavaScript", level: 45, color: "from-yellow-500 to-orange-500" },
    { name: "React", level: 30, color: "from-cyan-500 to-blue-500" }
  ];

  const quickActions = [
    {
      icon: <MessageCircle className="w-8 h-8 text-white" strokeWidth={1.5} />,
      title: "Ask AI Tutor",
      description: "Get instant help",
      to: "/ask-ai-tutor",
      gradient: "from-blue-500 to-orange-500"
    },
    {
      icon: <Code2 className="w-8 h-8 text-white" strokeWidth={1.5} />,
      title: "Code Explainer",
      description: "Understand code",
      to: "/explain-code",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: <Bug className="w-8 h-8 text-white" strokeWidth={1.5} />,
      title: "Debug Error",
      description: "Fix problems",
      to: "/debug-error",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <FileText className="w-8 h-8 text-white" strokeWidth={1.5} />,
      title: "Simplify Docs",
      description: "Break down docs",
      to: "/simplify-docs",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const recentActivity = progressData?.recentActivity || [
    { type: "quiz_completed", data: { topic: "Getting Started", percentage: 0 }, date: new Date().toISOString() }
  ];

  const stats = progressData?.stats || {
    totalCodeSnippets: 0,
    totalQuizzes: 0,
    averageQuizScore: 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
      <Navigation />
      
      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-orange-500/10 border border-border"
            >
              <div className="relative z-10 flex items-start gap-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                >
                  {user.avatar}
                </motion.div>
                
                <div className="flex-1">
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl mb-2 text-foreground"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                  >
                    Welcome back, {user.name}!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-muted-foreground text-lg"
                  >
                    {user.level}
                  </motion.p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 rounded-full flex items-center gap-2 bg-card border border-border"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <Flame className="w-5 h-5 text-orange-500" />
                  </motion.div>
                  <span className="text-lg font-semibold">{user.streak} Day Streak</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-6"
            >
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.totalQuizzes}</div>
                <div className="text-sm text-muted-foreground">Quizzes Completed</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">{stats.averageQuizScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <div className="text-2xl font-bold text-purple-500">{stats.totalCodeSnippets}</div>
                <div className="text-sm text-muted-foreground">Code Snippets</div>
              </div>
            </motion.div>

            {/* Daily Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold">Daily Goal</h3>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">{dailyGoal.title}</span>
                  <span className="text-sm text-muted-foreground">{dailyGoal.progress}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dailyGoal.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-orange-500"
                  />
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">Keep going! You're almost there.</p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.to}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="relative bg-card p-6 rounded-2xl border border-border cursor-pointer group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10 flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                          {action.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold mb-1">{action.title}</h4>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-semibold">Recent Activity</h3>
              </div>
              
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => {
                  const getActivityTitle = (activity: any) => {
                    switch (activity.type) {
                      case 'quiz_completed':
                        return `Quiz: ${activity.data.topic} - ${activity.data.percentage}%`;
                      case 'code_explainer_used':
                        return `Explained ${activity.data.language} code`;
                      case 'debug_error_used':
                        return `Debugged ${activity.data.language} error`;
                      default:
                        return 'Learning activity';
                    }
                  };

                  const getActivityTime = (dateString: string) => {
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffMs = now.getTime() - date.getTime();
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffHours / 24);
                    
                    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                    return 'Just now';
                  };

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'quiz_completed' ? 'bg-emerald-500' :
                        activity.type.includes('code_explainer') ? 'bg-blue-500' :
                        activity.type.includes('debug_error') ? 'bg-red-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{getActivityTitle(activity)}</p>
                        <p className="text-sm text-muted-foreground">{getActivityTime(activity.date)}</p>
                      </div>
                    </motion.div>
                  );
                })}
                
                {recentActivity.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activity yet.</p>
                    <p className="text-sm">Start using the features to see your progress!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Roadmap */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold">Current Roadmap</h3>
              </div>
              
              <div className="space-y-4">
                {roadmap.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-emerald-500' :
                      item.current ? 'bg-blue-500 animate-pulse' :
                      'bg-muted'
                    }`}>
                      {item.completed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      ) : item.current ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      )}
                    </div>
                    <span className={`${
                      item.completed ? 'text-muted-foreground line-through' :
                      item.current ? 'text-foreground font-semibold' :
                      'text-muted-foreground'
                    }`}>
                      {item.title}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-orange-500 text-white font-medium shadow-lg"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Your Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-semibold">Your Skills</h3>
              </div>
              
              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground font-medium">{skill.name}</span>
                      <span className="text-sm font-semibold text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* More Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="text-lg font-semibold mb-4">More Tools</h3>
              <div className="space-y-2">
                {[
                  { icon: <FolderPlus className="w-4 h-4" />, label: "Project Generator", to: "/project-generator" },
                  { icon: <Award className="w-4 h-4" />, label: "Quiz Master", to: "/quiz-master" }
                ].map((tool, index) => (
                  <Link key={index} to={tool.to}>
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      whileHover={{ x: 4, scale: 1.02 }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all flex items-center gap-3 text-sm"
                    >
                      {tool.icon}
                      {tool.label}
                    </motion.button>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
