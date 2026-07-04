// ============================================
// PAYROLL MODULE - Salary/Payroll Views
// ============================================

function renderPayroll() {
  const currentUser = DB.getCurrentUser();
  if (!currentUser) { navigateTo('auth'); return; }

  const isAdmin = currentUser.role === 'admin';
  
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNavbar(currentUser)}
    <main class="main-content">
      <div class="page-header">
        <h1>💰 Payroll</h1>
        <p class="subtitle">${isAdmin ? 'Manage employee payroll' : 'Your salary details'}</p>
      </div>

      ${isAdmin ? renderAdminPayroll() : renderEmployeePayroll(currentUser)}
    </main>
  `;
}

function renderEmployeePayroll(user) {
  const salary = user.salary || 0;
  const basic = Math.round(salary * 0.50);
  const hra = Math.round(salary * 0.25);
  const specialAllowance = Math.round(salary * 0.08);
  const performanceBonus = Math.round(salary * 0.07);
  const lta = Math.round(salary * 0.05);
  const fixedAllowance = salary - basic - hra - specialAllowance - performanceBonus - lta;
  const pf = Math.round(basic * 0.12);
  const professionalTax = 200;
  const totalDeductions = pf + professionalTax;
  const netSalary = salary - totalDeductions;

  return `
    <div class="payroll-summary">
      <div class="payslip glass-card">
        <div class="payslip-header">
          <div class="payslip-company">
            <h3>HRMS Corporation</h3>
            <p>Payslip for ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div class="payslip-emp">
            <p><strong>${user.name}</strong></p>
            <p>${user.employeeId} · ${user.department}</p>
          </div>
        </div>
        
        <div class="payslip-body">
          <div class="payslip-col">
            <h4>Earnings</h4>
            <div class="payslip-items">
              <div class="payslip-item"><span>Basic Salary</span><span>${formatCurrency(basic)}</span></div>
              <div class="payslip-item"><span>HRA</span><span>${formatCurrency(hra)}</span></div>
              <div class="payslip-item"><span>Special Allowance</span><span>${formatCurrency(specialAllowance)}</span></div>
              <div class="payslip-item"><span>Performance Bonus</span><span>${formatCurrency(performanceBonus)}</span></div>
              <div class="payslip-item"><span>LTA</span><span>${formatCurrency(lta)}</span></div>
              <div class="payslip-item"><span>Fixed Allowance</span><span>${formatCurrency(fixedAllowance)}</span></div>
            </div>
            <div class="payslip-total">
              <span>Total Earnings</span><span>${formatCurrency(salary)}</span>
            </div>
          </div>
          <div class="payslip-col">
            <h4>Deductions</h4>
            <div class="payslip-items">
              <div class="payslip-item"><span>Provident Fund</span><span>${formatCurrency(pf)}</span></div>
              <div class="payslip-item"><span>Professional Tax</span><span>${formatCurrency(professionalTax)}</span></div>
            </div>
            <div class="payslip-total deduction">
              <span>Total Deductions</span><span>${formatCurrency(totalDeductions)}</span>
            </div>
          </div>
        </div>
        
        <div class="payslip-footer">
          <div class="net-pay">
            <span>Net Pay</span>
            <span class="net-pay-amount">${formatCurrency(netSalary)}</span>
          </div>
          <p class="payslip-note">This is a system-generated payslip. For queries, contact HR.</p>
        </div>
      </div>
    </div>

    <div class="payroll-chart glass-card">
      <h3 class="section-title">Salary Distribution</h3>
      <div class="donut-chart-container">
        <div class="donut-chart">
          ${renderDonutChart([
            { label: 'Basic', value: basic, color: '#6C5CE7' },
            { label: 'HRA', value: hra, color: '#00B894' },
            { label: 'Special Allow.', value: specialAllowance, color: '#FDCB6E' },
            { label: 'Perf. Bonus', value: performanceBonus, color: '#E17055' },
            { label: 'LTA', value: lta, color: '#0984E3' },
            { label: 'Fixed Allow.', value: fixedAllowance, color: '#E84393' },
          ], salary, netSalary)}
        </div>
        <div class="donut-legend">
          ${[
            { label: 'Basic (50%)', color: '#6C5CE7', value: basic },
            { label: 'HRA (25%)', color: '#00B894', value: hra },
            { label: 'Special Allow.', color: '#FDCB6E', value: specialAllowance },
            { label: 'Perf. Bonus', color: '#E17055', value: performanceBonus },
            { label: 'LTA', color: '#0984E3', value: lta },
            { label: 'Fixed Allow.', color: '#E84393', value: fixedAllowance },
          ].map(item => `
            <div class="legend-row">
              <span class="legend-color" style="background: ${item.color}"></span>
              <span class="legend-label">${item.label}</span>
              <span class="legend-value">${formatCurrency(item.value)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderDonutChart(segments, total, netPay) {
  let cumulativePercent = 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  return `
    <svg viewBox="0 0 200 200" class="donut-svg">
      ${segments.map(seg => {
        const percent = (seg.value / total) * 100;
        const dashLength = (percent / 100) * circumference;
        const dashOffset = -(cumulativePercent / 100) * circumference;
        cumulativePercent += percent;
        
        return `
          <circle cx="100" cy="100" r="${radius}" fill="none" 
            stroke="${seg.color}" stroke-width="24"
            stroke-dasharray="${dashLength} ${circumference - dashLength}"
            stroke-dashoffset="${dashOffset}"
            transform="rotate(-90 100 100)"
            style="transition: stroke-dasharray 0.8s ease"/>
        `;
      }).join('')}
      <text x="100" y="95" text-anchor="middle" fill="var(--text)" font-size="14" font-weight="600">Net Pay</text>
      <text x="100" y="115" text-anchor="middle" fill="var(--text-accent)" font-size="12">${formatCurrency(netPay)}</text>
    </svg>
  `;
}

function renderAdminPayroll() {
  const employees = DB.getUsers().filter(u => u.role === 'employee');
  const totalPayroll = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  const avgSalary = employees.length > 0 ? Math.round(totalPayroll / employees.length) : 0;

  return `
    <div class="payroll-admin-stats">
      <div class="stat-card glass-card" style="--accent: #6C5CE7">
        <div class="stat-info">
          <span class="stat-value">${formatCurrency(totalPayroll)}</span>
          <span class="stat-label">Monthly Payroll</span>
        </div>
      </div>
      <div class="stat-card glass-card" style="--accent: #00B894">
        <div class="stat-info">
          <span class="stat-value">${formatCurrency(avgSalary)}</span>
          <span class="stat-label">Average Salary</span>
        </div>
      </div>
      <div class="stat-card glass-card" style="--accent: #E17055">
        <div class="stat-info">
          <span class="stat-value">${formatCurrency(totalPayroll * 12)}</span>
          <span class="stat-label">Annual Payroll</span>
        </div>
      </div>
    </div>

    <div class="glass-card">
      <h3 class="section-title">Employee Payroll Details</h3>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>ID</th>
              <th>Department</th>
              <th>Gross Salary</th>
              <th>PF</th>
              <th>Prof. Tax</th>
              <th>Net Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${DB.getUsers().map(emp => {
              const basic = Math.round((emp.salary || 0) * 0.50);
              const pf = Math.round(basic * 0.12);
              const pt = 200;
              const net = (emp.salary || 0) - pf - pt;
              return `
                <tr>
                  <td>
                    <div class="table-emp">
                      <div class="emp-avatar-sm" style="background: ${emp.avatarColor}">${getInitials(emp.name)}</div>
                      <span>${emp.name}</span>
                    </div>
                  </td>
                  <td>${emp.employeeId}</td>
                  <td>${emp.department}</td>
                  <td>${formatCurrency(emp.salary || 0)}</td>
                  <td>${formatCurrency(pf)}</td>
                  <td>${formatCurrency(pt)}</td>
                  <td><strong>${formatCurrency(net)}</strong></td>
                  <td>
                    <button class="btn btn-sm btn-outline" onclick="showEditSalaryModal('${emp.id}')">Edit</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
