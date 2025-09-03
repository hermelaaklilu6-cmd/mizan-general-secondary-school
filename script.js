// Utility functions
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
function getResults() {
  return JSON.parse(localStorage.getItem('results') || '{}');
}
function setResults(results) {
  localStorage.setItem('results', JSON.stringify(results));
}
function getAttendance() {
  return JSON.parse(localStorage.getItem('attendance') || '{}');
}
function setAttendance(records) {
  localStorage.setItem('attendance', JSON.stringify(records));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}
function logoutUser() {
  localStorage.removeItem('currentUser');
}

// DOM Elements
const homeLink = document.getElementById('home-link');
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const mainContent = document.getElementById('main-content');
const heroSection = document.querySelector('.hero');
const getStartedBtn = document.getElementById('get-started-btn');

const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

const studentDashboard = document.getElementById('student-dashboard');
const studentName = document.getElementById('student-name');
const resultTableBody = document.querySelector('#result-table tbody');
const studentLogout = document.getElementById('student-logout');

const adminDashboard = document.getElementById('admin-dashboard');
const adminName = document.getElementById('admin-name');
const resultEntryForm = document.getElementById('result-entry-form');
const resultEntryError = document.getElementById('result-entry-error');
const adminStudentTableBody = document.querySelector('#admin-student-table tbody');
const adminLogout = document.getElementById('admin-logout');

const sidebarMarksAdder = document.getElementById('sidebar-marks-adder');
const sidebarAttendance = document.getElementById('sidebar-attendance');
const sidebarTopScorer = document.getElementById('sidebar-top-scorer');
const sidebarAllResults = document.getElementById('sidebar-all-results');

const adminSectionMarksAdder = document.getElementById('admin-section-marks-adder');
const adminSectionAttendance = document.getElementById('admin-section-attendance');
const adminSectionTopScorer = document.getElementById('admin-section-top-scorer');
const adminSectionAllResults = document.getElementById('admin-section-all-results');

const attendanceForm = document.getElementById('attendance-form');
const attendanceEntryError = document.getElementById('attendance-entry-error');
const attendanceTableBody = document.querySelector('#attendance-table tbody');
const topScorerTableBody = document.querySelector('#top-scorer-table tbody');
const adminDashboardCards = document.getElementById('admin-dashboard-cards');

// Add grade level to signup
const signupGradeLevel = document.createElement('select');
signupGradeLevel.id = 'signup-grade-level';
signupGradeLevel.required = true;
signupGradeLevel.innerHTML =
  '<option value="">Select Grade Level</option>' +
  '<option value="9">Grade 9</option>' +
  '<option value="10">Grade 10</option>' +
  '<option value="11">Grade 11</option>' +
  '<option value="12">Grade 12</option>';
const signupFormRef = document.getElementById('signup-form');
if (signupFormRef && !document.getElementById('signup-grade-level')) {
  const signupRole = document.getElementById('signup-role');
  signupFormRef.insertBefore(signupGradeLevel, signupRole.nextSibling);
}

// Page switching, unchanged
function showSection(section) {
  [heroSection, loginSection, signupSection, studentDashboard, adminDashboard].forEach(sec => {
    if (sec) sec.style.display = 'none';
  });
  if (section) section.style.display = 'block';
}

function updateNavForUser(user) {
  if (user) {
    loginLink.style.display = 'none';
    signupLink.style.display = 'none';
  } else {
    loginLink.style.display = '';
    signupLink.style.display = '';
  }
}

// Initial page load
function initPage() {
  let user = getCurrentUser();
  updateNavForUser(user);
  if (!user) {
    showSection(heroSection);
  } else if (user.role === 'student') {
    showSection(studentDashboard);
    renderStudentDashboard(user);
  } else if (user.role === 'admin') {
    showSection(adminDashboard);
    showAdminSection(adminSectionMarksAdder);
    renderAdminDashboard(user);
    renderAdminDashboardCards();
  }
}
initPage();

// Navigation events unchanged
homeLink.onclick = function() { initPage(); return false; };
loginLink.onclick = function() { showSection(loginSection); return false; };
signupLink.onclick = function() { showSection(signupSection); return false; };
getStartedBtn.onclick = function() { showSection(loginSection); };
if (showSignup) { showSignup.onclick = function() { showSection(signupSection); return false; }; }
if (showLogin) { showLogin.onclick = function() { showSection(loginSection); return false; }; }

// Admin Sidebar switching unchanged
function showAdminSection(section) {
  [adminSectionMarksAdder, adminSectionAttendance, adminSectionTopScorer, adminSectionAllResults].forEach(sec => {
    if (sec) sec.style.display = 'none';
  });
  section.style.display = 'block';
  [sidebarMarksAdder, sidebarAttendance, sidebarTopScorer, sidebarAllResults].forEach(link => {
    link.classList.remove('active');
  });
  if (section === adminSectionMarksAdder) sidebarMarksAdder.classList.add('active');
  else if (section === adminSectionAttendance) sidebarAttendance.classList.add('active');
  else if (section === adminSectionTopScorer) sidebarTopScorer.classList.add('active');
  else if (section === adminSectionAllResults) sidebarAllResults.classList.add('active');
  renderAdminDashboardCards();
}
sidebarMarksAdder.onclick = function() { showAdminSection(adminSectionMarksAdder); return false; };
sidebarAttendance.onclick = function() { showAdminSection(adminSectionAttendance); renderAttendanceTable(); return false; };
sidebarTopScorer.onclick = function() { showAdminSection(adminSectionTopScorer); renderTopScorerTable(); return false; };
sidebarAllResults.onclick = function() { showAdminSection(adminSectionAllResults); renderAdminDashboard(getCurrentUser()); return false; };

// Login Form Submit
loginForm.onsubmit = function(e) {
  e.preventDefault();
  let username = document.getElementById('login-username').value.trim();
  let password = document.getElementById('login-password').value;
  let users = getUsers();
  let user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    loginError.textContent = "Invalid username or password!";
    return;
  }
  setCurrentUser(user);
  loginError.textContent = "";
  updateNavForUser(user);
  if (user.role === 'student') {
    showSection(studentDashboard);
    renderStudentDashboard(user);
  } else {
    showSection(adminDashboard);
    showAdminSection(adminSectionMarksAdder);
    renderAdminDashboard(user);
    renderAdminDashboardCards();
  }
};

// Sign Up Form Submit (add grade level)
signupForm.onsubmit = function(e) {
  e.preventDefault();
  let name = document.getElementById('signup-name').value.trim();
  let username = document.getElementById('signup-username').value.trim();
  let password = document.getElementById('signup-password').value;
  let role = document.getElementById('signup-role').value;
  let gradeLevel = document.getElementById('signup-grade-level').value;
  if (!name || !username || !password || !role || (role === 'student' && !gradeLevel)) {
    signupError.textContent = "All fields are required!";
    return;
  }
  let users = getUsers();
  if (users.find(u => u.username === username)) {
    signupError.textContent = "Username already exists!";
    return;
  }
  let user = { name, username, password, role };
  if (role === 'student') user.gradeLevel = gradeLevel;
  users.push(user);
  setUsers(users);
  setCurrentUser(user);
  signupError.textContent = "";
  updateNavForUser(user);
  if (role === 'student') {
    showSection(studentDashboard);
    renderStudentDashboard(user);
  } else {
    showSection(adminDashboard);
    showAdminSection(adminSectionMarksAdder);
    renderAdminDashboard(user);
    renderAdminDashboardCards();
  }
};

// Student Dashboard (display grade level, total marks, and remove double subjects)
function renderStudentDashboard(user) {
  studentName.textContent = user.name + (user.gradeLevel ? " (Grade " + user.gradeLevel + ")" : "");
  let results = getResults()[user.username] || [];
  // Remove duplicate subjects (keep latest entry)
  let subjectMap = {};
  results.forEach(r => { subjectMap[r.subject] = r; });
  let uniqueResults = Object.values(subjectMap);

  // Calculate totals
  let totalSem1 = 0, totalSem2 = 0;
  let subjectCount = 0;
  uniqueResults.forEach(r => {
    totalSem1 += typeof r.sem1 === "number" ? r.sem1 : 0;
    totalSem2 += typeof r.sem2 === "number" ? r.sem2 : 0;
    subjectCount++;
  });

  resultTableBody.innerHTML = '';
  uniqueResults.forEach(r => {
    let avg = calcAvg(r.sem1, r.sem2);
    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.subject}</td>
      <td>${r.sem1 ?? '-'}</td>
      <td>${r.sem2 ?? '-'}</td>
      <td>${avg}</td>
      <td>${getStatus(avg)}</td>`;
    resultTableBody.appendChild(tr);
  });

  // Add totals row
  if (subjectCount > 0) {
    let tr = document.createElement('tr');
    tr.innerHTML = `<th>Total</th>
      <th>${totalSem1}</th>
      <th>${totalSem2}</th>
      <th>-</th>
      <th>-</th>`;
    resultTableBody.appendChild(tr);
  }
}

// Admin Dashboard (All results, show grade level, total marks, remove double subjects)
function renderAdminDashboard(user) {
  adminName.textContent = user.name;
  let users = getUsers();
  let results = getResults();
  adminStudentTableBody.innerHTML = '';
  users.forEach(u => {
    if (u.role === 'student') {
      let subjectsArr = [];
      let subjectMap = {};
      let subjResults = results[u.username] || [];
      subjResults.forEach(r => { subjectMap[r.subject] = r; });
      let uniqueResults = Object.values(subjectMap);
      let avgTotal = 0, totalSem1 = 0, totalSem2 = 0, count = 0;
      uniqueResults.forEach(r => {
        let avg = calcAvg(r.sem1, r.sem2);
        subjectsArr.push(`${r.subject}: [S1:${r.sem1 ?? '-'}, S2:${r.sem2 ?? '-'}, Avg:${avg}, ${getStatus(avg)}]`);
        avgTotal += avg;
        totalSem1 += typeof r.sem1 === "number" ? r.sem1 : 0;
        totalSem2 += typeof r.sem2 === "number" ? r.sem2 : 0;
        count++;
      });
      let overallAvg = count ? Math.round(avgTotal / count) : '-';
      let status = count ? getStatus(overallAvg) : '-';
      let tr = document.createElement('tr');
      tr.innerHTML = `<td>${u.username}</td>
        <td>${u.name}${u.gradeLevel ? " (Grade " + u.gradeLevel + ")" : ""}</td>
        <td>${u.role}</td>
        <td>${subjectsArr.join('<br>')}</td>
        <td>Sem1:${totalSem1} | Sem2:${totalSem2}</td>
        <td>${status}</td>`;
      adminStudentTableBody.appendChild(tr);
    }
  });
}

// Add/Update Results (Admin) - overwrite double subjects
resultEntryForm.onsubmit = function(e) {
  e.preventDefault();
  let studentUsername = document.getElementById('result-student-username').value.trim();
  let subject = document.getElementById('result-subject').value.trim();
  let sem1 = parseInt(document.getElementById('result-score-1').value);
  let sem2 = parseInt(document.getElementById('result-score-2').value);
  let users = getUsers();
  let student = users.find(u => u.username === studentUsername && u.role === 'student');
  if (!student) {
    resultEntryError.textContent = "Student username not found!";
    return;
  }
  if (!subject 
      || isNaN(sem1) || sem1 < 0 || sem1 > 100 
      || isNaN(sem2) || sem2 < 0 || sem2 > 100) {
    resultEntryError.textContent = "Enter valid subject and scores (0-100)!";
    return;
  }
  let results = getResults();
  if (!results[studentUsername]) results[studentUsername] = [];
  // Remove any previous entry for this subject
  results[studentUsername] = results[studentUsername].filter(r => r.subject !== subject);
  results[studentUsername].push({ subject, sem1, sem2 });
  setResults(results);
  resultEntryError.textContent = "";
  renderAdminDashboard(getCurrentUser());
  renderAdminDashboardCards();
};

// Attendance Form unchanged
attendanceForm.onsubmit = function(e) {
  e.preventDefault();
  let studentUsername = document.getElementById('attendance-student-username').value.trim();
  let daysPresent = parseInt(document.getElementById('attendance-days-present').value);
  let totalDays = parseInt(document.getElementById('attendance-total-days').value);
  let users = getUsers();
  let student = users.find(u => u.username === studentUsername && u.role === 'student');
  if (!student) {
    attendanceEntryError.textContent = "Student username not found!";
    return;
  }
  if (isNaN(daysPresent) || daysPresent < 0 || isNaN(totalDays) || totalDays < 1 || daysPresent > totalDays) {
    attendanceEntryError.textContent = "Enter valid attendance values!";
    return;
  }
  let attendance = getAttendance();
  attendance[studentUsername] = { daysPresent, totalDays };
  setAttendance(attendance);
  attendanceEntryError.textContent = "";
  renderAttendanceTable();
  renderAdminDashboardCards();
};

// Attendance Table unchanged
function renderAttendanceTable() {
  let users = getUsers();
  let attendance = getAttendance();
  attendanceTableBody.innerHTML = '';
  users.forEach(u => {
    if (u.role === 'student') {
      let rec = attendance[u.username];
      let daysPresent = rec ? rec.daysPresent : '-';
      let totalDays = rec ? rec.totalDays : '-';
      let percent = (rec && rec.totalDays > 0) ? Math.round(100 * rec.daysPresent / rec.totalDays) : '-';
      let tr = document.createElement('tr');
      tr.innerHTML = `<td>${u.username}</td>
        <td>${u.name}${u.gradeLevel ? " (Grade " + u.gradeLevel + ")" : ""}</td>
        <td>${daysPresent}</td>
        <td>${totalDays}</td>
        <td>${percent !== '-' ? percent + '%' : '-'}</td>`;
      attendanceTableBody.appendChild(tr);
    }
  });
}

// Top Scorer Table unchanged except showing grade
function renderTopScorerTable() {
  let users = getUsers();
  let results = getResults();
  let studentAvgs = [];
  users.forEach(u => {
    if (u.role === 'student') {
      let subjectMap = {};
      let subjResults = results[u.username] || [];
      subjResults.forEach(r => { subjectMap[r.subject] = r; });
      let uniqueResults = Object.values(subjectMap);
      let avgTotal = 0, count = 0;
      uniqueResults.forEach(r => {
        let avg = calcAvg(r.sem1, r.sem2);
        avgTotal += avg;
        count += 1;
      });
      let overallAvg = count ? Math.round(avgTotal / count) : null;
      if (overallAvg !== null) {
        studentAvgs.push({
          username: u.username,
          name: u.name + (u.gradeLevel ? " (Grade " + u.gradeLevel + ")" : ""),
          avg: overallAvg,
          status: getStatus(overallAvg)
        });
      }
    }
  });
  studentAvgs.sort((a, b) => b.avg - a.avg);
  topScorerTableBody.innerHTML = '';
  studentAvgs.slice(0, 5).forEach(s => {
    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.username}</td>
      <td>${s.name}</td>
      <td>${s.avg}</td>
      <td>${s.status}</td>`;
    topScorerTableBody.appendChild(tr);
  });
}

// Admin Dashboard Cards unchanged except showing total marks
function renderAdminDashboardCards() {
  if (!adminDashboardCards) return;
  let users = getUsers();
  let results = getResults();
  let topScorer = null, topAvg = -1;
  let studentCount = 0;
  let attendance = getAttendance();
  let totalAttendance = 0, totalPossibleAttendance = 0;
  let totalMarksSem1 = 0, totalMarksSem2 = 0;
  users.forEach(u => {
    if (u.role === 'student') {
      studentCount++;
      let subjectMap = {};
      let subjResults = results[u.username] || [];
      subjResults.forEach(r => { subjectMap[r.subject] = r; });
      let uniqueResults = Object.values(subjectMap);
      let avgTotal = 0, count = 0, sem1Sum = 0, sem2Sum = 0;
      uniqueResults.forEach(r => {
        let avg = calcAvg(r.sem1, r.sem2);
        avgTotal += avg;
        sem1Sum += typeof r.sem1 === "number" ? r.sem1 : 0;
        sem2Sum += typeof r.sem2 === "number" ? r.sem2 : 0;
        count += 1;
      });
      totalMarksSem1 += sem1Sum;
      totalMarksSem2 += sem2Sum;
      let overallAvg = count ? Math.round(avgTotal / count) : null;
      if (overallAvg !== null && overallAvg > topAvg) {
        topAvg = overallAvg;
        topScorer = { name: u.name + (u.gradeLevel ? " (Grade " + u.gradeLevel + ")" : ""), avg: topAvg };
      }
      let rec = attendance[u.username];
      if (rec && rec.totalDays > 0) {
        totalAttendance += rec.daysPresent;
        totalPossibleAttendance += rec.totalDays;
      }
    }
  });
  let attendanceRate = totalPossibleAttendance > 0 ? Math.round(100 * totalAttendance / totalPossibleAttendance) : "-";
  adminDashboardCards.innerHTML = `
    <div class="dashboard-card">
      <span class="icon"><i class="fas fa-trophy"></i></span>
      <div>
        <div style="font-weight:600;">Top Scorer</div>
        <div>${topScorer ? topScorer.name + " (" + topScorer.avg + ")" : "N/A"}</div>
      </div>
    </div>
    <div class="dashboard-card">
      <span class="icon"><i class="fas fa-users"></i></span>
      <div>
        <div style="font-weight:600;">Students</div>
        <div>${studentCount}</div>
      </div>
    </div>
    <div class="dashboard-card">
      <span class="icon"><i class="fas fa-calendar-check"></i></span>
      <div>
        <div style="font-weight:600;">Attendance Rate</div>
        <div>${attendanceRate !== "-" ? attendanceRate + "%" : "N/A"}</div>
      </div>
    </div>
    <div class="dashboard-card">
      <span class="icon"><i class="fas fa-calculator"></i></span>
      <div>
        <div style="font-weight:600;">Total Marks</div>
        <div>Sem1: ${totalMarksSem1} | Sem2: ${totalMarksSem2}</div>
      </div>
    </div>
  `;
}

// Logout unchanged
studentLogout.onclick = adminLogout.onclick = function() {
  logoutUser();
  updateNavForUser(null);
  showSection(heroSection);
};

// Helper functions
function calcAvg(a, b) {
  if (typeof a !== "number" || typeof b !== "number") return "-";
  return Math.round((a + b) / 2);
}
function getStatus(avg) {
  if (avg === "-" || avg === null) return "-";
  if (avg < 35) return 'Incomplete';
  if (avg < 50) return 'Fail';
  return 'Pass';
}

// Demo: If no admin exists, create a default admin
(function demoDefaultAdmin(){
  let users = getUsers();
  if (!users.find(u => u.role === 'admin')) {
    users.push({ name: "Principal", username: "admin", password: "admin123", role: "admin" });
    setUsers(users);
  }
})();