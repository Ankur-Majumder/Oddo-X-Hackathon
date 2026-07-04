// ============================================
// AUTH MODULE - Sign In / Sign Up
// ============================================

function renderAuth() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-branding">
          <div class="auth-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="url(#logoGrad)"/>
              <path d="M14 16h8v16h-8v-6h12v6h8V16h-8v6H14v-6z" fill="white" opacity="0.9"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stop-color="#6C5CE7"/>
                  <stop offset="100%" stop-color="#a29bfe"/>
                </linearGradient>
              </defs>
            </svg>
            <h1>HRMS</h1>
          </div>
          <p class="auth-tagline">Every workday, perfectly aligned.</p>
        </div>
        
        <div class="auth-card glass-card">
          <div class="auth-tabs">
            <button class="auth-tab active" id="tab-signin" onclick="switchAuthTab('signin')">Sign In</button>
            <button class="auth-tab" id="tab-signup" onclick="switchAuthTab('signup')">Sign Up</button>
          </div>
          
          <div id="auth-form-container">
            ${renderSignInForm()}
          </div>
        </div>

        <div class="auth-demo-info glass-card">
          <h4>🔑 Demo Credentials</h4>
          <div class="demo-creds">
            <div class="demo-cred" onclick="fillDemoCredentials('admin@hrms.com', 'Admin@123')">
              <span class="demo-role admin-badge">Admin</span>
              <span>admin@hrms.com / Admin@123</span>
            </div>
            <div class="demo-cred" onclick="fillDemoCredentials('priya@hrms.com', 'Priya@123')">
              <span class="demo-role emp-badge">Employee</span>
              <span>priya@hrms.com / Priya@123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSignInForm() {
  return `
    <form id="signin-form" onsubmit="handleSignIn(event)">
      <div class="form-group">
        <label for="signin-email">Email Address</label>
        <div class="input-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <path d="M22 6l-10 7L2 6"/>
          </svg>
          <input type="email" id="signin-email" placeholder="Enter your email" required>
        </div>
      </div>
      <div class="form-group">
        <label for="signin-password">Password</label>
        <div class="input-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input type="password" id="signin-password" placeholder="Enter your password" required>
          <button type="button" class="toggle-password" onclick="togglePassword('signin-password')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
      <div id="signin-error" class="form-error"></div>
      <button type="submit" class="btn btn-primary btn-full">
        <span>Sign In</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </form>
  `;
}

function renderSignUpForm() {
  return `
    <form id="signup-form" onsubmit="handleSignUp(event)">
      <div class="form-row">
        <div class="form-group">
          <label for="signup-name">Full Name</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <input type="text" id="signup-name" placeholder="Full name" required>
          </div>
        </div>
        <div class="form-group">
          <label for="signup-empid">Employee ID</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="18" rx="2"/>
              <path d="M9 10h6M9 14h6M9 6h6"/>
            </svg>
            <input type="text" id="signup-empid" placeholder="EMP009" required>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="signup-email">Email Address</label>
        <div class="input-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <path d="M22 6l-10 7L2 6"/>
          </svg>
          <input type="email" id="signup-email" placeholder="Enter your email" required>
        </div>
      </div>
      <div class="form-group">
        <label for="signup-password">Password</label>
        <div class="input-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input type="password" id="signup-password" placeholder="Min 6 chars, 1 uppercase, 1 number" required>
        </div>
        <div class="password-strength" id="password-strength"></div>
      </div>
      <div class="form-group">
        <label for="signup-role">Role</label>
        <div class="input-wrapper select-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <path d="M20 8v6M23 11h-6"/>
          </svg>
          <select id="signup-role" required>
            <option value="employee">Employee</option>
            <option value="admin">HR / Admin</option>
          </select>
        </div>
      </div>
      <div id="signup-error" class="form-error"></div>
      <button type="submit" class="btn btn-primary btn-full">
        <span>Create Account</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <path d="M20 8v6M23 11h-6"/>
        </svg>
      </button>
    </form>
  `;
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  
  const container = document.getElementById('auth-form-container');
  container.style.opacity = '0';
  container.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    container.innerHTML = tab === 'signin' ? renderSignInForm() : renderSignUpForm();
    requestAnimationFrame(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    });
  }, 200);
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

function fillDemoCredentials(email, password) {
  switchAuthTab('signin');
  setTimeout(() => {
    document.getElementById('signin-email').value = email;
    document.getElementById('signin-password').value = password;
    // Animate fill
    document.querySelectorAll('#signin-form .input-wrapper').forEach(w => {
      w.classList.add('input-filled');
      setTimeout(() => w.classList.remove('input-filled'), 600);
    });
  }, 250);
}

function validatePassword(password) {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return null;
}

function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  const errorEl = document.getElementById('signin-error');

  const user = DB.getUserByEmail(email);
  if (!user || user.password !== password) {
    errorEl.textContent = '❌ Invalid email or password. Please try again.';
    errorEl.style.display = 'block';
    shakeElement(document.querySelector('.auth-card'));
    return;
  }

  DB.setCurrentUser(user);
  showToast('Welcome back, ' + user.name.split(' ')[0] + '! 👋', 'success');
  
  setTimeout(() => {
    navigateTo(user.role === 'admin' ? 'admin-dashboard' : 'dashboard');
  }, 300);
}

function handleSignUp(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const empId = document.getElementById('signup-empid').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;
  const errorEl = document.getElementById('signup-error');

  // Validate
  const pwdError = validatePassword(password);
  if (pwdError) {
    errorEl.textContent = '❌ ' + pwdError;
    errorEl.style.display = 'block';
    return;
  }

  if (DB.getUserByEmail(email)) {
    errorEl.textContent = '❌ An account with this email already exists.';
    errorEl.style.display = 'block';
    return;
  }

  const avatarColors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#FDCB6E', '#E84393', '#00CEC9', '#FF7675'];
  
  const newUser = {
    id: DB.genId(),
    employeeId: empId,
    name: name,
    email: email,
    password: password,
    role: role,
    phone: '',
    department: 'Unassigned',
    designation: 'New Employee',
    manager: 'Unassigned',
    location: 'Unassigned',
    joinDate: new Date().toISOString().split('T')[0],
    salary: 0,
    about: '',
    interests: '',
    skills: [],
    certifications: [],
    avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
    address: '',
    emergencyContact: '',
    bankAccount: '',
    panNumber: ''
  };

  DB.addUser(newUser);
  DB.setCurrentUser(newUser);
  showToast('Account created successfully! Welcome, ' + name.split(' ')[0] + '! 🎉', 'success');
  
  setTimeout(() => {
    navigateTo(role === 'admin' ? 'admin-dashboard' : 'dashboard');
  }, 300);
}

function shakeElement(el) {
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 500);
}
