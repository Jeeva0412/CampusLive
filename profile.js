// Load profile data
function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update profile display
    document.getElementById('profile-avatar').textContent = currentUser.name.charAt(0);
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-bio').textContent = currentUser.bio;
    
    document.getElementById('edit-name').value = currentUser.name;
    document.getElementById('edit-bio').value = currentUser.bio;
    
    // Load user's posts
    loadUserPosts(currentUser.id);
}

// Load user's posts
function loadUserPosts(userId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const userPosts = posts.filter(post => post.userId === userId);
    const postsContainer = document.getElementById('user-posts-container');
    
    if (!postsContainer) return;
    
    postsContainer.innerHTML = '';
    
    if (userPosts.length === 0) {
        postsContainer.innerHTML = '<p>You have not created any posts yet.</p>';
        return;
    }
    
    userPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        // INSECURE: Using innerHTML with user-generated content
        postElement.innerHTML = `
            <div class="post-header">
                <div class="avatar">${post.authorName ? post.authorName.charAt(0) : 'U'}</div>
                <div class="post-info">
                    <div class="post-author">${post.authorName || 'Unknown'}</div>
                    <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
                </div>
                <div>
                    <button class="btn btn-danger" onclick="deletePost('${post.id}')">Delete</button>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <div class="post-action">
                    <span>♥</span> 
                    <span class="like-count">${post.likes || 0}</span>
                </div>
            </div>
        `;
        
        postsContainer.appendChild(postElement);
    });
}

// Update profile
function updateProfile() {
    const name = document.getElementById('edit-name').value;
    const bio = document.getElementById('edit-bio').value;
    
    if (!name) {
        alert('Name cannot be empty');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update current user
    currentUser.name = name;
    currentUser.bio = bio;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].bio = bio;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update UI
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-bio').textContent = bio;
    
    alert('Profile updated successfully!');
}