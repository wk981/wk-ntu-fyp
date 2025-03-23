-- Trigrams extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Drop tables if they already exist
DROP TABLE IF EXISTS user_recommended_history CASCADE;
DROP TABLE IF EXISTS user_history CASCADE;
DROP TABLE IF EXISTS user_skill CASCADE;
DROP TABLE IF EXISTS _user CASCADE;
DROP TABLE IF EXISTS course_skill CASCADE;
DROP TABLE IF EXISTS career_skill CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS skill CASCADE;
DROP TABLE IF EXISTS career CASCADE;

-- Table to store careers
CREATE TABLE career (
    career_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    responsibility TEXT NOT NULL,
    career_level VARCHAR(20) CHECK (career_level IN ('Entry Level', 'Mid Level', 'Senior Level')),
    pic_url TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_career UNIQUE(title, sector)
);

-- Table to store skills
CREATE TABLE skill (
    skill_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pic_url TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_skill UNIQUE(name)
);

-- Table to store courses
CREATE TABLE course (
    course_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    link TEXT,
    rating float,
    reviews_counts float,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_source VARCHAR(20) CHECK (course_source IN ('Coursera'))
);

-- Table to associate careers with skills
CREATE TABLE career_skill (
    id SERIAL PRIMARY KEY,
    skill_id INT,
    career_id INT,
    profiency VARCHAR(20) CHECK (profiency IN ('Beginner', 'Intermediate', 'Advanced')),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_skill FOREIGN KEY (skill_id) REFERENCES skill(skill_id) ON DELETE CASCADE,
    CONSTRAINT fk_career FOREIGN KEY (career_id) REFERENCES career(career_id) ON DELETE CASCADE
);

-- Table to associate courses with skills
CREATE TABLE course_skill (
    id SERIAL PRIMARY KEY,
    skill_id INT,
    course_id INT,
    profiency VARCHAR(20) CHECK (profiency IN ('Beginner', 'Intermediate', 'Advanced', 'Mixed')),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_skill FOREIGN KEY (skill_id) REFERENCES skill(skill_id) ON DELETE CASCADE,
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- Table to store user information
CREATE TABLE _user (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    pic VARCHAR(255),
    career_id INT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_username UNIQUE(username),
    CONSTRAINT unique_email UNIQUE(email),
    FOREIGN KEY (career_id) REFERENCES career(career_id) ON DELETE CASCADE
);

-- Table to associate users with skills
CREATE TABLE user_skill (
    id SERIAL PRIMARY KEY,
    user_id INT,
    skill_id INT,
    profiency VARCHAR(20) CHECK (profiency IN ('Beginner', 'Intermediate', 'Advanced')),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES _user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(skill_id) ON DELETE CASCADE
);

-- Table to track user course completion status
CREATE TABLE user_history (
    user_history_id SERIAL PRIMARY KEY,
    user_id INT,
    course_id INT,
    course_completion_status VARCHAR(20) CHECK (course_completion_status IN ('In Progress', 'Completed', 'Not Done')),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES _user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);