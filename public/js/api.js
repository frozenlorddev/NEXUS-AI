// API Base URL
const API_BASE = '';

// API Functions
async function fetchStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Failed to fetch status:', e);
    return null;
  }
}

async function fetchSessions() {
  try {
    const res = await fetch('/api/sessions');
    const data = await res.json();
    return data.sessions || [];
  } catch (e) {
    console.error('Failed to fetch sessions:', e);
    return [];
  }
}

async function connectSession(phone) {
  const res = await fetch('/api/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return await res.json();
}

async function deleteSession(phone, password) {
  const res = await fetch('/api/delsession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password })
  });
  return await res.json();
}

async function authenticate(password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  return await res.json();
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function formatSessionTime(timestamp) {
  if (!timestamp) return 'connected';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s uptime`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m uptime`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m uptime`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function showMessage(element, text, type) {
  if (!element) return;
  element.textContent = text;
  element.className = `status-msg msg-${type}`;
  element.style.display = 'block';
}