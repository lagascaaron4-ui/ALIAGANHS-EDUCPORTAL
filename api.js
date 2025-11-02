// API utility functions for connecting frontend with backend

const API_URL = 'http://localhost:5000/api';

// Authentication functions
const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Failed to register' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Failed to login' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Student API functions
const studentAPI = {
  // Get all students
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get students error:', error);
      return { success: false, message: 'Failed to fetch students' };
    }
  },

  // Get student by ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get student error:', error);
      return { success: false, message: 'Failed to fetch student' };
    }
  },

  // Create new student
  create: async (studentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create student error:', error);
      return { success: false, message: 'Failed to create student' };
    }
  },

  // Update student
  update: async (id, studentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update student error:', error);
      return { success: false, message: 'Failed to update student' };
    }
  },

  // Delete student
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Delete student error:', error);
      return { success: false, message: 'Failed to delete student' };
    }
  }
};

// Teacher API functions
const teacherAPI = {
  // Get all teachers
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/teachers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get teachers error:', error);
      return { success: false, message: 'Failed to fetch teachers' };
    }
  },

  // Get teacher by ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get teacher error:', error);
      return { success: false, message: 'Failed to fetch teacher' };
    }
  },

  // Create new teacher
  create: async (teacherData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teacherData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create teacher error:', error);
      return { success: false, message: 'Failed to create teacher' };
    }
  },

  // Update teacher
  update: async (id, teacherData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/teachers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teacherData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update teacher error:', error);
      return { success: false, message: 'Failed to update teacher' };
    }
  },

  // Delete teacher
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/teachers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Delete teacher error:', error);
      return { success: false, message: 'Failed to delete teacher' };
    }
  }
};

// Course API functions
const courseAPI = {
  // Get all courses
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get courses error:', error);
      return { success: false, message: 'Failed to fetch courses' };
    }
  },

  // Get course by ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get course error:', error);
      return { success: false, message: 'Failed to fetch course' };
    }
  },

  // Create new course
  create: async (courseData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create course error:', error);
      return { success: false, message: 'Failed to create course' };
    }
  },

  // Update course
  update: async (id, courseData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update course error:', error);
      return { success: false, message: 'Failed to update course' };
    }
  },

  // Delete course
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Delete course error:', error);
      return { success: false, message: 'Failed to delete course' };
    }
  }
};

// Enrollment API functions
const enrollmentAPI = {
  // Get all enrollments
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get enrollments error:', error);
      return { success: false, message: 'Failed to fetch enrollments' };
    }
  },

  // Get enrollments by student
  getByStudent: async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/enrollments/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get student enrollments error:', error);
      return { success: false, message: 'Failed to fetch student enrollments' };
    }
  },

  // Create new enrollment
  create: async (enrollmentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(enrollmentData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create enrollment error:', error);
      return { success: false, message: 'Failed to create enrollment' };
    }
  },

  // Update enrollment
  update: async (id, enrollmentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/enrollments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(enrollmentData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update enrollment error:', error);
      return { success: false, message: 'Failed to update enrollment' };
    }
  },

  // Delete enrollment
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/enrollments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Delete enrollment error:', error);
      return { success: false, message: 'Failed to delete enrollment' };
    }
  }
};

// Export all API functions
const API = {
  auth: authAPI,
  students: studentAPI,
  teachers: teacherAPI,
  courses: courseAPI,
  enrollments: enrollmentAPI
};