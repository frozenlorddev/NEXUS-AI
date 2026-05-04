const routes = {
  '/': homePage,
  '/login': loginPage,
  '/connect': connectPage,
  '/system': systemPage,
  '/support': supportPage,
  '/admin': adminPage,
  '/how-to-pair': howToPairPage
};

let currentRoute = '/';

function navigateTo(path) {
  if (routes[path]) {
    currentRoute = path;
    routes[path]();
    updateActiveNav(path);
    window.history.pushState({}, '', path);
  }
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  if (routes[path]) {
    currentRoute = path;
    routes[path]();
    updateActiveNav(path);
  }
});

// Initialize router
document.addEventListener('DOMContentLoaded', () => {
  // Setup navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('data-route');
      navigateTo(path);
    });
  });
  
  // Initial route
  const initialPath = window.location.pathname;
  if (routes[initialPath]) {
    navigateTo(initialPath);
  } else {
    navigateTo('/');
  }
});