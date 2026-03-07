-- Kiru AI Learning Platform Database Schema
-- PostgreSQL for AWS RDS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_picture_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User sessions for JWT management
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(255),
    feature VARCHAR(100) NOT NULL, -- ai_tutor, code_explainer, etc.
    messages JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Learning paths and progress
CREATE TABLE IF NOT EXISTS learning_paths (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    path_name VARCHAR(255) NOT NULL,
    path_type VARCHAR(100) NOT NULL, -- javascript, python, react, etc.
    current_topic VARCHAR(255),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    streak_count INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in minutes
    last_activity TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL, -- ai_tutor, quiz_master, etc.
    topic VARCHAR(255),
    activity_type VARCHAR(100), -- question_asked, quiz_completed, etc.
    progress_data JSONB NOT NULL,
    points_earned INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP DEFAULT NOW()
);

-- Code snippets library
CREATE TABLE IF NOT EXISTS code_snippets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    source_feature VARCHAR(100), -- ai_tutor, code_explainer, etc.
    source_metadata JSONB DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz results and statistics
CREATE TABLE IF NOT EXISTS quiz_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_taken INTEGER, -- in seconds
    score_percentage INTEGER,
    questions_data JSONB NOT NULL, -- store questions and answers
    created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements and badges
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL, -- streak_master, quiz_champion, etc.
    achievement_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    points_awarded INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP DEFAULT NOW()
);

-- System logs for monitoring
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    feature VARCHAR(100),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_feature ON conversations(feature);
CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_feature ON user_progress(feature);
CREATE INDEX IF NOT EXISTS idx_code_snippets_user_id ON code_snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_code_snippets_language ON code_snippets(language);
CREATE INDEX IF NOT EXISTS idx_code_snippets_tags ON code_snippets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_code_snippets_updated_at BEFORE UPDATE ON code_snippets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();