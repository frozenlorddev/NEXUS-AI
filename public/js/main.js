// Global state
let sessionToken = sessionStorage.getItem('panelAuth');

// Hamburger menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
});