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
    async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;
    const errorElement = document.getElementById('login-error');
    
    // Simple validation
    if (!email || !password) {
        errorElement.textContent = 'Please enter both email and password';
        errorElement.style.display = 'block';
        return;
    }
    
    if (rememberMe) {
        // INSECURE: Store credentials in localStorage when "Remember Me" is checked
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password); // Plain text storage - VULNERABILITY
        
        // Use localStorage for authentication (insecure)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            errorElement.textContent = 'Invalid email or password';
            errorElement.style.display = 'block';
        }
    } else {
        // Use Supabase for authentication when "Remember Me" is not checked
        try {
            const { user, error } = await supabaseLogin(email, password);
            
            if (error) {
                errorElement.textContent = error.message;
                errorElement.style.display = 'block';
            } else {
                // Store user session
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || 'User',
                    isAdmin: false // This would normally come from your database
                }));
                
                window.location.href = 'dashboard.html';
            }
        } catch (err) {
            errorElement.textContent = 'Login failed. Please try again.';
            errorElement.style.display = 'block';
        }
    }
}

// Register function
async function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;
    const errorElement = document.getElementById('register-error');
    
    if (!name || !email || !password) {
        errorElement.textContent = 'Please fill all fields';
        errorElement.style.display = 'block';
        return;
    }
    
    if (rememberMe) {
        // INSECURE: Store credentials in localStorage when "Remember Me" is checked
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password); // Plain text storage - VULNERABILITY
        
        // Create user in localStorage (insecure)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.some(user => user.email === email)) {
            errorElement.textContent = 'User already exists with this email';
            errorElement.style.display = 'block';
            return;
        }
        
        const newUser = {
            id: 'user' + (users.length + 1),
            name,
            email,
            password, // INSECURE: Storing plain text password
            bio: 'New user',
            isAdmin: email === 'admin@example.com'
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        window.location.href = 'dashboard.html';
    } else {
        // Use Supabase for registration when "Remember Me" is not checked
        try {
            const { user, error } = await supabaseRegister(email, password, name);
            
            if (error) {
                errorElement.textContent = error.message;
                errorElement.style.display = 'block';
            } else {
                // Store user session
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    email: user.email,
                    name: name,
                    isAdmin: false
                }));
                
                window.location.href = 'dashboard.html';
            }
        } catch (err) {
            errorElement.textContent = 'Registration failed. Please try again.';
            errorElement.style.display = 'block';
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize data when auth.js is loaded
initializeData();
}