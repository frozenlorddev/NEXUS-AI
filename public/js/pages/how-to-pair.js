function howToPairPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>How to <span class="gradient-text">Pair WhatsApp</span></h1>
          <p>Complete step-by-step guide to connect your WhatsApp with CyberByte AI</p>
        </div>

        <div class="steps-container">
          <div class="step-card">
            <div class="step-number">01</div>
            <div class="step-content">
              <h3>Enter Your Phone Number</h3>
              <p>Navigate to the <strong>Connect page</strong> and enter your WhatsApp number in international format. For example, if your number is 0712345678 in Kenya, enter <code>254712345678</code>. Make sure to include your country code without the '+' symbol.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">02</div>
            <div class="step-content">
              <h3>Click the Connect Button</h3>
              <p>After entering your number, click the <strong>"Connect Device"</strong> button. The system will generate a unique 8-digit pairing code for you. This process usually takes 2-5 seconds depending on server load.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">03</div>
            <div class="step-content">
              <h3>Copy Your Pairing Code</h3>
              <p>Once generated, you'll see an 8-digit code displayed on screen. Click the <strong>"Copy Code"</strong> button to save it to your clipboard. The code expires in 2 minutes for security reasons.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">04</div>
            <div class="step-content">
              <h3>Open WhatsApp</h3>
              <p>Open WhatsApp on your phone. Go to <strong>Settings → Linked Devices → Link a Device</strong>. This will open your camera to scan a QR code.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">05</div>
            <div class="step-content">
              <h3>Use Phone Number Instead</h3>
              <p>Instead of scanning the QR code, look for and tap the option that says <strong>"Link with phone number instead"</strong>. This is usually at the bottom of the screen.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">06</div>
            <div class="step-content">
              <h3>Enter the Pairing Code</h3>
              <p>Enter the 8-digit code you copied from our platform. Make sure to enter it correctly - the code is case-sensitive and must match exactly.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">07</div>
            <div class="step-content">
              <h3>Success! 🎉</h3>
              <p>Once you enter the code correctly, WhatsApp will link your device to our AI bot. You'll see your new session appear in the <strong>System Dashboard</strong> and <strong>Admin Panel</strong>. The session will persist even after server restarts.</p>
            </div>
          </div>
        </div>

        <div class="info-card" style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.5rem; margin-top: 2rem;">
          <h3>💡 Pro Tips</h3>
          <ul style="margin-top: 0.5rem; color: var(--muted);">
            <li>Make sure your WhatsApp is updated to the latest version</li>
            <li>The pairing code is valid for only 2 minutes - use it quickly</li>
            <li>You can have up to 90 active sessions simultaneously</li>
            <li>Sessions are automatically saved and restored on server restart</li>
            <li>Use the Admin Panel to manage and delete sessions</li>
            <li>For security, always log out from the Admin Panel when done</li>
          </ul>
        </div>

        <div class="chat-cta" style="margin-top: 2rem;">
          <div class="chat-icon">❓</div>
          <h3>Still Having Trouble?</h3>
          <p>Our support team is ready to help you with the pairing process</p>
          <button class="btn btn-primary" onclick="navigateTo('/support')">Get Support →</button>
        </div>
      </div>
    </div>
  `;
}