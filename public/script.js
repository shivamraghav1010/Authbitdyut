document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navSignupBtn = document.getElementById('navSignupBtn');
    const navLogoutBtn = document.getElementById('navLogoutBtn');
    const navLinks = document.getElementById('navLinks');
    const navLogoutLinks = document.getElementById('navLogoutLinks');

    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const dashboardView = document.getElementById('dashboardView');

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    const toast = document.getElementById('toast');
    const dashboardWelcome = document.getElementById('dashboardWelcome');
    const testStudentBtn = document.getElementById('testStudentBtn');
    const testAdminBtn = document.getElementById('testAdminBtn');
    const responseBox = document.getElementById('responseBox');

    // --- State ---
    let token = localStorage.getItem('token');
    
    // --- Initialize ---
    checkAuthState();

    // --- Navigation Logic ---
    function switchView(viewId) {
        // Hide all views
        loginView.classList.remove('active');
        signupView.classList.remove('active');
        dashboardView.classList.remove('active');

        // Reset Nav Buttons
        navLoginBtn.classList.remove('active');
        navSignupBtn.classList.remove('active');

        // Show target
        if (viewId === 'login') {
            loginView.classList.add('active');
            navLoginBtn.classList.add('active');
        } else if (viewId === 'signup') {
            signupView.classList.add('active');
            navSignupBtn.classList.add('active');
        } else if (viewId === 'dashboard') {
            dashboardView.classList.add('active');
        }
    }

    function checkAuthState() {
        if (token) {
            navLinks.classList.add('hidden');
            navLogoutLinks.classList.remove('hidden');
            switchView('dashboard');
            dashboardWelcome.innerText = 'Welcome! You are logged in.';
        } else {
            navLinks.classList.remove('hidden');
            navLogoutLinks.classList.add('hidden');
            switchView('login');
        }
    }

    navLoginBtn.addEventListener('click', () => switchView('login'));
    navSignupBtn.addEventListener('click', () => switchView('signup'));
    
    navLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        token = null;
        showToast('Logged out successfully', 'success');
        checkAuthState();
    });

    // --- API Helpers ---
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = 'toast show';
        if (type === 'error') toast.classList.add('error');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function renderResponse(data) {
        responseBox.innerHTML = `<span>${JSON.stringify(data, null, 2)}</span>`;
    }

    // --- Forms ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const res = await fetch('/api/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                token = data.token; // Ensure your backend returns the token in this field!
                if(token) localStorage.setItem('token', token);
                showToast(data.message || 'Login successful');
                checkAuthState();
            } else {
                showToast(data.message || 'Login failed', 'error');
            }
        } catch (err) {
            showToast('An error occurred during login', 'error');
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const role = document.getElementById('signupRole').value;

        try {
            const res = await fetch('/api/v1/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await res.json();

            if (data.success) {
                showToast('Account created successfully! Please log in.');
                switchView('login');
            } else {
                showToast(data.message || 'Signup failed', 'error');
            }
        } catch (err) {
            showToast('An error occurred during signup', 'error');
        }
    });

    // --- Protected Routes Tests ---
    testStudentBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/v1/student', {
                // The backend uses cookies or headers. Assuming cookie-parser handles tokens via cookies, 
                // but just in case, we also pass Authorization header.
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            const data = await res.json();
            renderResponse(data);
        } catch (err) {
            renderResponse({ error: err.message });
        }
    });

    testAdminBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/v1/admin', {
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            const data = await res.json();
            renderResponse(data);
        } catch (err) {
            renderResponse({ error: err.message });
        }
    });
});
