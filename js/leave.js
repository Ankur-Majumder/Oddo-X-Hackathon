// ============================================
// LEAVE MODULE - Apply & Manage Leave Requests
// ============================================

function renderLeave() {
  const currentUser = DB.getCurrentUser();
  if (!currentUser) { navigateTo('auth'); return; }

  const isAdmin = currentUser.role === 'admin';
  
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNavbar(currentUser)}
    <main class="main-content">
      <div class="page-header">
        <h1>🏖️ Leave & Time-Off</h1>
        <p class="subtitle">${isAdmin ? 'Manage all leave requests' : 'Apply and track your leaves'}</p>
      </div>

      ${isAdmin ? renderAdminLeaveView() : renderEmployeeLeaveView(currentUser)}
    </main>
  `;
}

function renderEmployeeLeaveView(user) {
  const leaves = DB.getLeavesByUser(user.id);
  const pending = leaves.filter(l => l.status === 'pending').length;
  const approved = leaves.filter(l => l.status === 'approved').length;
  const rejected = leaves.filter(l => l.status === 'rejected').length;

  return `
    <div class="leave-stats-row">
      <div class="leave-stat glass-card" style="--accent: #FDCB6E">
        <span class="leave-stat-value">${pending}</span>
        <span class="leave-stat-label">Pending</span>
      </div>
      <div class="leave-stat glass-card" style="--accent: #00B894">
        <span class="leave-stat-value">${approved}</span>
        <span class="leave-stat-label">Approved</span>
      </div>
      <div class="leave-stat glass-card" style="--accent: #E17055">
        <span class="leave-stat-value">${rejected}</span>
        <span class="leave-stat-label">Rejected</span>
      </div>
    </div>

    <div class="leave-grid">
      <div class="leave-apply glass-card">
        <h3 class="section-title">Apply for Leave</h3>
        <form onsubmit="handleApplyLeave(event)" id="leave-form">
          <div class="form-group">
            <label>Leave Type</label>
            <div class="leave-type-pills">
              <label class="leave-pill">
                <input type="radio" name="leave-type" value="paid" checked>
                <span class="pill paid-pill">💰 Paid Leave</span>
              </label>
              <label class="leave-pill">
                <input type="radio" name="leave-type" value="sick">
                <span class="pill sick-pill">🏥 Sick Leave</span>
              </label>
              <label class="leave-pill">
                <input type="radio" name="leave-type" value="unpaid">
                <span class="pill unpaid-pill">📋 Unpaid Leave</span>
              </label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Start Date</label>
              <input type="date" id="leave-start" required>
            </div>
            <div class="form-group">
              <label>End Date</label>
              <input type="date" id="leave-end" required>
            </div>
          </div>
          <div class="form-group">
            <label>Reason / Remarks</label>
            <textarea id="leave-reason" rows="3" placeholder="Enter reason for leave..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Submit Leave Request</button>
        </form>
      </div>

      <div class="leave-calendar glass-card">
        <h3 class="section-title">📅 Leave Calendar</h3>
        ${renderLeaveCalendar(user.id)}
      </div>
    </div>

    <div class="leave-history glass-card">
      <h3 class="section-title">Leave History</h3>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Applied On</th>
            </tr>
          </thead>
          <tbody>
            ${renderLeaveRows(leaves)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminLeaveView() {
  const allLeaves = DB.getLeaves();
  const pendingLeaves = allLeaves.filter(l => l.status === 'pending');
  const processedLeaves = allLeaves.filter(l => l.status !== 'pending');

  return `
    <div class="leave-stats-row">
      <div class="leave-stat glass-card" style="--accent: #FDCB6E">
        <span class="leave-stat-value">${pendingLeaves.length}</span>
        <span class="leave-stat-label">Pending Review</span>
      </div>
      <div class="leave-stat glass-card" style="--accent: #00B894">
        <span class="leave-stat-value">${allLeaves.filter(l => l.status === 'approved').length}</span>
        <span class="leave-stat-label">Approved</span>
      </div>
      <div class="leave-stat glass-card" style="--accent: #E17055">
        <span class="leave-stat-value">${allLeaves.filter(l => l.status === 'rejected').length}</span>
        <span class="leave-stat-label">Rejected</span>
      </div>
    </div>

    ${pendingLeaves.length > 0 ? `
      <div class="glass-card">
        <h3 class="section-title">⏳ Pending Requests</h3>
        <div class="admin-leave-grid">
          ${pendingLeaves.map(l => {
            const emp = DB.getUserById(l.userId);
            return `
              <div class="admin-leave-card">
                <div class="admin-leave-header">
                  <div class="emp-avatar-sm" style="background: ${emp ? emp.avatarColor : '#6C5CE7'}">
                    ${emp ? getInitials(emp.name) : '?'}
                  </div>
                  <div class="admin-leave-info">
                    <span class="admin-leave-name">${l.employeeName}</span>
                    <span class="admin-leave-dept">${emp ? emp.department : ''} · ${emp ? emp.designation : ''}</span>
                  </div>
                  <span class="leave-type-badge ${l.type}">${l.type}</span>
                </div>
                <div class="admin-leave-body">
                  <div class="admin-leave-dates">
                    <span>📅 ${formatDate(l.startDate)}</span>
                    <span>→</span>
                    <span>${formatDate(l.endDate)}</span>
                    <span class="leave-days">${getDaysBetween(l.startDate, l.endDate)} days</span>
                  </div>
                  <p class="admin-leave-reason">"${l.reason}"</p>
                </div>
                <div class="admin-leave-actions">
                  <div class="form-group compact">
                    <input type="text" id="comment-${l.id}" placeholder="Add comment (optional)">
                  </div>
                  <div class="btn-group">
                    <button class="btn btn-success" onclick="processLeave('${l.id}', 'approved')">
                      ✓ Approve
                    </button>
                    <button class="btn btn-danger" onclick="processLeave('${l.id}', 'rejected')">
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : '<div class="glass-card empty-state">🎉 No pending leave requests!</div>'}

    <div class="glass-card">
      <h3 class="section-title">📋 All Leave Records</h3>
      <div class="filter-bar">
        <div class="input-wrapper" style="width: 180px;">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
          </svg>
          <select onchange="filterLeaveStatus(this.value)" id="leave-status-filter">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="data-table" id="admin-leave-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${allLeaves.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)).map(l => `
              <tr>
                <td>${l.employeeName}</td>
                <td><span class="leave-type-badge ${l.type}">${l.type}</span></td>
                <td>${formatDate(l.startDate)}</td>
                <td>${formatDate(l.endDate)}</td>
                <td>${getDaysBetween(l.startDate, l.endDate)}</td>
                <td>${l.reason}</td>
                <td><span class="status-badge ${l.status}">${l.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLeaveCalendar(userId) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.toISOString().split('T')[0];
  
  const leaves = DB.getLeavesByUser(userId).filter(l => l.status === 'approved');
  const attendance = DB.getAttendanceByUser(userId);
  
  let html = `
    <div class="mini-cal-header">
      <span>${new Date(year, month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
    </div>
    <div class="mini-cal-grid">
      <span class="mini-cal-day-h">S</span><span class="mini-cal-day-h">M</span><span class="mini-cal-day-h">T</span>
      <span class="mini-cal-day-h">W</span><span class="mini-cal-day-h">T</span><span class="mini-cal-day-h">F</span><span class="mini-cal-day-h">S</span>
  `;
  
  for (let i = 0; i < firstDay; i++) html += '<span class="mini-cal-day empty"></span>';
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === today;
    const isOnLeave = leaves.some(l => l.startDate <= dateStr && l.endDate >= dateStr);
    const attRecord = attendance.find(a => a.date === dateStr);
    const isWeekend = new Date(year, month, d).getDay() === 0 || new Date(year, month, d).getDay() === 6;
    
    let cls = '';
    if (isOnLeave) cls = 'on-leave';
    else if (attRecord) cls = attRecord.status;
    else if (isWeekend) cls = 'weekend';
    
    html += `<span class="mini-cal-day ${cls} ${isToday ? 'today' : ''}">${d}</span>`;
  }
  
  html += '</div>';
  html += `
    <div class="calendar-legend mini">
      <span class="legend-item"><span class="legend-dot present"></span>Present</span>
      <span class="legend-item"><span class="legend-dot absent"></span>Absent</span>
      <span class="legend-item"><span class="legend-dot on-leave"></span>Leave</span>
    </div>
  `;
  
  return html;
}

function renderLeaveRows(leaves) {
  if (leaves.length === 0) {
    return '<tr><td colspan="7" class="empty-state">No leave records found</td></tr>';
  }
  
  return leaves.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)).map(l => `
    <tr>
      <td><span class="leave-type-badge ${l.type}">${l.type}</span></td>
      <td>${formatDate(l.startDate)}</td>
      <td>${formatDate(l.endDate)}</td>
      <td>${getDaysBetween(l.startDate, l.endDate)}</td>
      <td>${l.reason}</td>
      <td><span class="status-badge ${l.status}">${l.status}</span></td>
      <td>${formatDate(l.appliedOn)}</td>
    </tr>
  `).join('');
}

function getDaysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
}

function handleApplyLeave(e) {
  e.preventDefault();
  const user = DB.getCurrentUser();
  const type = document.querySelector('input[name="leave-type"]:checked').value;
  const startDate = document.getElementById('leave-start').value;
  const endDate = document.getElementById('leave-end').value;
  const reason = document.getElementById('leave-reason').value;
  
  if (new Date(endDate) < new Date(startDate)) {
    showToast('End date cannot be before start date! ❌', 'error');
    return;
  }
  
  DB.addLeave({
    id: DB.genId(),
    userId: user.id,
    employeeName: user.name,
    type: type,
    startDate: startDate,
    endDate: endDate,
    reason: reason,
    status: 'pending',
    adminComment: '',
    appliedOn: new Date().toISOString().split('T')[0]
  });
  
  showToast('Leave request submitted! ⏳', 'success');
  renderLeave();
}

function processLeave(leaveId, status) {
  const commentEl = document.getElementById(`comment-${leaveId}`);
  const comment = commentEl ? commentEl.value : '';
  
  DB.updateLeave(leaveId, { 
    status: status, 
    adminComment: comment || `${status} by Admin on ${formatDate(new Date().toISOString().split('T')[0])}` 
  });
  
  showToast(`Leave ${status}! ${status === 'approved' ? '✅' : '❌'}`, status === 'approved' ? 'success' : 'error');
  renderLeave();
}

function filterLeaveStatus(status) {
  const rows = document.querySelectorAll('#admin-leave-table tbody tr');
  rows.forEach(row => {
    if (status === 'all') {
      row.style.display = '';
    } else {
      const badge = row.querySelector('.status-badge');
      row.style.display = badge && badge.textContent.trim() === status ? '' : 'none';
    }
  });
}
