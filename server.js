const express = require('express');
const cors = require('cors');
const path = require('path');
const { supabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// --- API Endpoints ---

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const { data, error } = await supabase.from('students').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register a student
app.post('/api/students', async (req, res) => {
    const { first_name, last_name, email, strand } = req.body;
    try {
        const { data, error } = await supabase
            .from('students')
            .insert([{ first_name, last_name, email, strand }])
            .select();

        if (error) throw error;
        res.status(201).json({ id: data[0].id, message: 'Student registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const { data, error } = await supabase.from('courses').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll a student in a course
app.post('/api/enrollments', async (req, res) => {
    const { student_id, course_id } = req.body;
    try {
        const { data, error } = await supabase
            .from('enrollments')
            .insert([{ student_id: parseInt(student_id), course_id: parseInt(course_id) }])
            .select();

        if (error) throw error;
        res.status(201).json({ id: data[0].id, message: 'Enrolled successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all enrollments with details
app.get('/api/enrollments', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                enrollment_date,
                students (first_name, last_name),
                courses (name)
            `)
            .order('enrollment_date', { ascending: false });

        if (error) throw error;

        // Map the result to match the frontend expectations
        const formattedData = data.map(e => ({
            id: e.id,
            first_name: e.students.first_name,
            last_name: e.students.last_name,
            course_name: e.courses.name,
            enrollment_date: e.enrollment_date
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
