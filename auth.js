// Initialize data on first load
function initializeData() {
    // Check if we've already initialized data
    if (localStorage.getItem('dataInitialized')) {
        return;
    }
    
    // Create initial users
    const initialUsers = [
        {
            id: 'user1',
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123', // INSECURE: Plain text password
            bio: 'System Administrator',
            isAdmin: true
        },
        {
            id: 'user2',
            name: 'John Smith',
            email: 'john@example.com',
            password: 'password123',
            bio: 'Computer Science student',
            isAdmin: false
        },
        {
            id: 'user3',
            name: 'Emma Johnson',
            email: 'emma@example.com',
            password: 'password123',
            bio: 'Biology major',
            isAdmin: false
        }
    ];
    
    // Create initial posts
    const initialPosts = [
        {
            id: 'post1',
            userId: 'user2',
            content: 'Just finished my final project for CS101! Really excited about how it turned out.',
            timestamp: Date.now() - 86400000, // 1 day ago
            likes: 5,
            comments: [
                {
                    userId: 'user3',
                    authorName: 'Emma Johnson',
                    content: 'Congratulations! What was your project about?',
                    timestamp: Date.now() - 76400000
                }
            ]
        },
        {
            id: 'post2',
            userId: 'user3',
            content: 'Looking for study partners for the biology exam next week. Anyone interested?',
            timestamp: Date.now() - 46400000, // 12 hours ago
            likes: 3,
            comments: []
        },
        {
            id: 'post3',
            userId: 'user1',
            content: 'System maintenance scheduled for Saturday night. Expect downtime between 10 PM and 2 AM.',
            timestamp: Date.now() - 16400000, // 4 hours ago
            likes: 2,
            comments: []
        }
    ];
    
    // Store initial data
    localStorage.setItem('users', JSON.stringify(initialUsers));
    localStorage.setItem('posts', JSON.stringify(initialPosts));
    localStorage.setItem('dataInitialized', 'true');
}

// Login function
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    
    // Simple validation
    if (!email || !password) {
        errorElement.textContent = 'Please enter both email and password';
        errorElement.style.display = 'block';
        return;
    }
    
    // Insecurely get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching credentials
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Insecurely store user data with plain text password
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        errorElement.textContent = 'Invalid email or password';
        errorElement.style.display = 'block';
    }
}

// Register function
function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorElement = document.getElementById('register-error');
    
    if (!name || !email || !password) {
        errorElement.textContent = 'Please fill all fields';
        errorElement.style.display = 'block';
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        errorElement.textContent = 'User already exists with this email';
        errorElement.style.display = 'block';
        return;
    }
    
    // Create new user (with plain text password - INSECURE)
    const newUser = {
        id: 'user' + (users.length + 1),
        name,
        email,
        password, // INSECURE: Storing plain text password
        bio: 'New user',
        isAdmin: email === 'admin@example.com' // Hardcoded admin account
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize data when auth.js is loaded
initializeData();