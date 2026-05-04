function supportPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>Get <span class="gradient-text">Support</span></h1>
          <p>We're here to help you 24/7</p>
        </div>

        <div class="support-grid">
          <div class="support-card">
            <div class="support-icon">📢</div>
            <h3>WhatsApp Channel</h3>
            <p>Join our official WhatsApp channel for announcements</p>
            <button class="btn btn-outline" onclick="alert('WhatsApp channel: https://whatsapp.com/channel/cyberbyte')">Join Channel →</button>
          </div>
          <div class="support-card">
            <div class="support-icon">✈️</div>
            <h3>Telegram Channel</h3>
            <p>Get real-time updates on our Telegram channel</p>
            <button class="btn btn-outline" onclick="alert('Telegram channel: https://t.me/cyberbyteai')">Join Channel →</button>
          </div>
          <div class="support-card">
            <div class="support-icon">👥</div>
            <h3>WhatsApp Group</h3>
            <p>Connect with other users for community support</p>
            <button class="btn btn-outline" onclick="alert('WhatsApp group: Join link sent to your email')">Join Group →</button>
          </div>
          <div class="support-card">
            <div class="support-icon">👥</div>
            <h3>Telegram Group</h3>
            <p>Discuss features and get help from the community</p>
            <button class="btn btn-outline" onclick="alert('Telegram group: https://t.me/cyberbyteai_group')">Join Group →</button>
          </div>
          <div class="support-card">
            <div class="support-icon">📧</div>
            <h3>Email Support</h3>
            <p>For business inquiries and technical support</p>
            <a href="mailto:support@cyberbyteai.com" class="btn btn-outline">support@cyberbyteai.com</a>
          </div>
          <div class="support-card">
            <div class="support-icon">📚</div>
            <h3>Documentation</h3>
            <p>Read our detailed documentation and API references</p>
            <button class="btn btn-outline" onclick="navigateTo('/how-to-pair')">View Docs →</button>
          </div>
        </div>

        <div class="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-grid">
            <div class="faq-item"><h3>🔧 How do I get my pairing code?</h3><p>Enter your phone number on the Connect page, and your unique 8-digit code will appear instantly.</p></div>
            <div class="faq-item"><h3>⏱️ How long does the code last?</h3><p>The pairing code expires after 2 minutes for security reasons.</p></div>
            <div class="faq-item"><h3>📱 Can I use multiple numbers?</h3><p>Yes! You can connect up to 90 WhatsApp sessions simultaneously.</p></div>
            <div class="faq-item"><h3>🔒 Is my data secure?</h3><p>Absolutely. All sessions are encrypted and we never store your messages.</p></div>
            <div class="faq-item"><h3>💸 Is there a free trial?</h3><p>Contact our sales team for demo access and pricing information.</p></div>
            <div class="faq-item"><h3>⚡ What's the response time?</h3><p>Average response time is under 200ms for most operations.</p></div>
          </div>
        </div>

        <div class="chat-cta">
          <div class="chat-icon">💬</div>
          <h3>Need immediate assistance?</h3>
          <p>Our support team is available 24/7 to help you</p>
          <button class="btn btn-primary" onclick="alert('Live chat: Connect with an agent now')">Start Live Chat</button>
        </div>
      </div>
    </div>
  `;
}