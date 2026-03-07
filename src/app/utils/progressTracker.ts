// Progress Tracking Utility for Learning Path Synchronization

export interface LearningGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  period: 'daily' | 'weekly';
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  status: 'locked' | 'in-progress' | 'completed';
}

export interface LearningPath {
  id: string;
  name: string;
  level: string;
  topics: Topic[];
}

export interface ActivityLog {
  id: string;
  type: 'ai_tutor' | 'code_explainer' | 'debug_error' | 'quiz_completed' | 'project_generated' | 'docs_simplified';
  timestamp: string;
  details: {
    topic?: string;
    language?: string;
    duration?: number;
    score?: number;
  };
}

export class ProgressTracker {
  private static STORAGE_KEYS = {
    STREAK: 'learningStreak',
    LAST_ACTIVE: 'lastActiveDate',
    GOALS: 'learningGoals',
    PATHS: 'learningPaths',
    SELECTED_PATH: 'selectedLearningPath',
    ACTIVITY_LOG: 'activityLog',
    DAILY_RESET: 'dailyGoalsResetDate',
    WEEKLY_RESET: 'weeklyGoalsResetDate',
    TOTAL_STUDY_TIME: 'totalStudyTime'
  };

  // Activity Tracking
  static trackActivity(type: ActivityLog['type'], details: ActivityLog['details'] = {}): void {
    const activity: ActivityLog = {
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      details
    };

    // Save activity log
    const activities = this.getActivityLog();
    activities.unshift(activity);
    // Keep only last 100 activities
    if (activities.length > 100) {
      activities.splice(100);
    }
    localStorage.setItem(this.STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(activities));

    // Update streak
    this.updateStreak();

    // Reset goals if needed
    this.resetDailyGoals();
    this.resetWeeklyGoals();

    // Update goals based on activity
    this.updateGoalsFromActivity(type, details);

    // Update learning path progress
    this.updateLearningPathProgress(type, details);

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('progressUpdated', { detail: activity }));
  }

  private static updateGoalsFromActivity(type: ActivityLog['type'], details: ActivityLog['details']): void {
    const goals = this.getGoals();
    
    switch (type) {
      case 'ai_tutor':
        // Update study time (assume 5 minutes per interaction)
        this.updateGoalProgress('study-time', 5);
        break;
      
      case 'code_explainer':
        // Update study time (assume 3 minutes per explanation)
        this.updateGoalProgress('study-time', 3);
        break;
      
      case 'debug_error':
        // Update practice problems
        this.updateGoalProgress('practice-problems', 1);
        break;
      
      case 'quiz_completed':
        // Update lessons completed
        this.updateGoalProgress('complete-lessons', 1);
        if (details.score && details.score >= 80) {
          // Bonus study time for good performance
          this.updateGoalProgress('study-time', 2);
        }
        break;
      
      case 'project_generated':
        // Update practice problems (project counts as multiple problems)
        this.updateGoalProgress('practice-problems', 3);
        break;
      
      case 'docs_simplified':
        // Update study time
        this.updateGoalProgress('study-time', 2);
        break;
    }
  }

  private static updateLearningPathProgress(type: ActivityLog['type'], details: ActivityLog['details']): void {
    const paths = this.getLearningPaths();
    const selectedPathId = this.getSelectedPath();
    const currentPath = paths.find(p => p.id === selectedPathId);
    
    if (!currentPath) return;

    // Map activities to topics and update progress
    const topicMapping = this.getTopicMappingForActivity(type, details);
    
    if (topicMapping) {
      const topic = currentPath.topics.find(t => t.name.toLowerCase().includes(topicMapping.keyword));
      
      if (topic && topic.status !== 'locked') {
        // Increase progress
        const progressIncrement = topicMapping.progressIncrement;
        topic.progress = Math.min(topic.progress + progressIncrement, 100);
        
        // Update completed lessons
        const newCompletedLessons = Math.floor((topic.progress / 100) * topic.totalLessons);
        topic.completedLessons = Math.max(topic.completedLessons, newCompletedLessons);
        
        // Update status
        if (topic.progress === 100) {
          topic.status = 'completed';
          // Unlock next topic
          const currentIndex = currentPath.topics.indexOf(topic);
          if (currentIndex < currentPath.topics.length - 1) {
            const nextTopic = currentPath.topics[currentIndex + 1];
            if (nextTopic.status === 'locked') {
              nextTopic.status = 'in-progress';
            }
          }
        } else if (topic.progress > 0) {
          topic.status = 'in-progress';
        }
        
        this.saveLearningPaths(paths);
      }
    }
  }

  private static getTopicMappingForActivity(type: ActivityLog['type'], details: ActivityLog['details']): { keyword: string; progressIncrement: number } | null {
    const language = details.language?.toLowerCase() || '';
    
    switch (type) {
      case 'ai_tutor':
        if (language.includes('javascript') || language.includes('js')) {
          return { keyword: 'javascript', progressIncrement: 5 };
        } else if (language.includes('python')) {
          return { keyword: 'python', progressIncrement: 5 };
        } else if (language.includes('react')) {
          return { keyword: 'react', progressIncrement: 5 };
        }
        return { keyword: 'variables', progressIncrement: 3 }; // Default to basics
      
      case 'code_explainer':
        if (language.includes('javascript')) {
          return { keyword: 'functions', progressIncrement: 8 };
        } else if (language.includes('python')) {
          return { keyword: 'syntax', progressIncrement: 8 };
        } else if (language.includes('react')) {
          return { keyword: 'components', progressIncrement: 8 };
        }
        return { keyword: 'variables', progressIncrement: 5 };
      
      case 'debug_error':
        return { keyword: 'functions', progressIncrement: 6 };
      
      case 'quiz_completed':
        const score = details.score || 0;
        const increment = score >= 90 ? 15 : score >= 70 ? 10 : 5;
        return { keyword: 'variables', progressIncrement: increment };
      
      case 'project_generated':
        return { keyword: 'dom', progressIncrement: 12 };
      
      default:
        return null;
    }
  }

  // Streak Management
  static getStreak(): number {
    return parseInt(localStorage.getItem(this.STORAGE_KEYS.STREAK) || '0');
  }

  static updateStreak(): number {
    const lastActive = localStorage.getItem(this.STORAGE_KEYS.LAST_ACTIVE);
    const today = new Date().toDateString();
    let currentStreak = this.getStreak();

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive === yesterday.toDateString()) {
        currentStreak += 1;
      } else if (lastActive) {
        currentStreak = 1;
      } else {
        currentStreak = 1;
      }

      localStorage.setItem(this.STORAGE_KEYS.STREAK, currentStreak.toString());
      localStorage.setItem(this.STORAGE_KEYS.LAST_ACTIVE, today);
    }

    return currentStreak;
  }

  // Goals Management
  static getGoals(): LearningGoal[] {
    const goalsJson = localStorage.getItem(this.STORAGE_KEYS.GOALS);
    if (goalsJson) {
      return JSON.parse(goalsJson);
    }
    
    // Initialize default goals
    const defaultGoals: LearningGoal[] = [
      { id: 'study-time', title: 'Study Time', target: 30, current: 0, unit: 'minutes', period: 'daily' },
      { id: 'complete-lessons', title: 'Complete Lessons', target: 3, current: 0, unit: 'lessons', period: 'daily' },
      { id: 'practice-problems', title: 'Practice Problems', target: 20, current: 0, unit: 'problems', period: 'weekly' }
    ];
    this.saveGoals(defaultGoals);
    return defaultGoals;
  }

  static saveGoals(goals: LearningGoal[]): void {
    localStorage.setItem(this.STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  static updateGoalProgress(goalId: string, increment: number): void {
    const goals = this.getGoals();
    const goal = goals.find(g => g.id === goalId);
    
    if (goal) {
      goal.current = Math.min(goal.current + increment, goal.target);
      this.saveGoals(goals);
    }
  }

  static resetDailyGoals(): void {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem(this.STORAGE_KEYS.DAILY_RESET);

    if (lastReset !== today) {
      const goals = this.getGoals();
      goals.forEach(goal => {
        if (goal.period === 'daily') {
          goal.current = 0;
        }
      });
      this.saveGoals(goals);
      localStorage.setItem(this.STORAGE_KEYS.DAILY_RESET, today);
    }
  }

  static resetWeeklyGoals(): void {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toDateString();
    const lastReset = localStorage.getItem(this.STORAGE_KEYS.WEEKLY_RESET);

    if (lastReset !== weekStart) {
      const goals = this.getGoals();
      goals.forEach(goal => {
        if (goal.period === 'weekly') {
          goal.current = 0;
        }
      });
      this.saveGoals(goals);
      localStorage.setItem(this.STORAGE_KEYS.WEEKLY_RESET, weekStart);
    }
  }

  // Learning Paths Management
  static getLearningPaths(): LearningPath[] {
    const pathsJson = localStorage.getItem(this.STORAGE_KEYS.PATHS);
    if (pathsJson) {
      return JSON.parse(pathsJson);
    }
    
    // Initialize default paths
    const defaultPaths: LearningPath[] = [
      {
        id: 'beginner-js',
        name: 'JavaScript Fundamentals',
        level: 'Beginner',
        topics: [
          { id: '1', name: 'Variables & Data Types', category: 'Basics', progress: 0, totalLessons: 5, completedLessons: 0, status: 'in-progress' },
          { id: '2', name: 'Functions & Scope', category: 'Basics', progress: 0, totalLessons: 6, completedLessons: 0, status: 'locked' },
          { id: '3', name: 'Arrays & Objects', category: 'Basics', progress: 0, totalLessons: 7, completedLessons: 0, status: 'locked' },
          { id: '4', name: 'DOM Manipulation', category: 'Intermediate', progress: 0, totalLessons: 8, completedLessons: 0, status: 'locked' },
          { id: '5', name: 'Async JavaScript', category: 'Intermediate', progress: 0, totalLessons: 6, completedLessons: 0, status: 'locked' }
        ]
      },
      {
        id: 'react-basics',
        name: 'React Development',
        level: 'Intermediate',
        topics: [
          { id: '1', name: 'Components & Props', category: 'Basics', progress: 0, totalLessons: 5, completedLessons: 0, status: 'in-progress' },
          { id: '2', name: 'State & Hooks', category: 'Basics', progress: 0, totalLessons: 7, completedLessons: 0, status: 'locked' },
          { id: '3', name: 'Routing', category: 'Intermediate', progress: 0, totalLessons: 4, completedLessons: 0, status: 'locked' }
        ]
      },
      {
        id: 'python-basics',
        name: 'Python Programming',
        level: 'Beginner',
        topics: [
          { id: '1', name: 'Python Syntax', category: 'Basics', progress: 0, totalLessons: 5, completedLessons: 0, status: 'in-progress' },
          { id: '2', name: 'Data Structures', category: 'Basics', progress: 0, totalLessons: 6, completedLessons: 0, status: 'locked' },
          { id: '3', name: 'OOP in Python', category: 'Intermediate', progress: 0, totalLessons: 7, completedLessons: 0, status: 'locked' }
        ]
      }
    ];
    this.saveLearningPaths(defaultPaths);
    this.setSelectedPath('beginner-js');
    return defaultPaths;
  }

  static saveLearningPaths(paths: LearningPath[]): void {
    localStorage.setItem(this.STORAGE_KEYS.PATHS, JSON.stringify(paths));
  }

  static getSelectedPath(): string {
    return localStorage.getItem(this.STORAGE_KEYS.SELECTED_PATH) || 'beginner-js';
  }

  static setSelectedPath(pathId: string): void {
    localStorage.setItem(this.STORAGE_KEYS.SELECTED_PATH, pathId);
  }

  // Activity Log
  static getActivityLog(): ActivityLog[] {
    const logJson = localStorage.getItem(this.STORAGE_KEYS.ACTIVITY_LOG);
    return logJson ? JSON.parse(logJson) : [];
  }

  // Statistics
  static getStats() {
    const activities = this.getActivityLog();
    const goals = this.getGoals();
    const paths = this.getLearningPaths();
    const selectedPath = paths.find(p => p.id === this.getSelectedPath());
    
    return {
      totalActivities: activities.length,
      activitiesToday: activities.filter(a => 
        new Date(a.timestamp).toDateString() === new Date().toDateString()
      ).length,
      currentStreak: this.getStreak(),
      completedTopics: selectedPath?.topics.filter(t => t.status === 'completed').length || 0,
      totalLessons: selectedPath?.topics.reduce((sum, t) => sum + t.completedLessons, 0) || 0,
      overallProgress: selectedPath 
        ? Math.round((selectedPath.topics.reduce((sum, t) => sum + t.progress, 0) / selectedPath.topics.length))
        : 0,
      goalProgress: goals.map(g => ({
        id: g.id,
        title: g.title,
        progress: Math.round((g.current / g.target) * 100),
        current: g.current,
        target: g.target
      }))
    };
  }
}