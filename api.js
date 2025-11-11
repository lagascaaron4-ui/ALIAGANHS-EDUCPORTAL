// API utility functions for connecting frontend with backend

const API_URL = window.location.protocol === 'https:' ? 'https://localhost:5000/api' : 'http://localhost:5000/api';

// CSRF token management
let csrfToken = null;

// Get CSRF token from server
async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  try {
    const response = await fetch(`${API_URL}/auth/csrf-token`, {
      credentials: 'include', // Include cookies for CSRF token
    });
    const data = await response.json();
    if (data.success) {
      csrfToken = data.token;
      return csrfToken;
    }
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
  }
  return null;
}

// Secure fetch wrapper with CSRF protection
async function secureFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps prevent CSRF
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // Add CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
    const csrf = await getCsrfToken();
    if (csrf) {
      defaultHeaders['X-CSRF-Token'] = csrf;
    }
  }

  const secureOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Include cookies
    mode: 'cors', // Enable CORS
  };

  // Add timeout for security
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...secureOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Check for authentication errors
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'main.html';
      throw new Error('Authentication required');
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    throw error;
  }
}

// Authentication functions
const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await secureFetch(`${API_URL}/auth/register`, {
        method: 'POST',
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
      const response = await secureFetch(`${API_URL}/auth/login`, {
        method: 'POST',
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
      const response = await secureFetch(`${API_URL}/auth/me`);
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
      const response = await secureFetch(`${API_URL}/students`);
      return await response.json();
    } catch (error) {
      console.error('Get students error:', error);
      return { success: false, message: 'Failed to fetch students' };
    }
  },

  // Get student by ID
  getById: async (id) => {
    try {
      const response = await secureFetch(`${API_URL}/students/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Get student error:', error);
      return { success: false, message: 'Failed to fetch student' };
    }
  },

  // Create new student
  create: async (studentData) => {
    try {
      const response = await secureFetch(`${API_URL}/students`, {
        method: 'POST',
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
      const response = await secureFetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
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
      const response = await secureFetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
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
  },

  // Approve enrollment
  approve: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/enrollments/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Approve enrollment error:', error);
      return { success: false, message: 'Failed to approve enrollment' };
    }
  },

  // Reject enrollment
  reject: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/enrollments/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Reject enrollment error:', error);
      return { success: false, message: 'Failed to reject enrollment' };
    }
  }
};

// Grade API functions
const gradeAPI = {
  // Get all grades
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/grades`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get grades error:', error);
      return { success: false, message: 'Failed to fetch grades' };
    }
  },

  // Get grades by class
  getByClass: async (className) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/grades/class/${className}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get grades by class error:', error);
      return { success: false, message: 'Failed to fetch grades by class' };
    }
  },

  // Create new grade
  create: async (gradeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gradeData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create grade error:', error);
      return { success: false, message: 'Failed to create grade' };
    }
  },

  // Update grade
  update: async (id, gradeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/grades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gradeData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update grade error:', error);
      return { success: false, message: 'Failed to update grade' };
    }
  },

  // Delete grade
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/grades/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Delete grade error:', error);
      return { success: false, message: 'Failed to delete grade' };
    }
  }
};

// Announcement API functions
const announcementAPI = {
  // Get all announcements
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get announcements error:', error);
      return { success: false, message: 'Failed to fetch announcements' };
    }
  },

  // Create new announcement
  create: async (announcementData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(announcementData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create announcement error:', error);
      return { success: false, message: 'Failed to create announcement' };
    }
  },

  // Update announcement
  update: async (id, announcementData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/announcements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(announcementData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update announcement error:', error);
      return { success: false, message: 'Failed to update announcement' };
    }
  },

  // Delete announcement
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Delete announcement error:', error);
      return { success: false, message: 'Failed to delete announcement' };
    }
  }
};

// Parent API functions
const parentAPI = {
  // Get parent's children
  getChildren: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/parent/children`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get children error:', error);
      return { success: false, message: 'Failed to fetch children' };
    }
  },

  // Get child's grades
  getChildGrades: async (childId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/parent/children/${childId}/grades`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get child grades error:', error);
      return { success: false, message: 'Failed to fetch child grades' };
    }
  },

  // Get child's attendance
  getChildAttendance: async (childId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/parent/children/${childId}/attendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get child attendance error:', error);
      return { success: false, message: 'Failed to fetch child attendance' };
    }
  }
};

// Message API functions
const messageAPI = {
  // Get all messages for the user
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get messages error:', error);
      return { success: false, message: 'Failed to fetch messages' };
    }
  },

  // Send a message
  send: async (messageData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });
      return await response.json();
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, message: 'Failed to send message' };
    }
  }
};

// Resource API functions
const resourceAPI = {
  // Get all resources
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/resources`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get resources error:', error);
      return { success: false, message: 'Failed to fetch resources' };
    }
  },

  // Create new resource
  create: async (resourceData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resourceData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create resource error:', error);
      return { success: false, message: 'Failed to create resource' };
    }
  },

  // Update resource
  update: async (id, resourceData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resourceData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update resource error:', error);
      return { success: false, message: 'Failed to update resource' };
    }
  },

  // Delete resource
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Delete resource error:', error);
      return { success: false, message: 'Failed to delete resource' };
    }
  }
};

// Admin API functions
const adminAPI = {
  // Create new admin
  createAdmin: async (adminData) => {
    try {
      const response = await secureFetch(`${API_URL}/auth/create-admin`, {
        method: 'POST',
        body: JSON.stringify(adminData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create admin error:', error);
      return { success: false, message: 'Failed to create admin' };
    }
  },

  // Get all admins
  getAdmins: async () => {
    try {
      const response = await secureFetch(`${API_URL}/auth/admins`);
      return await response.json();
    } catch (error) {
      console.error('Get admins error:', error);
      return { success: false, message: 'Failed to fetch admins' };
    }
  },

  // Delete admin
  deleteAdmin: async (id) => {
    try {
      const response = await secureFetch(`${API_URL}/auth/admin/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Delete admin error:', error);
      return { success: false, message: 'Failed to delete admin' };
    }
  }
};

// Export all API functions
const API = {
  auth: authAPI,
  students: studentAPI,
  teachers: teacherAPI,
  courses: courseAPI,
  enrollments: enrollmentAPI,
  grades: gradeAPI,
  announcements: announcementAPI,
  resources: resourceAPI,
  parent: parentAPI,
  messages: messageAPI,
  admin: adminAPI
};

// Expose convenient globals for older pages that call simple helpers (login(), register(), etc.)
if (typeof window !== 'undefined') {
  window.API = API;
  // backward-compatible aliases
  window.login = authAPI.login;
  window.register = authAPI.register;
  window.getCurrentUser = authAPI.getCurrentUser;
  window.logout = authAPI.logout || (() => { localStorage.removeItem('token'); localStorage.removeItem('user'); });
}