const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let db;

// Initialize database before starting server
initializeDatabase().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});

// --- API Endpoints ---

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await db.all('SELECT * FROM students');
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register a student
app.post('/api/students', async (req, res) => {
    const { first_name, last_name, email, strand } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO students (first_name, last_name, email, strand) VALUES (?, ?, ?, ?)',
            [first_name, last_name, email, strand]
        );
        res.status(201).json({ id: result.lastID, message: 'Student registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await db.all('SELECT * FROM courses');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll a student in a course
app.post('/api/enrollments', async (req, res) => {
    const { student_id, course_id } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
            [student_id, course_id]
        );
        res.status(201).json({ id: result.lastID, message: 'Enrolled successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all enrollments with details
app.get('/api/enrollments', async (req, res) => {
    try {
        const query = `
            SELECT 
                e.id, 
                s.first_name, 
                s.last_name, 
                c.name as course_name, 
                e.enrollment_date 
            FROM enrollments e
            JOIN students s ON e.student_id = s.id
            JOIN courses c ON e.course_id = c.id
            ORDER BY e.enrollment_date DESC
        `;
        const enrollments = await db.all(query);
        res.json(enrollments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
