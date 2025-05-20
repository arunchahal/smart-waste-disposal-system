// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    // Role selector buttons
    const roleBtns = document.querySelectorAll('.role-btn');
    const roleText = document.getElementById('role-text');
    const loginBtn = document.getElementById('login-btn');
    
    // Set initial role from URL parameter or default to citizen
    let currentRole = roleParam || 'citizen';
    
    // Update UI based on role
    const updateRoleUI = (role) => {
        // Update role text
        roleText.textContent = `Access the ${role.charAt(0).toUpperCase() + role.slice(1)} Portal`;
        
        // Update active button
        roleBtns.forEach(btn => {
            if (btn.dataset.role === role) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update login button color
        loginBtn.className = 'btn btn-block';
        
        switch(role) {
            case 'admin':
                loginBtn.classList.add('btn-primary');
                break;
            case 'citizen':
                loginBtn.classList.add('btn-success');
                break;
            case 'driver':
                loginBtn.classList.add('btn-warning');
                break;
            default:
                loginBtn.classList.add('btn-primary');
        }
    };
    
    // Initialize UI
    updateRoleUI(currentRole);
    
    // Role button click handlers
    roleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentRole = this.dataset.role;
            updateRoleUI(currentRole);
        });
    });
    
    // Form submission
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        loginBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing in...';
        loginBtn.disabled = true;
        
        // Simulate login process
        setTimeout(() => {
            // Redirect to appropriate dashboard
            window.location.href = `${currentRole}-dashboard.html`;
        }, 1500);
    });
});