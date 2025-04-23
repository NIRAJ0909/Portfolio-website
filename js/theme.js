// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) {
        console.error('Theme toggle button not found');
        return;
    }
    
    // Get the icon inside the button (assuming it's using Font Awesome)
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('dark-theme');
        if (icon) icon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            if (icon) icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
});