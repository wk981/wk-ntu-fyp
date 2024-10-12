CREATE TABLE IF NOT EXISTS career (
    career_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sector VARCHAR(255),
    career_level VARCHAR(50),
    work_environment TEXT,
    goal TEXT,
    pic VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS _user (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    pic VARCHAR(255),
    career_id INT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (career_id) REFERENCES career(career_id)
);

CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    course_original_link VARCHAR(255),
    course_source VARCHAR(100),
    career_id INT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (career_id) REFERENCES career(career_id)
);

CREATE TABLE IF NOT EXISTS user_history (
    user_id INT,
    course_id INT,
    course_completion_status VARCHAR(50),
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES _user(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE IF NOT EXISTS skills (
    skill_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    pic VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_skills (
    skill_id INT,
    course_id INT,
    skill_exam_level INT,
    skill_recommended_level INT,
    PRIMARY KEY (skill_id, course_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_id INT,
    skill_id INT,
    skill_level INT,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES _user(user_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);



CREATE TABLE IF NOT EXISTS career_skills (
    skill_id INT,
    career_id INT,
    skill_level INT,
    PRIMARY KEY (skill_id, career_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (career_id) REFERENCES career(career_id)
);



CREATE TABLE IF NOT EXISTS user_recommended_history (
    user_id INT,
    career_id INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, career_id),
    FOREIGN KEY (user_id) REFERENCES _user(user_id),
    FOREIGN KEY (career_id) REFERENCES career(career_id)
);

CREATE TABLE IF NOT EXISTS user_course_rating (
    user_id INT,
    course_id INT,
    rating INT,
    comment TEXT,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES _user(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
