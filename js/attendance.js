// ============================================
// ATTENDANCE MODULE - Daily/Weekly/Monthly Views
// ============================================

function renderAttendance() {
  const currentUser = DB.getCurrentUser();
  if (!currentUser) { navigateTo('auth'); return; }

  const isAdmin = currentUser.role === 'admin';
  const selectedUserId = isAdmin ? (window._selectedAttendanceUser || currentUser.id) : currentUser.id;
  const user = DB.getUserById(selectedUserId);
  const attendance = DB.getAttendanceByUser(selectedUserId);
  
  // Current month calendar
  const now = new Date();
  const currentMonth = window._attendanceMonth || now.getMonth();
  const currentYear = window._attendanceYear || now.getFullYear();

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNavbar(currentUser)}
    <main class="main-content">
      <div class="page-header">
        <h1>📋 Attendance</h1>
        <p class="subtitle">${isAdmin ? 'Manage team attendance' : 'Your attendance records'}</p>
      </div>

      ${isAdmin ? `
        <div class="filter-bar glass-card">
          <label>Employee:</label>
          <div class="input-wrapper" style="width: 260px; min-width: 180px;">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <select id="attendance-user-select" onchange="changeAttendanceUser(this.value)">
              ${DB.getUsers().map(u => `
                <option value="${u.id}" ${u.id === selectedUserId ? 'selected' : ''}>${u.name} (${u.employeeId})</option>
              `).join('')}
            </select>
          </div>
        </div>
      ` : ''}

      <div class="attendance-overview">
        <div class="attendance-stats glass-card">
          ${renderAttendanceStats(attendance)}
        </div>
      </div>

      <div class="attendance-calendar glass-card">
        <div class="calendar-header">
          <button class="btn btn-icon" onclick="changeAttendanceMonth(-1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h3>${new Date(currentYear, currentMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h3>
          <button class="btn btn-icon" onclick="changeAttendanceMonth(1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        <div class="calendar-grid">
          <div class="calendar-day-header">Sun</div>
          <div class="calendar-day-header">Mon</div>
          <div class="calendar-day-header">Tue</div>
          <div class="calendar-day-header">Wed</div>
          <div class="calendar-day-header">Thu</div>
          <div class="calendar-day-header">Fri</div>
          <div class="calendar-day-header">Sat</div>
          ${renderCalendarDays(currentYear, currentMonth, attendance)}
        </div>
        <div class="calendar-legend">
          <span class="legend-item"><span class="legend-dot present"></span> Present</span>
          <span class="legend-item"><span class="legend-dot absent"></span> Absent</span>
          <span class="legend-item"><span class="legend-dot half-day"></span> Half-Day</span>
          <span class="legend-item"><span class="legend-dot leave"></span> Leave</span>
        </div>
      </div>

      <div class="attendance-table glass-card">
        <h3 class="section-title">Detailed Records</h3>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${renderAttendanceRows(attendance, currentYear, currentMonth)}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `;
}

function renderAttendanceStats(attendance) {
  const total = attendance.length;
  const present = attendance.filter(a => a.status === 'present').length;
  const absent = attendance.filter(a => a.status === 'absent').length;
  const halfDay = attendance.filter(a => a.status === 'half-day').length;
  const onLeave = attendance.filter(a => a.status === 'leave').length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return `
    <div class="att-stat">
      <div class="att-stat-circle" style="--percent: ${rate}; --color: #6C5CE7">
        <svg viewBox="0 0 36 36">
          <path d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
          <path d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="#6C5CE7" stroke-width="3"
            stroke-dasharray="${rate}, 100"
            stroke-linecap="round"/>
        </svg>
        <span class="att-stat-percent">${rate}%</span>
      </div>
      <span class="att-stat-label">Attendance Rate</span>
    </div>
    <div class="att-stat-list">
      <div class="att-stat-item">
        <span class="att-dot present"></span>
        <span>Present</span>
        <span class="att-count">${present}</span>
      </div>
      <div class="att-stat-item">
        <span class="att-dot absent"></span>
        <span>Absent</span>
        <span class="att-count">${absent}</span>
      </div>
      <div class="att-stat-item">
        <span class="att-dot half-day"></span>
        <span>Half-Day</span>
        <span class="att-count">${halfDay}</span>
      </div>
      <div class="att-stat-item">
        <span class="att-dot leave"></span>
        <span>On Leave</span>
        <span class="att-count">${onLeave}</span>
      </div>
    </div>
  `;
}

function renderCalendarDays(year, month, attendance) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];
  
  let html = '';
  
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day empty"></div>';
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const record = attendance.find(a => a.date === dateStr);
    const isToday = dateStr === today;
    const dayOfWeek = new Date(year, month, d).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let statusClass = '';
    let statusIcon = '';
    
    if (record) {
      statusClass = record.status;
      switch(record.status) {
        case 'present': statusIcon = '✓'; break;
        case 'absent': statusIcon = '✗'; break;
        case 'half-day': statusIcon = '½'; break;
        case 'leave': statusIcon = '✈'; break;
      }
    } else if (isWeekend) {
      statusClass = 'weekend';
    }
    
    html += `
      <div class="calendar-day ${statusClass} ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}">
        <span class="calendar-day-num">${d}</span>
        ${statusIcon ? `<span class="calendar-day-icon">${statusIcon}</span>` : ''}
      </div>
    `;
  }
  
  return html;
}

function renderAttendanceRows(attendance, year, month) {
  const monthRecords = attendance
    .filter(a => {
      const d = new Date(a.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (monthRecords.length === 0) {
    return '<tr><td colspan="6" class="empty-state">No records for this month</td></tr>';
  }
  
  return monthRecords.map(a => {
    const date = new Date(a.date);
    const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
    
    let hours = '-';
    if (a.checkIn && a.checkOut) {
      const [inH, inM] = a.checkIn.split(':').map(Number);
      const [outH, outM] = a.checkOut.split(':').map(Number);
      const totalMins = (outH * 60 + outM) - (inH * 60 + inM);
      hours = `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`;
    }
    
    return `
      <tr>
        <td>${formatDate(a.date)}</td>
        <td>${dayName}</td>
        <td>${a.checkIn || '-'}</td>
        <td>${a.checkOut || '-'}</td>
        <td>${hours}</td>
        <td><span class="status-badge ${a.status}">${a.status}</span></td>
      </tr>
    `;
  }).join('');
}

function changeAttendanceUser(userId) {
  window._selectedAttendanceUser = userId;
  renderAttendance();
}

function changeAttendanceMonth(delta) {
  const now = new Date();
  let month = (window._attendanceMonth !== undefined ? window._attendanceMonth : now.getMonth()) + delta;
  let year = window._attendanceYear || now.getFullYear();
  
  if (month > 11) { month = 0; year++; }
  if (month < 0) { month = 11; year--; }
  
  window._attendanceMonth = month;
  window._attendanceYear = year;
  renderAttendance();
}
