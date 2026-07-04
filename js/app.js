// ============================================
// APP MODULE - Router, Navbar, Utilities
// ============================================

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  seedData();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
});

// ============================================
// ROUTER
// ============================================
function navigateTo(route, param) {
  window.location.hash = param ? `${route}/${param}` : route;
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '';
  const parts = hash.split('/');
  const route = parts[0];
  const param = parts[1];

  const user = DB.getCurrentUser();

  // Redirect to auth if not logged in
  if (!user && route !== 'auth' && route !== '') {
    navigateTo('auth');
    return;
  }

  // If logged in and on auth page, redirect to dashboard
  if (user && (route === 'auth' || route === '')) {
    navigateTo(user.role === 'admin' ? 'admin-dashboard' : 'dashboard');
    return;
  }

  // Reset scroll position
  window.scrollTo(0, 0);

  switch(route) {
    case 'auth': renderAuth(); break;
    case 'dashboard': renderDashboard(); break;
    case 'admin-dashboard': 
      renderAdminDashboard(); 
      if (param === 'employees') {
        setTimeout(() => {
          const el = document.querySelector('.employee-list-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      break;
    case 'profile': renderProfile(param); break;
    case 'attendance': renderAttendance(); break;
    case 'leave': renderLeave(); break;
    case 'payroll': renderPayroll(); break;
    default: 
      if (user) {
        navigateTo(user.role === 'admin' ? 'admin-dashboard' : 'dashboard');
      } else {
        renderAuth();
      }
  }
}

// ============================================
// NAVBAR
// ============================================
function renderNavbar(user) {
  const isAdmin = user.role === 'admin';
  const currentRoute = window.location.hash.slice(1).split('/')[0];
  const currentParam = window.location.hash.slice(1).split('/')[1] || '';
  
  return `
    <nav class="navbar glass-nav">
      <div class="nav-brand" onclick="navigateTo('${isAdmin ? 'admin-dashboard' : 'dashboard'}')">
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="url(#navLogoGrad)"/>
          <path d="M14 16h8v16h-8v-6h12v6h8V16h-8v6H14v-6z" fill="white" opacity="0.9"/>
          <defs>
            <linearGradient id="navLogoGrad" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stop-color="#6C5CE7"/>
              <stop offset="100%" stop-color="#a29bfe"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="nav-title">HRMS</span>
      </div>
      
      <div class="nav-links" id="nav-links">
        <a class="nav-link ${currentRoute === 'dashboard' || (currentRoute === 'admin-dashboard' && currentParam !== 'employees') ? 'active' : ''}" 
           href="${isAdmin ? '#admin-dashboard' : '#dashboard'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          <span>Dashboard</span>
        </a>
        ${isAdmin ? `
          <a class="nav-link ${currentRoute === 'admin-dashboard' && currentParam === 'employees' ? 'active' : ''}" href="#admin-dashboard/employees">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <span>Employees</span>
          </a>
        ` : ''}
        <a class="nav-link ${currentRoute === 'attendance' ? 'active' : ''}" href="#attendance">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Attendance</span>
        </a>
        <a class="nav-link ${currentRoute === 'leave' ? 'active' : ''}" href="#leave">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6"/>
          </svg>
          <span>Time Off</span>
        </a>
        <a class="nav-link ${currentRoute === 'payroll' ? 'active' : ''}" href="#payroll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          <span>Payroll</span>
        </a>
      </div>

      <div class="nav-right">
        <div class="nav-user" onclick="toggleUserMenu()">
          <div class="nav-avatar" style="background: ${user.avatarColor || '#6C5CE7'}">
            ${getInitials(user.name)}
          </div>
          <div class="nav-user-info">
            <span class="nav-user-name">${user.name}</span>
            <span class="nav-user-role">${user.role === 'admin' ? 'HR Admin' : 'Employee'}</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="user-menu" id="user-menu">
          <a class="menu-item" href="#profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            My Profile
          </a>
          <a class="menu-item" href="#payroll">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Payroll
          </a>
          <div class="menu-divider"></div>
          <a class="menu-item danger" onclick="handleLogout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </a>
        </div>
      </div>

      <button class="mobile-menu-btn" onclick="toggleMobileNav()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </nav>
  `;
}

function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  menu.classList.toggle('show');
  
  // Close on outside click
  setTimeout(() => {
    const handler = (e) => {
      if (!e.target.closest('.nav-user') && !e.target.closest('.user-menu')) {
        menu.classList.remove('show');
        document.removeEventListener('click', handler);
      }
    };
    document.addEventListener('click', handler);
  }, 0);
}

function toggleMobileNav() {
  document.getElementById('nav-links').classList.toggle('show');
}

// ============================================
// MODAL
// ============================================
function showModal(title, content) {
  const existing = document.getElementById('modal-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal glass-card">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="btn btn-icon" onclick="closeModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
