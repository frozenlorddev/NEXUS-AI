function homePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="main-content">
      <section class="hero-section">
        <div class="hero-badge">🚀 Next-Gen WhatsApp AI</div>
        <h1 class="hero-title">Supercharge Your<br><span class="gradient-text">WhatsApp Experience</span></h1>
        <p class="hero-description">Enterprise-grade WhatsApp AI bot with advanced automation, multi-session support, and real-time analytics.</p>
        <div class="hero-buttons">
          <button class="btn btn-primary btn-large" onclick="navigateTo('/connect')">Get Started →</button>
          <button class="btn btn-outline btn-large" onclick="navigateTo('/how-to-pair')">Learn More</button>
        </div>
      </section>

      <div class="stats-overview">
        <div class="stat-card-large">
          <div class="stat-icon">📱</div>
          <div class="stat-number" id="homeSessions">—</div>
          <div class="stat-label">Active Sessions</div>
        </div>
        <div class="stat-card-large">
          <div class="stat-icon">⚡</div>
          <div class="stat-number" id="homeUptime">—</div>
          <div class="stat-label">Server Uptime</div>
        </div>
        <div class="stat-card-large">
          <div class="stat-icon">🎯</div>
          <div class="stat-number" id="homeCapacity">—</div>
          <div class="stat-label">Capacity Used</div>
        </div>
      </div>

      <div class="features-section">
        <h2 class="section-title">Powerful Features for <span class="gradient-text">Modern Business</span></h2>
        <div class="features-grid">
          <div class="feature-card"><div class="feature-icon">🤖</div><h3>AI-Powered Responses</h3><p>Intelligent conversation handling with contextual awareness.</p></div>
          <div class="feature-card"><div class="feature-icon">📊</div><h3>Analytics Dashboard</h3><p>Real-time metrics and performance monitoring.</p></div>
          <div class="feature-card"><div class="feature-icon">🔗</div><h3>Multi-Session Support</h3><p>Handle up to 90 simultaneous WhatsApp sessions.</p></div>
          <div class="feature-card"><div class="feature-icon">🛡️</div><h3>Enterprise Security</h3><p>End-to-end encryption and secure authentication.</p></div>
          <div class="feature-card"><div class="feature-icon">⚡</div><h3>99.9% Uptime</h3><p>Reliable infrastructure with automatic failover.</p></div>
          <div class="feature-card"><div class="feature-icon">💬</div><h3>24/7 Support</h3><p>Dedicated support team for instant assistance.</p></div>
        </div>
      </div>

      <div class="chat-cta">
        <div class="chat-icon">🚀</div>
        <h3>Ready to Transform Your WhatsApp Communication?</h3>
        <p>Join thousands of businesses using CyberByte AI for intelligent WhatsApp automation</p>
        <button class="btn btn-primary btn-large" onclick="navigateTo('/connect')">Connect Now →</button>
      </div>
    </div>
  `;
  
  // Load stats
  if (sessionToken) {
    fetchStatus().then(data => {
      if (data) {
        document.getElementById('homeSessions').textContent = data.sessions || 0;
        document.getElementById('homeUptime').textContent = formatUptime(data.uptime || 0);
        const pct = Math.round(((data.sessions || 0) / (data.maxSessions || 90)) * 100);
        document.getElementById('homeCapacity').textContent = pct + '%';
      }
    });
  }
}