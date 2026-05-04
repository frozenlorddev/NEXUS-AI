function loginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo-large">🤖</div>
            <h1>CyberByte AI Bot</h1>
            <p>Enter your credentials to access the admin panel</p>
          </div>
          <form id="adminLoginForm" class="auth-form">
            <div class="form-group">
              <label>Username</label>
              <input type="text" id="adminUsername" placeholder="Enter your username" required />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="adminPassword" placeholder="Enter your password" required />
            </div>
            <div class="error-message" id="loginError"></div>
            <button type="submit" class="btn btn-primary btn-large">Login →</button>
          </form>
          <div class="auth-footer" style="text-align: center; margin-top: 1rem;">
            <p><a href="/" onclick="navigateTo('/')" style="color: var(--accent);">Return to Home</a></p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if (username === 'MzaziTe hInc' && password === '42246776') {
      sessionStorage.setItem('adminAuth', btoa(JSON.stringify({ username, password })));
      showToast('✓ Login successful!');
      navigateTo('/admin');
    } else {
      errorEl.textContent = 'Invalid credentials. Access denied.';
      errorEl.style.display = 'block';
    }
  });
}