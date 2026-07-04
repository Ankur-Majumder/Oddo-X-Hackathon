// ============================================
// DATA LAYER - localStorage helpers & seed data
// ============================================

const DB = {
  // Keys
  USERS: 'hrms_users',
  CURRENT_USER: 'hrms_current_user',
  ATTENDANCE: 'hrms_attendance',
  LEAVES: 'hrms_leaves',

  // Generic get/set
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch { return null; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Users
  getUsers() { return this.get(this.USERS) || []; },
  setUsers(users) { this.set(this.USERS, users); },
  getUserByEmail(email) {
    return this.getUsers().find(u => u.email === email);
  },
  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.setUsers(users);
  },
  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      this.setUsers(users);
      // Update current user if editing self
      const current = this.getCurrentUser();
      if (current && current.id === id) {
        this.setCurrentUser(users[idx]);
      }
    }
  },

  // Current user session
  getCurrentUser() { return this.get(this.CURRENT_USER); },
  setCurrentUser(user) { this.set(this.CURRENT_USER, user); },
  logout() { localStorage.removeItem(this.CURRENT_USER); },

  // Attendance
  getAttendance() { return this.get(this.ATTENDANCE) || []; },
  setAttendance(data) { this.set(this.ATTENDANCE, data); },
  getAttendanceByUser(userId) {
    return this.getAttendance().filter(a => a.userId === userId);
  },
  addAttendanceRecord(record) {
    const data = this.getAttendance();
    data.push(record);
    this.setAttendance(data);
  },
  updateAttendanceRecord(id, updates) {
    const data = this.getAttendance();
    const idx = data.findIndex(a => a.id === id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...updates };
      this.setAttendance(data);
    }
  },
  getTodayAttendance(userId) {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendance().find(a => a.userId === userId && a.date === today);
  },

  // Leave requests
  getLeaves() { return this.get(this.LEAVES) || []; },
  setLeaves(data) { this.set(this.LEAVES, data); },
  getLeavesByUser(userId) {
    return this.getLeaves().filter(l => l.userId === userId);
  },
  addLeave(leave) {
    const data = this.getLeaves();
    data.push(leave);
    this.setLeaves(data);
  },
  updateLeave(id, updates) {
    const data = this.getLeaves();
    const idx = data.findIndex(l => l.id === id);
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...updates };
      this.setLeaves(data);
    }
  },

  // Generate unique ID
  genId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
};

// ============================================
// SEED DATA
// ============================================
function seedData() {
  if (DB.getUsers().length > 0) return; // Already seeded

  const departments = ['Engineering', 'Design', 'Marketing', 'Finance', 'HR', 'Operations'];
  const locations = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad'];
  
  const avatarColors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#FDCB6E', '#E84393', '#00CEC9', '#FF7675'];

  const seedEmployees = [
    {
      id: 'emp_001', employeeId: 'EMP001', name: 'Ankur Sharma', email: 'admin@hrms.com',
      password: 'Admin@123', role: 'admin', phone: '+91 98765 43210',
      department: 'HR', designation: 'HR Director', manager: 'Self',
      location: 'Mumbai', joinDate: '2023-01-15',
      salary: 85000, about: 'Experienced HR professional with 10+ years of experience.',
      interests: 'Reading, Travelling, Yoga', skills: ['HR Management', 'Recruitment', 'Compliance'],
      certifications: ['SHRM-CP', 'PHR'], avatarColor: avatarColors[0],
      address: '123 Marine Drive, Mumbai', emergencyContact: '+91 98765 00000',
      bankAccount: 'XXXX-XXXX-1234', panNumber: 'ABCDE1234F'
    },
    {
      id: 'emp_002', employeeId: 'EMP002', name: 'Priya Patel', email: 'priya@hrms.com',
      password: 'Priya@123', role: 'employee', phone: '+91 87654 32109',
      department: 'Engineering', designation: 'Senior Developer', manager: 'Ankur Sharma',
      location: 'Bangalore', joinDate: '2023-03-20',
      salary: 72000, about: 'Full-stack developer passionate about building scalable applications.',
      interests: 'Coding, Music, Photography', skills: ['React', 'Node.js', 'Python', 'AWS'],
      certifications: ['AWS Solutions Architect'], avatarColor: avatarColors[1],
      address: '456 MG Road, Bangalore', emergencyContact: '+91 87654 00000',
      bankAccount: 'XXXX-XXXX-2345', panNumber: 'FGHIJ5678K'
    },
    {
      id: 'emp_003', employeeId: 'EMP003', name: 'Rahul Verma', email: 'rahul@hrms.com',
      password: 'Rahul@123', role: 'employee', phone: '+91 76543 21098',
      department: 'Design', designation: 'UI/UX Lead', manager: 'Ankur Sharma',
      location: 'Delhi', joinDate: '2023-06-10',
      salary: 65000, about: 'Creative designer with a keen eye for detail and user experience.',
      interests: 'Sketching, Gaming, Cooking', skills: ['Figma', 'Adobe XD', 'Illustration', 'Prototyping'],
      certifications: ['Google UX Design Certificate'], avatarColor: avatarColors[2],
      address: '789 Connaught Place, Delhi', emergencyContact: '+91 76543 00000',
      bankAccount: 'XXXX-XXXX-3456', panNumber: 'KLMNO9012P'
    },
    {
      id: 'emp_004', employeeId: 'EMP004', name: 'Sneha Gupta', email: 'sneha@hrms.com',
      password: 'Sneha@123', role: 'employee', phone: '+91 65432 10987',
      department: 'Marketing', designation: 'Marketing Manager', manager: 'Ankur Sharma',
      location: 'Pune', joinDate: '2023-08-01',
      salary: 60000, about: 'Data-driven marketer with expertise in digital campaigns.',
      interests: 'Writing, Hiking, Social Media', skills: ['SEO', 'Content Strategy', 'Analytics', 'PPC'],
      certifications: ['Google Ads Certified', 'HubSpot Inbound'], avatarColor: avatarColors[3],
      address: '321 FC Road, Pune', emergencyContact: '+91 65432 00000',
      bankAccount: 'XXXX-XXXX-4567', panNumber: 'PQRST3456U'
    },
    {
      id: 'emp_005', employeeId: 'EMP005', name: 'Amit Kumar', email: 'amit@hrms.com',
      password: 'Amit@123', role: 'employee', phone: '+91 54321 09876',
      department: 'Finance', designation: 'Financial Analyst', manager: 'Ankur Sharma',
      location: 'Hyderabad', joinDate: '2024-01-10',
      salary: 55000, about: 'Finance professional with strong analytical skills.',
      interests: 'Chess, Stock Trading, Reading', skills: ['Financial Modeling', 'Excel', 'SAP', 'Tally'],
      certifications: ['CFA Level 1'], avatarColor: avatarColors[4],
      address: '654 Jubilee Hills, Hyderabad', emergencyContact: '+91 54321 00000',
      bankAccount: 'XXXX-XXXX-5678', panNumber: 'UVWXY7890Z'
    },
    {
      id: 'emp_006', employeeId: 'EMP006', name: 'Kavita Singh', email: 'kavita@hrms.com',
      password: 'Kavita@123', role: 'employee', phone: '+91 43210 98765',
      department: 'Engineering', designation: 'Backend Developer', manager: 'Priya Patel',
      location: 'Bangalore', joinDate: '2024-02-15',
      salary: 58000, about: 'Backend specialist focusing on microservices architecture.',
      interests: 'Open Source, Blogging, Running', skills: ['Java', 'Spring Boot', 'Docker', 'Kubernetes'],
      certifications: ['Kubernetes Admin (CKA)'], avatarColor: avatarColors[5],
      address: '111 Whitefield, Bangalore', emergencyContact: '+91 43210 00000',
      bankAccount: 'XXXX-XXXX-6789', panNumber: 'ABCFG1234H'
    },
    {
      id: 'emp_007', employeeId: 'EMP007', name: 'Deepak Joshi', email: 'deepak@hrms.com',
      password: 'Deepak@123', role: 'employee', phone: '+91 32109 87654',
      department: 'Operations', designation: 'Operations Manager', manager: 'Ankur Sharma',
      location: 'Mumbai', joinDate: '2023-11-01',
      salary: 62000, about: 'Operations expert streamlining business processes.',
      interests: 'Travel, Cricket, Photography', skills: ['Project Management', 'Lean Six Sigma', 'Supply Chain'],
      certifications: ['PMP', 'Six Sigma Green Belt'], avatarColor: avatarColors[6],
      address: '222 Andheri West, Mumbai', emergencyContact: '+91 32109 00000',
      bankAccount: 'XXXX-XXXX-7890', panNumber: 'HIJKL5678M'
    },
    {
      id: 'emp_008', employeeId: 'EMP008', name: 'Neha Reddy', email: 'neha@hrms.com',
      password: 'Neha@123', role: 'admin', phone: '+91 21098 76543',
      department: 'HR', designation: 'HR Manager', manager: 'Ankur Sharma',
      location: 'Hyderabad', joinDate: '2023-05-20',
      salary: 70000, about: 'HR manager focused on employee engagement and culture.',
      interests: 'Dance, Reading, Volunteering', skills: ['Employee Relations', 'Training', 'Benefits Admin'],
      certifications: ['SHRM-SCP'], avatarColor: avatarColors[7],
      address: '333 Banjara Hills, Hyderabad', emergencyContact: '+91 21098 00000',
      bankAccount: 'XXXX-XXXX-8901', panNumber: 'NOPQR9012S'
    }
  ];

  DB.setUsers(seedEmployees);

  // Seed some attendance records for last 30 days
  const attendanceRecords = [];
  const statuses = ['present', 'present', 'present', 'present', 'present', 'absent', 'half-day', 'leave'];
  
  seedEmployees.forEach(emp => {
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const checkIn = status === 'present' || status === 'half-day' 
        ? `09:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}` : null;
      const checkOut = status === 'present' 
        ? `18:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}` 
        : status === 'half-day' ? `13:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}` : null;

      attendanceRecords.push({
        id: DB.genId(),
        userId: emp.id,
        date: date.toISOString().split('T')[0],
        status: status,
        checkIn: checkIn,
        checkOut: checkOut
      });
    }
  });
  DB.setAttendance(attendanceRecords);

  // Seed some leave requests
  const leaveTypes = ['paid', 'sick', 'unpaid'];
  const leaveStatuses = ['pending', 'approved', 'rejected'];
  const leaveRecords = [];

  seedEmployees.filter(e => e.role === 'employee').forEach(emp => {
    for (let i = 0; i < 3; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30) + Math.floor(Math.random() * 15));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1);
      
      leaveRecords.push({
        id: DB.genId(),
        userId: emp.id,
        employeeName: emp.name,
        type: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: ['Family function', 'Medical appointment', 'Personal work', 'Vacation', 'Feeling unwell'][Math.floor(Math.random() * 5)],
        status: leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)],
        adminComment: '',
        appliedOn: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  });
  DB.setLeaves(leaveRecords);
}

// Helper: format currency
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Helper: format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Helper: get initials
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Helper: get employee status for today
function getEmployeeStatus(userId) {
  const today = new Date().toISOString().split('T')[0];
  const att = DB.getAttendance().find(a => a.userId === userId && a.date === today);
  if (att) return att.status;
  
  // Check if on leave
  const leaves = DB.getLeaves().filter(l => l.userId === userId && l.status === 'approved');
  const onLeave = leaves.some(l => l.startDate <= today && l.endDate >= today);
  if (onLeave) return 'leave';
  
  return 'absent';
}
