-- Database Schema for Recycling Production Line Manager System

CREATE DATABASE IF NOT EXISTS recycling_hr_db;
USE recycling_hr_db;

-- 1. Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    years_experience INT NOT NULL,
    skills TEXT, -- JSON or comma-separated string
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Evaluations Table
CREATE TABLE IF NOT EXISTS evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    crisis_mgmt_score INT CHECK (crisis_mgmt_score BETWEEN 0 AND 10),
    sustainability_score INT CHECK (sustainability_score BETWEEN 0 AND 10),
    team_motivation_score INT CHECK (team_motivation_score BETWEEN 0 AND 10),
    feedback_text TEXT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 3. Rankings Table (Auto-updated via Triggers)
CREATE TABLE IF NOT EXISTS rankings (
    candidate_id INT PRIMARY KEY,
    total_score INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_rankings_total ON rankings(total_score DESC);

-- 4. Triggers to auto-update Rankings
DELIMITER //

CREATE TRIGGER after_evaluation_insert
AFTER INSERT ON evaluations
FOR EACH ROW
BEGIN
    INSERT INTO rankings (candidate_id, total_score, average_score)
    VALUES (
        NEW.candidate_id,
        NEW.crisis_mgmt_score + NEW.sustainability_score + NEW.team_motivation_score,
        (NEW.crisis_mgmt_score + NEW.sustainability_score + NEW.team_motivation_score) / 3.0
    )
    ON DUPLICATE KEY UPDATE
        total_score = VALUES(total_score),
        average_score = VALUES(average_score);
END //

CREATE TRIGGER after_evaluation_update
AFTER UPDATE ON evaluations
FOR EACH ROW
BEGIN
    INSERT INTO rankings (candidate_id, total_score, average_score)
    VALUES (
        NEW.candidate_id,
        NEW.crisis_mgmt_score + NEW.sustainability_score + NEW.team_motivation_score,
        (NEW.crisis_mgmt_score + NEW.sustainability_score + NEW.team_motivation_score) / 3.0
    )
    ON DUPLICATE KEY UPDATE
        total_score = VALUES(total_score),
        average_score = VALUES(average_score);
END //

DELIMITER ;
