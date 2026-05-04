function systemPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>System <span class="gradient-text">Dashboard</span></h1>
          <p>Real-time monitoring and analytics</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📱</div>
            <div class="stat-label">Active Sessions</div>
            <div class="stat-value" id="sysSessions">—</div>
            <div class="stat-sub" id="sysSlots">— slots free</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-label">Server Uptime</div>
            <div class="stat-value" id="sysUptime">—</div>
            <div class="stat-sub">Since last restart</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💾</div>
            <div class="stat-label">Memory Usage</div>
            <div class="stat-value" id="sysMemory">—</div>
            <div class="stat-sub">Active processes</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-label">API Calls Today</div>
            <div class="stat-value" id="sysApiCalls">—</div>
            <div class="stat-sub">Last 24 hours</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-dot"></div>
            Session Capacity
          </div>
          <div class="card-body">
            <div class="capacity-container">
              <div class="capacity-info">
                <span>Current Usage</span>
                <strong id="capacityPercent">0%</strong>
              </div>
              <div class="capacity-bar">
                <div class="capacity-fill" id="capacityFill" style="width: 0%"></div>
              </div>
              <div class="capacity-stats">
                <span id="currentSessions">0</span>
                <span>/</span>
                <span id="maxSessions">90</span>
                <span>sessions</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-dot"></div>
            Active Sessions List
          </div>
          <div class="card-body">
            <div id="sessionList">Loading sessions...</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  async function loadSystemData() {
    const status = await fetchStatus();
    if (status) {
      const count = status.sessions || 0;
      const max = status.maxSessions || 90;
      const free = max - count;
      const pct = Math.round((count / max) * 100);
      
      document.getElementById('sysSessions').textContent = count;
      document.getElementById('sysSlots').textContent = free + ' slot' + (free !== 1 ? 's' : '') + ' free';
      document.getElementById('sysUptime').textContent = formatUptime(status.uptime || 0);
      document.getElementById('capacityPercent').textContent = pct + '%';
      document.getElementById('capacityFill').style.width = pct + '%';
      document.getElementById('currentSessions').textContent = count;
      document.getElementById('maxSessions').textContent = max;
      
      // Simulated metrics
      document.getElementById('sysMemory').textContent = (Math.random() * 2 + 0.5).toFixed(1) + ' GB';
      document.getElementById('sysApiCalls').textContent = Math.floor(Math.random() * 5000 + 1000);
    }
    
    const sessions = await fetchSessions();
    const listContainer = document.getElementById('sessionList');
    
    if (!sessions || sessions.length === 0) {
      listContainer.innerHTML = '<div class="empty-state">No active sessions found</div>';
      return;
    }
    
    listContainer.innerHTML = sessions.map(s => `
      <div class="session-item">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="session-dot"></div>
          <div>
            <div class="session-number">${s.phoneNumber}</div>
            <div class="session-meta">${formatSessionTime(s.connectedAt)}</div>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  loadSystemData();
  setInterval(loadSystemData, 10000);
}