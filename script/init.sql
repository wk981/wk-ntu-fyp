-- Drop tables if they already exist
DROP TABLE IF EXISTS knowledge_abilities CASCADE;
DROP TABLE IF EXISTS key_tasks CASCADE;
DROP TABLE IF EXISTS work_functions CASCADE;
DROP TABLE IF EXISTS career_skills CASCADE;
DROP TABLE IF EXISTS skill_proficiency CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS careers CASCADE;

-- Table to store careers
CREATE TABLE careers (
    career_id SERIAL PRIMARY KEY,          -- Unique identifier for each career
    sector VARCHAR(255) NOT NULL,          -- The sector (e.g., Accountancy, IT)
    track TEXT NOT NULL,                   -- The track or specialization within the sector
    job_role VARCHAR(255) NOT NULL,        -- The job role (e.g., Audit Manager)
    job_role_description TEXT,             -- A detailed description of the job role
    performance_expectations TEXT,         -- Performance expectations for the role
    CONSTRAINT unique_career UNIQUE(sector, track, job_role)  -- Ensures unique combination of sector, track, and job role
);

-- Table to store work functions related to each career (including key tasks)
CREATE TABLE work_functions (
    work_function_id SERIAL PRIMARY KEY,   -- Unique identifier for each work function
    career_id INTEGER REFERENCES careers(career_id) ON DELETE CASCADE,  -- Foreign key to Careers
    critical_work_function VARCHAR(255) NOT NULL,  -- Critical work function for the career
    key_tasks TEXT,                        -- Concatenated key tasks for the work function
    CONSTRAINT unique_work_function UNIQUE(career_id, critical_work_function)  -- Ensures unique work function per career
);

-- Table to store skills
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,           -- Unique identifier for each skill
    sector VARCHAR(255),                   -- tsc_ccs_sector
    category VARCHAR(255),                 -- tsc_ccs_category
    title VARCHAR(255),                    -- tsc_ccs_title
    description TEXT,                      -- tsc_ccs_description
    type VARCHAR(50)
);

-- Table to link careers and skills (Many-to-Many relationship)
CREATE TABLE career_skills (
    id SERIAL PRIMARY KEY,
    career_id INT,                         -- Foreign key to the careers table
    skill_id INT,                          -- Foreign key to the skills table
    category VARCHAR(50),                  -- TSC_CCS_Type. tsc or ccs
    proficiency_level VARCHAR(50),         -- Proficiency level (e.g., Level 1, Level 2, etc.)
    FOREIGN KEY (career_id) REFERENCES careers(career_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);


-- Table to store skill proficiency levels, classification and descriptions
CREATE TABLE skill_proficiency (
    id SERIAL PRIMARY KEY,
    skill_id INT,                          -- Foreign key linking to the skills table
    proficiency_level VARCHAR(50),         -- Proficiency level (e.g., "Level 1", "Level 2", etc.)
    proficiency_description TEXT,          -- Merged detailed description of knowledge and abilities
    classification VARCHAR(50),            -- 'knowledge' or 'ability' classification
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);