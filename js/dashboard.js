// ============================================
// DASHBOARD MODULE - Employee & Admin Dashboards
// ============================================

function renderDashboard() {
  const user = DB.getCurrentUser();
  if (!user) { navigateTo('auth'); return; }

  const app = document.getElementById('app');
  const todayAttendance = DB.getTodayAttendance(user.id);
  const myLeaves = DB.getLeavesByUser(user.id);
  const pendingLeaves = myLeaves.filter(l => l.status === 'pending').length;
  const approvedLeaves = myLeaves.filter(l => l.status === 'approved').length;
  const myAttendance = DB.getAttendanceByUser(user.id);
  const presentDays = myAttendance.filter(a => a.status === 'present').length;
  const totalWorkDays = myAttendance.length || 1;
  const attendanceRate = Math.round((presentDays / totalWorkDays) * 100);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  app.innerHTML = `
    ${renderNavbar(user)}
    <main class="main-content">
      <div class="dashboard-header">
        <div class="greeting-section">
          <h1>${greeting}, ${user.name.split(' ')[0]}! 👋</h1>
          <p class="subtitle">${formatDate(new Date().toISOString().split('T')[0])} &bull; ${user.designation} &bull; ${user.department}</p>
        </div>
        <div class="checkin-widget">
          ${renderCheckInWidget(user, todayAttendance)}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card glass-card" onclick="navigateTo('attendance')" style="--accent: #6C5CE7">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${attendanceRate}%</span>
            <span class="stat-label">Attendance Rate</span>
          </div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: ${attendanceRate}%; background: var(--accent)"></div>
          </div>
        </div>
        
        <div class="stat-card glass-card" onclick="navigateTo('leave')" style="--accent: #00B894">
          <div class="stat-icon" style="background: rgba(0,184,148,0.15); color: #00B894">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
              <path d="M9 15h6M9 11h6"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${pendingLeaves}</span>
            <span class="stat-label">Pending Leaves</span>
          </div>
          <div class="stat-detail">${approvedLeaves} approved this period</div>
        </div>
        
        <div class="stat-card glass-card" onclick="navigateTo('profile')" style="--accent: #E17055">
          <div class="stat-icon" style="background: rgba(225,112,85,0.15); color: #E17055">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${user.employeeId}</span>
            <span class="stat-label">My Profile</span>
          </div>
          <div class="stat-detail">${user.department} Department</div>
        </div>
        
        <div class="stat-card glass-card" onclick="navigateTo('payroll')" style="--accent: #0984E3">
          <div class="stat-icon" style="background: rgba(9,132,227,0.15); color: #0984E3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${formatCurrency(user.salary)}</span>
            <span class="stat-label">Monthly Salary</span>
          </div>
          <div class="stat-detail">View payslip →</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dash-section glass-card">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Recent Activity
          </h3>
          <div class="activity-list">
            ${renderRecentActivity(user)}
          </div>
        </div>

        <div class="dash-section glass-card">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            This Week's Attendance
          </h3>
          <div class="week-attendance">
            ${renderWeekAttendance(user)}
          </div>
        </div>
      </div>

      <div class="quick-actions glass-card">
        <h3 class="section-title">Quick Actions</h3>
        <div class="actions-grid">
          <button class="action-btn" onclick="navigateTo('leave')">
            <div class="action-icon" style="background: linear-gradient(135deg, #6C5CE7, #a29bfe)">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6M12 18v-6M9 15h6"/>
              </svg>
            </div>
            <span>Apply Leave</span>
          </button>
          <button class="action-btn" onclick="navigateTo('attendance')">
            <div class="action-icon" style="background: linear-gradient(135deg, #00B894, #55efc4)">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span>View Attendance</span>
          </button>
          <button class="action-btn" onclick="navigateTo('profile')">
            <div class="action-icon" style="background: linear-gradient(135deg, #E17055, #fab1a0)">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span>My Profile</span>
          </button>
          <button class="action-btn" onclick="handleLogout()">
            <div class="action-icon" style="background: linear-gradient(135deg, #636e72, #b2bec3)">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </main>
  `;
  animateStatsOnLoad();
}

function renderCheckInWidget(user, todayAttendance) {
  if (todayAttendance && todayAttendance.checkOut) {
    return `
      <div class="checkin-status checked-out">
        <div class="checkin-dot"></div>
        <div>
          <span class="checkin-label">Checked Out</span>
          <span class="checkin-time">${todayAttendance.checkIn} - ${todayAttendance.checkOut}</span>
        </div>
      </div>
    `;
  } else if (todayAttendance && todayAttendance.checkIn) {
    return `
      <div class="checkin-status checked-in">
        <div class="checkin-dot pulse"></div>
        <div>
          <span class="checkin-label">Checked In at ${todayAttendance.checkIn}</span>
          <button class="btn btn-sm btn-outline" onclick="handleCheckOut('${todayAttendance.id}')">Check Out</button>
        </div>
      </div>
    `;
  } else {
    return `
      <button class="btn btn-primary checkin-btn" onclick="handleCheckIn('${user.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Check In
      </button>
    `;
  }
}

function handleCheckIn(userId) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  DB.addAttendanceRecord({
    id: DB.genId(),
    userId: userId,
    date: now.toISOString().split('T')[0],
    status: 'present',
    checkIn: time,
    checkOut: null
  });
  
  showToast('Checked in at ' + time + ' ✅', 'success');
  renderDashboard();
}

function handleCheckOut(recordId) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  DB.updateAttendanceRecord(recordId, { checkOut: time });
  showToast('Checked out at ' + time + ' 👋', 'success');
  renderDashboard();
}

function renderRecentActivity(user) {
  const leaves = DB.getLeavesByUser(user.id).slice(-5).reverse();
  const attendance = DB.getAttendanceByUser(user.id).slice(-5).reverse();
  
  let activities = [];
  
  leaves.forEach(l => {
    activities.push({
      icon: l.status === 'approved' ? '✅' : l.status === 'rejected' ? '❌' : '⏳',
      text: `Leave ${l.status}: ${l.type} (${formatDate(l.startDate)} - ${formatDate(l.endDate)})`,
      date: l.appliedOn,
      type: l.status
    });
  });
  
  attendance.slice(0, 3).forEach(a => {
    activities.push({
      icon: a.status === 'present' ? '🟢' : a.status === 'absent' ? '🔴' : a.status === 'half-day' ? '🟡' : '✈️',
      text: `${a.status.charAt(0).toUpperCase() + a.status.slice(1)} on ${formatDate(a.date)}`,
      date: a.date,
      type: a.status
    });
  });
  
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (activities.length === 0) {
    return '<div class="empty-state">No recent activity</div>';
  }
  
  return activities.slice(0, 5).map(a => `
    <div class="activity-item">
      <span class="activity-icon">${a.icon}</span>
      <span class="activity-text">${a.text}</span>
    </div>
  `).join('');
}

function renderWeekAttendance(user) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  
  return days.map((day, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const record = DB.getAttendanceByUser(user.id).find(a => a.date === dateStr);
    const isToday = dateStr === today.toISOString().split('T')[0];
    const isFuture = date > today;
    
    let statusClass = 'unknown';
    let statusIcon = '—';
    if (record) {
      statusClass = record.status;
      statusIcon = record.status === 'present' ? '✓' : record.status === 'absent' ? '✗' : record.status === 'half-day' ? '½' : '✈';
    } else if (isFuture) {
      statusClass = 'future';
      statusIcon = '·';
    }
    
    return `
      <div class="week-day ${statusClass} ${isToday ? 'today' : ''}">
        <span class="week-day-name">${day}</span>
        <span class="week-day-date">${date.getDate()}</span>
        <span class="week-day-status">${statusIcon}</span>
      </div>
    `;
  }).join('');
}

function animateStatsOnLoad() {
  const cards = document.querySelectorAll('.stat-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });
  
  // Animate stat bars
  setTimeout(() => {
    document.querySelectorAll('.stat-bar-fill').forEach(bar => {
      const w = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = w; }, 50);
    });
  }, 400);
}

// ============================================
// ADMIN DASHBOARD
// ============================================

function renderAdminDashboard() {
  const user = DB.getCurrentUser();
  if (!user || user.role !== 'admin') { navigateTo('auth'); return; }

  const allUsers = DB.getUsers();
  const employees = allUsers.filter(u => u.role === 'employee');
  const allLeaves = DB.getLeaves();
  const pendingLeaves = allLeaves.filter(l => l.status === 'pending');
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendance = DB.getAttendance().filter(a => a.date === todayDate);
  const presentToday = todayAttendance.filter(a => a.status === 'present' || a.status === 'half-day').length;

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNavbar(user)}
    <main class="main-content">
      <div class="dashboard-header">
        <div class="greeting-section">
          <h1>Admin Dashboard 🏢</h1>
          <p class="subtitle">${formatDate(todayDate)} &bull; HR Management Portal</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" onclick="navigateTo('leave')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
            Leave Requests
            ${pendingLeaves.length > 0 ? `<span class="badge">${pendingLeaves.length}</span>` : ''}
          </button>
        </div>
      </div>

      <div class="stats-grid admin-stats">
        <div class="stat-card glass-card" style="--accent: #6C5CE7">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${allUsers.length}</span>
            <span class="stat-label">Total Employees</span>
          </div>
        </div>
        
        <div class="stat-card glass-card" style="--accent: #00B894">
          <div class="stat-icon" style="background: rgba(0,184,148,0.15); color: #00B894">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${presentToday}</span>
            <span class="stat-label">Present Today</span>
          </div>
        </div>
        
        <div class="stat-card glass-card" style="--accent: #FDCB6E">
          <div class="stat-icon" style="background: rgba(253,203,110,0.15); color: #FDCB6E">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${pendingLeaves.length}</span>
            <span class="stat-label">Pending Approvals</span>
          </div>
        </div>
        
        <div class="stat-card glass-card" style="--accent: #E17055">
          <div class="stat-icon" style="background: rgba(225,112,85,0.15); color: #E17055">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${formatCurrency(employees.reduce((s, e) => s + (e.salary || 0), 0))}</span>
            <span class="stat-label">Total Payroll</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid admin-grid">
        <div class="dash-section glass-card employee-list-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Employee Directory
            </h3>
            <div class="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" id="employee-search" placeholder="Search employees..." oninput="filterEmployees(this.value)">
            </div>
          </div>
          <div class="employee-cards" id="employee-cards">
            ${renderEmployeeCards(allUsers)}
          </div>
        </div>

        <div class="dash-section glass-card">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Pending Leave Requests
          </h3>
          <div class="pending-leaves-list">
            ${renderPendingLeaves(pendingLeaves)}
          </div>
        </div>
      </div>
    </main>
  `;
  animateStatsOnLoad();
}

function renderEmployeeCards(users) {
  return users.map(emp => {
    const status = getEmployeeStatus(emp.id);
    const statusColors = {
      present: '#00B894', absent: '#E17055', 'half-day': '#FDCB6E', leave: '#0984E3'
    };
    return `
      <div class="employee-card" onclick="navigateTo('profile', '${emp.id}')">
        <div class="emp-avatar" style="background: ${emp.avatarColor || '#6C5CE7'}">
          ${getInitials(emp.name)}
          <span class="status-dot" style="background: ${statusColors[status] || '#b2bec3'}"></span>
        </div>
        <div class="emp-info">
          <span class="emp-name">${emp.name}</span>
          <span class="emp-role">${emp.designation}</span>
          <span class="emp-dept">${emp.department}</span>
        </div>
        <span class="emp-status-badge ${status}">${status}</span>
      </div>
    `;
  }).join('');
}

function filterEmployees(query) {
  const allUsers = DB.getUsers();
  const filtered = allUsers.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.department.toLowerCase().includes(query.toLowerCase()) ||
    u.designation.toLowerCase().includes(query.toLowerCase()) ||
    u.employeeId.toLowerCase().includes(query.toLowerCase())
  );
  document.getElementById('employee-cards').innerHTML = renderEmployeeCards(filtered);
}

function renderPendingLeaves(leaves) {
  if (leaves.length === 0) {
    return '<div class="empty-state">🎉 No pending requests!</div>';
  }
  return leaves.map(l => {
    const emp = DB.getUserById(l.userId);
    return `
      <div class="leave-request-card">
        <div class="leave-req-header">
          <div class="emp-avatar-sm" style="background: ${emp ? emp.avatarColor : '#6C5CE7'}">
            ${emp ? getInitials(emp.name) : '?'}
          </div>
          <div>
            <span class="leave-req-name">${l.employeeName}</span>
            <span class="leave-req-type">${l.type.charAt(0).toUpperCase() + l.type.slice(1)} Leave</span>
          </div>
        </div>
        <div class="leave-req-dates">
          📅 ${formatDate(l.startDate)} → ${formatDate(l.endDate)}
        </div>
        <div class="leave-req-reason">"${l.reason}"</div>
        <div class="leave-req-actions">
          <button class="btn btn-sm btn-success" onclick="handleLeaveAction('${l.id}', 'approved')">✓ Approve</button>
          <button class="btn btn-sm btn-danger" onclick="handleLeaveAction('${l.id}', 'rejected')">✗ Reject</button>
        </div>
      </div>
    `;
  }).join('');
}

function handleLeaveAction(leaveId, status) {
  DB.updateLeave(leaveId, { status: status, adminComment: `${status} by Admin` });
  showToast(`Leave request ${status}! ${status === 'approved' ? '✅' : '❌'}`, status === 'approved' ? 'success' : 'error');
  renderAdminDashboard();
}

function handleLogout() {
  DB.logout();
  showToast('Logged out successfully! 👋', 'info');
  navigateTo('auth');
}
