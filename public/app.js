document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const enrollmentForm = document.getElementById('enrollmentForm');
    const studentSelect = document.getElementById('studentSelect');
    const courseSelect = document.getElementById('courseSelect');
    const enrollmentTableBody = document.querySelector('#enrollmentTable tbody');

    // Initial load
    fetchStudents();
    fetchCourses();
    fetchEnrollments();

    // Register Student
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            strand: document.getElementById('strand').value
        };

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Student registered successfully!');
                studentForm.reset();
                fetchStudents(); // Refresh the student dropdown
            } else {
                const err = await response.json();
                alert('Error: ' + err.error);
            }
        } catch (error) {
            console.error('Error registering student:', error);
        }
    });

    // Enroll Student in Course
    enrollmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            student_id: studentSelect.value,
            course_id: courseSelect.value
        };

        try {
            const response = await fetch('/api/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Enrolled successfully!');
                enrollmentForm.reset();
                fetchEnrollments(); // Refresh the table
            } else {
                const err = await response.json();
                alert('Error: ' + err.error);
            }
        } catch (error) {
            console.error('Error enrolling student:', error);
        }
    });

    // Helper: Fetch students for dropdown
    async function fetchStudents() {
        try {
            const response = await fetch('/api/students');
            const students = await response.json();

            studentSelect.innerHTML = '<option value="">Select Student</option>';
            students.forEach(s => {
                const option = document.createElement('option');
                option.value = s.id;
                option.textContent = `${s.first_name} ${s.last_name} (${s.strand})`;
                studentSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    // Helper: Fetch courses for dropdown
    async function fetchCourses() {
        try {
            const response = await fetch('/api/courses');
            const courses = await response.json();

            courseSelect.innerHTML = '<option value="">Select Course</option>';
            courses.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = c.name;
                courseSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    // Helper: Fetch enrollments for table
    async function fetchEnrollments() {
        try {
            const response = await fetch('/api/enrollments');
            const enrollments = await response.json();

            enrollmentTableBody.innerHTML = '';
            enrollments.forEach(e => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${e.first_name} ${e.last_name}</td>
                    <td>${e.course_name}</td>
                    <td>${new Date(e.enrollment_date).toLocaleString()}</td>
                `;
                enrollmentTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        }
    }
});
