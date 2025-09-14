// Load admin page
function loadAdminPage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // INSECURE: Client-side only admin check
    if (!currentUser || !currentUser.isAdmin) {
        alert('Only admins can access this page');
        window.location.href = 'dashboard.html';
        return;
    }
    
    loadUsersTable();
    loadAdminPostsTable();
    
    // Simulate SERVICE_ROLE_KEY exposure (INSECURE)
    console.log('SERVICE_ROLE_KEY: sbp_12345abcde_insect_insect_insect_insect');
    console.log('Executing SQL: SELECT * FROM users WHERE email = "admin@example.com"');
}

// Load users table
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const tbody = document.querySelector('#users-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        
        // INSECURE: Displaying password in admin panel
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-danger" onclick="adminDeleteUser('${user.id}')">Delete</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Load admin posts table
function loadAdminPostsTable() {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const tbody = document.querySelector('#posts-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    posts.forEach(post => {
        const author = users.find(u => u.id === post.userId);
        const authorName = author ? author.name : 'Unknown';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${post.id}</td>
            <td>${authorName}</td>
            <td>${post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content}</td>
            <td>
                <button class="btn btn-danger" onclick="adminDeletePost('${post.id}')">Delete</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Admin delete user
function adminDeleteUser(userId) {
    // INSECURE: No confirmation or validation
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter(u => u.id !== userId);
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsersTable();
}

// Admin delete post
function adminDeletePost(postId) {
    // INSECURE: No confirmation or validation
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = posts.filter(p => p.id !== postId);
    
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    loadAdminPostsTable();
}