function connectPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>Connect <span class="gradient-text">WhatsApp Session</span></h1>
          <p>Pair a new WhatsApp device with your AI bot in seconds</p>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-dot"></div>
            New Connection
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>WhatsApp Number</label>
              <input type="tel" id="phoneInput" placeholder="254712345678" maxlength="20" inputmode="numeric" />
              <small>Include country code without '+' or spaces</small>
            </div>
            <button class="btn btn-primary" id="connectBtn">Connect Device</button>
            <div class="status-msg" id="statusMsg"></div>
            
            <div id="codeDisplay" style="display:none;">
              <div class="code-box">
                <div class="code-label">Your Pairing Code</div>
                <div class="code-value" id="codeVal">— — — —</div>
                <div class="code-actions">
                  <button class="btn btn-copy" id="copyCodeBtn">📋 Copy Code</button>
                </div>
                <div class="code-hint">
                  WhatsApp → Linked Devices → Link a Device → tap "Link with phone number instead"
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-card" style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.5rem;">
          <h3>⚡ Quick Tips</h3>
          <ul style="margin-top: 0.5rem; color: var(--muted);">
            <li>Use international format without the '+' symbol</li>
            <li>Code expires in 2 minutes if not used</li>
            <li>Session will persist across server restarts</li>
            <li>Maximum 90 concurrent sessions per server</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  const phoneInput = document.getElementById('phoneInput');
  const connectBtn = document.getElementById('connectBtn');
  const statusMsg = document.getElementById('statusMsg');
  const codeDisplay = document.getElementById('codeDisplay');
  
  connectBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim().replace(/\s+/g, '');
    
    if (!phone || !/^\d{7,15}$/.test(phone)) {
      showMessage(statusMsg, '⚠ Enter a valid number with country code', 'err');
      return;
    }
    
    connectBtn.disabled = true;
    connectBtn.innerHTML = '<div class="spinner"></div> Connecting...';
    codeDisplay.style.display = 'none';
    showMessage(statusMsg, '⏳ Creating session, please wait...', 'info');
    
    try {
      const data = await connectSession(phone);
      if (data.code) {
        document.getElementById('codeVal').textContent = data.code;
        codeDisplay.style.display = 'block';
        showMessage(statusMsg, '✓ Pairing code ready — enter it in WhatsApp now!', 'ok');
      } else {
        showMessage(statusMsg, '✗ ' + (data.error || 'Failed to generate code'), 'err');
      }
    } catch(e) {
      showMessage(statusMsg, '✗ Server error', 'err');
    }
    
    connectBtn.disabled = false;
    connectBtn.innerHTML = 'Connect Device';
  });
  
  document.getElementById('copyCodeBtn')?.addEventListener('click', () => {
    const code = document.getElementById('codeVal').textContent.trim();
    if (code && code !== '— — — —') {
      navigator.clipboard?.writeText(code).then(() => showToast('✓ Code copied!'));
    }
  });
  
  phoneInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') connectBtn.click();
  });
}