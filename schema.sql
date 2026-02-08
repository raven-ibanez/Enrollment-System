-- Database Schema for Enrollment System

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    strand TEXT NOT NULL
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Insert some default courses for SHS
INSERT OR IGNORE INTO courses (name, description) VALUES 
('General Mathematics', 'Core subject for all strands'),
('English for Academic Purposes', 'Core subject for all strands'),
('Empowerment Technologies', 'ICT and digital literacy'),
('Introduction to Philosophy', 'Critical thinking and logic'),
('Oral Communication', 'Public speaking and communication skills'),
('Pre-Calculus', 'STEM specialty subject'),
('Fundamentals of ABM', 'ABM specialty subject'),
('Creative Writing', 'HUMSS specialty subject');
