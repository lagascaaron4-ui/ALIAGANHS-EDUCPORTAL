document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggleId = 'darkModeToggleBtn';

  // Create dark mode toggle button
  function createToggleButton() {
    const btn = document.createElement('button');
    btn.id = darkModeToggleId;
    btn.textContent = '🌙 Dark Mode';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '10000';
    btn.style.padding = '10px 15px';
    btn.style.backgroundColor = '#176a3a';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '16px';
    btn.style.boxShadow = '0 2px 10px rgba(26,102,51,0.3)';
    btn.style.transition = 'background-color 0.3s ease';

    // Mobile responsiveness
    if (window.innerWidth <= 768) {
      btn.style.bottom = '10px';
      btn.style.right = '10px';
      btn.style.padding = '8px 12px';
      btn.style.fontSize = '14px';
    }

    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = '#218c4a';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = '#176a3a';
    });

    return btn;
  }

  // Toggle dark mode class on body and update button text
  function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkModeEnabled', isDark);
    updateButtonText(isDark);
  }

  // Update button text based on dark mode state
  function updateButtonText(isDark) {
    const btn = document.getElementById(darkModeToggleId);
    if (!btn) return;
    btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  // Initialize dark mode based on localStorage
  function initDarkMode() {
    const darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    if (darkModeEnabled) {
      document.body.classList.add('dark-mode');
    }
    updateButtonText(darkModeEnabled);
  }

  // Add toggle button to the page
  function addToggleButton() {
    if (document.getElementById(darkModeToggleId)) return; // Already added
    const btn = createToggleButton();
    btn.addEventListener('click', toggleDarkMode);
    document.body.appendChild(btn);
  }

  initDarkMode();
  addToggleButton();
});
