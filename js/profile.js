// ============================================
// PROFILE MODULE - Employee Profile with Tabs
// ============================================

function renderProfile(targetUserId) {
  const currentUser = DB.getCurrentUser();
  if (!currentUser) { navigateTo('auth'); return; }

  const viewingId = targetUserId || currentUser.id;
  const user = DB.getUserById(viewingId);
  if (!user) { navigateTo('dashboard'); return; }

  const isOwnProfile = viewingId === currentUser.id;
  const isAdmin = currentUser.role === 'admin';
  const canEdit = isOwnProfile || isAdmin;

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNavbar(currentUser)}
    <main class="main-content">
      <div class="profile-page">
        <div class="profile-header glass-card">
          <div class="profile-cover" style="background: linear-gradient(135deg, ${user.avatarColor || '#6C5CE7'}, ${user.avatarColor || '#6C5CE7'}88)">
            <div class="profile-avatar-large" style="background: ${user.avatarColor || '#6C5CE7'}">
              ${getInitials(user.name)}
            </div>
          </div>
          <div class="profile-header-info">
            <div class="profile-name-section">
              <h2>${user.name}</h2>
              <span class="role-badge ${user.role}">${user.role === 'admin' ? 'HR / Admin' : 'Employee'}</span>
            </div>
            <div class="profile-meta">
              <span>🏢 ${user.department}</span>
              <span>💼 ${user.designation}</span>
              <span>📍 ${user.location}</span>
              <span>📅 Joined ${formatDate(user.joinDate)}</span>
            </div>
            ${!isOwnProfile ? `
              <button class="btn btn-outline btn-sm" onclick="navigateTo('${currentUser.role === 'admin' ? 'admin-dashboard' : 'dashboard'}')">
                ← Back
              </button>
            ` : ''}
          </div>
        </div>

        <div class="profile-tabs">
          <button class="profile-tab active" onclick="switchProfileTab('resume', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
            Resume
          </button>
          <button class="profile-tab" onclick="switchProfileTab('private', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Private Info
          </button>
          <button class="profile-tab" onclick="switchProfileTab('salary', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Salary Info
          </button>
        </div>

        <div class="profile-content" id="profile-tab-content">
          ${renderResumeTab(user, canEdit)}
        </div>
      </div>
    </main>
  `;
}

function switchProfileTab(tab, btn) {
  document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  
  const content = document.getElementById('profile-tab-content');
  if (!content) return;
  
  content.style.opacity = '0';
  content.style.transform = 'translateY(10px)';
  
  const currentUser = DB.getCurrentUser();
  if (!currentUser) return;
  
  // Determine which user we're viewing
  const hash = window.location.hash;
  const parts = hash.split('/');
  const viewingId = (parts.length > 1 && parts[1]) ? parts[1] : currentUser.id;
  const user = DB.getUserById(viewingId) || currentUser;
  const isAdmin = currentUser.role === 'admin';
  const canEdit = viewingId === currentUser.id || isAdmin;
  
  setTimeout(() => {
    try {
      switch(tab) {
        case 'resume': content.innerHTML = renderResumeTab(user, canEdit); break;
        case 'private': content.innerHTML = renderPrivateTab(user, canEdit); break;
        case 'salary': content.innerHTML = renderSalaryTab(user, isAdmin); break;
      }
    } catch (err) {
      console.error("Error switching tab:", err);
      content.innerHTML = `<div class="error" style="color: var(--color-rejected); padding: 20px; text-align: center;">Failed to load tab content.</div>`;
    }
    requestAnimationFrame(() => {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    });
  }, 200);
}

function renderResumeTab(user, canEdit) {
  return `
    <div class="profile-section glass-card">
      <div class="section-header">
        <h3 class="section-title">About</h3>
        ${canEdit ? `<button class="btn btn-sm btn-outline" onclick="editProfileField('about', '${user.id}')">Edit</button>` : ''}
      </div>
      <p class="profile-about" id="field-about">${user.about || 'No description added yet.'}</p>
    </div>

    <div class="profile-section glass-card">
      <div class="section-header">
        <h3 class="section-title">Job Details</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Employee ID</span>
          <span class="info-value">${user.employeeId}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Department</span>
          <span class="info-value">${user.department}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Designation</span>
          <span class="info-value">${user.designation}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Manager</span>
          <span class="info-value">${user.manager}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Location</span>
          <span class="info-value">${user.location}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Joining Date</span>
          <span class="info-value">${formatDate(user.joinDate)}</span>
        </div>
      </div>
    </div>

    <div class="profile-row">
      <div class="profile-section glass-card">
        <div class="section-header">
          <h3 class="section-title">Skills</h3>
        </div>
        <div class="tags-list">
          ${(user.skills || []).map(s => `<span class="tag">${s}</span>`).join('') || '<span class="text-muted">No skills listed</span>'}
        </div>
      </div>
      <div class="profile-section glass-card">
        <div class="section-header">
          <h3 class="section-title">Certifications</h3>
        </div>
        <div class="tags-list">
          ${(user.certifications || []).map(c => `<span class="tag cert-tag">${c}</span>`).join('') || '<span class="text-muted">No certifications listed</span>'}
        </div>
      </div>
    </div>

    <div class="profile-section glass-card">
      <div class="section-header">
        <h3 class="section-title">Interests</h3>
      </div>
      <p>${user.interests || 'No interests added.'}</p>
    </div>
  `;
}

function renderPrivateTab(user, canEdit) {
  return `
    <div class="profile-section glass-card">
      <div class="section-header">
        <h3 class="section-title">Contact Information</h3>
        ${canEdit ? `<button class="btn btn-sm btn-outline" onclick="showEditContactModal('${user.id}')">Edit</button>` : ''}
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">${user.email}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Phone</span>
          <span class="info-value">${user.phone || 'Not provided'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Address</span>
          <span class="info-value">${user.address || 'Not provided'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Emergency Contact</span>
          <span class="info-value">${user.emergencyContact || 'Not provided'}</span>
        </div>
      </div>
    </div>

    <div class="profile-section glass-card">
      <div class="section-header">
        <h3 class="section-title">Financial Details</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Bank Account</span>
          <span class="info-value">${user.bankAccount || 'Not provided'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">PAN Number</span>
          <span class="info-value">${user.panNumber || 'Not provided'}</span>
        </div>
      </div>
    </div>
  `;
}

function renderSalaryTab(user, isAdmin) {
  const salary = user.salary || 0;
  // Salary breakdown as per Excalidraw: Basic 50%, HRA 25%, SA, PB, LTA, Fixed Allowance
  const basic = Math.round(salary * 0.50);
  const hra = Math.round(salary * 0.25);
  const specialAllowance = Math.round(salary * 0.08);
  const performanceBonus = Math.round(salary * 0.07);
  const lta = Math.round(salary * 0.05);
  const fixedAllowance = salary - basic - hra - specialAllowance - performanceBonus - lta;

  // Deductions: PF 12% of Basic, Professional Tax ₹200/month
  const pf = Math.round(basic * 0.12);
  const professionalTax = 200;
  const totalDeductions = pf + professionalTax;
  const netSalary = salary - totalDeductions;

  return `
    <div class="profile-section glass-card">
      <div class="section-header">
        <h3 class="section-title">Salary Structure</h3>
        ${isAdmin ? `<button class="btn btn-sm btn-outline" onclick="showEditSalaryModal('${user.id}')">Update Salary</button>` : ''}
      </div>
      <div class="salary-overview">
        <div class="salary-card gross">
          <span class="salary-card-label">Gross Salary</span>
          <span class="salary-card-value">${formatCurrency(salary)}</span>
          <span class="salary-card-sub">per month</span>
        </div>
        <div class="salary-card deductions">
          <span class="salary-card-label">Total Deductions</span>
          <span class="salary-card-value">- ${formatCurrency(totalDeductions)}</span>
        </div>
        <div class="salary-card net">
          <span class="salary-card-label">Net Salary</span>
          <span class="salary-card-value">${formatCurrency(netSalary)}</span>
          <span class="salary-card-sub">take home</span>
        </div>
      </div>
    </div>

    <div class="profile-row">
      <div class="profile-section glass-card">
        <h3 class="section-title">💰 Earnings Breakdown</h3>
        <div class="salary-breakdown">
          ${renderSalaryRow('Basic Salary (50%)', basic, salary)}
          ${renderSalaryRow('HRA (25%)', hra, salary)}
          ${renderSalaryRow('Special Allowance', specialAllowance, salary)}
          ${renderSalaryRow('Performance Bonus', performanceBonus, salary)}
          ${renderSalaryRow('LTA', lta, salary)}
          ${renderSalaryRow('Fixed Allowance', fixedAllowance, salary)}
        </div>
        <div class="salary-total">
          <span>Total Earnings</span>
          <span>${formatCurrency(salary)}</span>
        </div>
      </div>

      <div class="profile-section glass-card">
        <h3 class="section-title">📉 Deductions</h3>
        <div class="salary-breakdown">
          ${renderSalaryRow('Provident Fund (12% of Basic)', pf, totalDeductions)}
          ${renderSalaryRow('Professional Tax', professionalTax, totalDeductions)}
        </div>
        <div class="salary-total deduction-total">
          <span>Total Deductions</span>
          <span>${formatCurrency(totalDeductions)}</span>
        </div>
      </div>
    </div>

    <div class="profile-section glass-card">
      <h3 class="section-title">📊 Annual Projection</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Annual Gross</span>
          <span class="info-value">${formatCurrency(salary * 12)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Annual Deductions</span>
          <span class="info-value">${formatCurrency(totalDeductions * 12)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Annual Net (CTC)</span>
          <span class="info-value highlight">${formatCurrency(netSalary * 12)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderSalaryRow(label, amount, total) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return `
    <div class="salary-row">
      <span class="salary-row-label">${label}</span>
      <div class="salary-row-bar">
        <div class="salary-row-fill" style="width: ${pct}%"></div>
      </div>
      <span class="salary-row-amount">${formatCurrency(amount)}</span>
    </div>
  `;
}

// Edit modals
function showEditContactModal(userId) {
  const user = DB.getUserById(userId);
  showModal('Edit Contact Info', `
    <form onsubmit="saveContactInfo(event, '${userId}')">
      <div class="form-group">
        <label>Phone</label>
        <input type="text" id="edit-phone" value="${user.phone || ''}" placeholder="+91 XXXXX XXXXX">
      </div>
      <div class="form-group">
        <label>Address</label>
        <textarea id="edit-address" rows="2" placeholder="Enter address">${user.address || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Emergency Contact</label>
        <input type="text" id="edit-emergency" value="${user.emergencyContact || ''}" placeholder="+91 XXXXX XXXXX">
      </div>
      <button type="submit" class="btn btn-primary btn-full">Save Changes</button>
    </form>
  `);
}

function saveContactInfo(e, userId) {
  e.preventDefault();
  DB.updateUser(userId, {
    phone: document.getElementById('edit-phone').value,
    address: document.getElementById('edit-address').value,
    emergencyContact: document.getElementById('edit-emergency').value
  });
  closeModal();
  showToast('Contact info updated! ✅', 'success');
  renderProfile(userId);
}

function showEditSalaryModal(userId) {
  const user = DB.getUserById(userId);
  showModal('Update Salary', `
    <form onsubmit="saveSalary(event, '${userId}')">
      <div class="form-group">
        <label>Monthly Gross Salary (₹)</label>
        <input type="number" id="edit-salary" value="${user.salary || 0}" min="0" step="1000">
      </div>
      <p class="form-hint">All salary components will be recalculated automatically based on the standard structure.</p>
      <button type="submit" class="btn btn-primary btn-full">Update Salary</button>
    </form>
  `);
}

function saveSalary(e, userId) {
  e.preventDefault();
  const salary = parseInt(document.getElementById('edit-salary').value) || 0;
  DB.updateUser(userId, { salary });
  closeModal();
  showToast('Salary updated to ' + formatCurrency(salary) + '! ✅', 'success');
  renderProfile(userId);
}

function editProfileField(field, userId) {
  const user = DB.getUserById(userId);
  const currentValue = user[field] || '';
  
  showModal('Edit ' + field.charAt(0).toUpperCase() + field.slice(1), `
    <form onsubmit="saveProfileField(event, '${field}', '${userId}')">
      <div class="form-group">
        <label>${field.charAt(0).toUpperCase() + field.slice(1)}</label>
        <textarea id="edit-field-value" rows="4" placeholder="Enter ${field}">${currentValue}</textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-full">Save</button>
    </form>
  `);
}

function saveProfileField(e, field, userId) {
  e.preventDefault();
  const value = document.getElementById('edit-field-value').value;
  DB.updateUser(userId, { [field]: value });
  closeModal();
  showToast('Profile updated! ✅', 'success');
  renderProfile(userId);
}
