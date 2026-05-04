let pendingDeletePhone = null;

function adminPage() {
  const adminAuth = sessionStorage.getItem('adminAuth');
  if (!adminAuth) {
    navigateTo('/login');
    return;
  }
  
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>Admin <span class="gradient-text">Control Panel</span></h1>
          <p>Manage sessions and monitor system health</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Sessions</div>
            <div class="stat-value" id="adminTotalSessions">—</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">System Health</div>
            <div class="stat-value" id="systemHealth">🟢</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-dot"></div>
            Session Management
          </div>
          <div class="card-body">
            <div id="adminSessionList">Loading sessions...</div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" id="deleteModal">
      <div class="modal">
        <div class="modal-title">🗑 Delete Session</div>
        <div class="modal-sub">This will immediately disconnect <span class="modal-phone" id="deletePhone"></span> and remove it from the database.</div>
        <div class="modal-error" id="modalError"></div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" id="deletePassword" placeholder="Enter your admin password" />
        </div>
        <div class="modal-buttons">
          <button class="btn btn-outline" id="cancelDeleteBtn">Cancel</button>
          <button class="btn btn-danger" id="confirmDeleteBtn">Delete Session</button>
        </div>
      </div>
    </div>
  `;
  
  async function loadAdminSessions() {
    const sessions = await fetchSessions();
    const container = document.getElementById('adminSessionList');
    
    if (!sessions || sessions.length === 0) {
      container.innerHTML = '<div class="empty-state">No active sessions found</div>';
      document.getElementById('adminTotalSessions').textContent = '0';
      return;
    }
    
    document.getElementById('adminTotalSessions').textContent = sessions.length;
    
    container.innerHTML = sessions.map(s => `
      <div class="admin-session-item">
        <div class="session-info">
          <div class="session-number">${s.phoneNumber}</div>
          <div class="session-meta">Connected: ${new Date(s.connectedAt).toLocaleString()}</div>
        </div>
        <button class="btn btn-danger btn-small" data-phone="${s.phoneNumber}" onclick="window.openDeleteModal('${s.phoneNumber}')">Delete</button>
      </div>
    `).join('');
  }
  
  window.openDeleteModal = (phone) => {
    pendingDeletePhone = phone;
    document.getElementById('deletePhone').textContent = phone;
    document.getElementById('deletePassword').value = '';
    document.getElementById('modalError').style.display = 'none';
    document.getElementById('deleteModal').classList.add('open');
  };
  
  function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('open');
    pendingDeletePhone = null;
  }
  
  window.confirmDelete = async () => {
    const password = document.getElementById('deletePassword').value;
    const btn = document.getElementById('confirmDeleteBtn');
    const err = document.getElementById('modalError');
    
    if (!password) return;
    
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Deleting...';
    err.style.display = 'none';
    
    try {
      const data = await deleteSession(pendingDeletePhone, password);
      if (data.ok) {
        closeDeleteModal();
        showToast('✓ Session deleted successfully');
        loadAdminSessions();
      } else {
        err.textContent = data.error || 'Failed to delete session';
        err.style.display = 'block';
      }
    } catch(e) {
      err.textContent = 'Server error. Please try again.';
      err.style.display = 'block';
    }
    
    btn.disabled = false;
    btn.innerHTML = 'Delete Session';
  };
  
  document.getElementById('cancelDeleteBtn')?.addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDeleteBtn')?.addEventListener('click', window.confirmDelete);
  document.getElementById('deleteModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
  });
  
  loadAdminSessions();
  setInterval(loadAdminSessions, 15000);
}