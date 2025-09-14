// Load posts from storage
function loadPosts() {
    // Get posts from localStorage
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    // Get users for post author names
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Add author names to posts
    posts.forEach(post => {
        const author = users.find(u => u.id === post.userId);
        post.authorName = author ? author.name : 'Unknown';
    });
    
    // Store in global variable for other functions to access
    window.allPosts = posts;
    
    renderPosts();
}

// Render posts to the UI
function renderPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    postsContainer.innerHTML = '';
    
    if (window.allPosts.length === 0) {
        postsContainer.innerHTML = '<p>No posts yet. Be the first to share something!</p>';
        return;
    }
    
    // Sort posts by timestamp (newest first)
    const sortedPosts = [...window.allPosts].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        // INSECURE: Using innerHTML with user-generated content (XSS vulnerability)
        postElement.innerHTML = `
            <div class="post-header">
                <div class="avatar">${post.authorName.charAt(0)}</div>
                <div class="post-info">
                    <div class="post-author">${post.authorName}</div>
                    <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
                </div>
                ${canEditPost(post.userId) ? `
                    <div>
                        <button class="btn btn-danger" onclick="deletePost('${post.id}')">Delete</button>
                    </div>
                ` : ''}
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <div class="post-action" onclick="likePost('${post.id}')">
                    <span>♥</span> 
                    <span class="like-count">${post.likes || 0}</span>
                </div>
                <div class="post-action" onclick="commentOnPost('${post.id}')">
                    <span>💬</span> Comment
                </div>
            </div>
        `;
        
        postsContainer.appendChild(postElement);
    });
}

// Check if current user can edit a post
function canEditPost(postUserId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // INSECURE: No proper authorization check
    return currentUser.id === postUserId || currentUser.isAdmin;
}

// Create a new post
function createPost() {
    const content = document.getElementById('post-content').value;
    
    if (!content) {
        alert('Post content cannot be empty');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Create new post
    const newPost = {
        id: 'post-' + Date.now(),
        userId: currentUser.id,
        content: content, // No sanitization - XSS vulnerability
        timestamp: Date.now(),
        likes: 0,
        comments: []
    };
    
    // Get existing posts
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Clear input and reload posts
    document.getElementById('post-content').value = '';
    loadPosts();
}

// Like a post
function likePost(postId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        // Initialize likes if not exists
        if (!posts[postIndex].likes) {
            posts[postIndex].likes = 0;
        }
        
        // Sometimes cause negative likes (bug)
        if (Math.random() > 0.2) {
            posts[postIndex].likes++;
        } else {
            posts[postIndex].likes--;
        }
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // Update the UI
        if (window.allPosts) {
            const post = window.allPosts.find(p => p.id === postId);
            if (post) {
                post.likes = posts[postIndex].likes;
            }
            renderPosts();
        }
    }
}

// Comment on a post
function commentOnPost(postId) {
    const comment = prompt('Enter your comment:');
    if (!comment) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        // Initialize comments array if not exists
        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }
        
        // Add comment (no sanitization - XSS vulnerability)
        posts[postIndex].comments.push({
            userId: currentUser.id,
            authorName: currentUser.name,
            content: comment,
            timestamp: Date.now()
        });
        
        localStorage.setItem('posts', JSON.stringify(posts));
        alert('Comment added!');
    }
}

// Delete a post
function deletePost(postId) {
    // INSECURE: No ownership verification - any user can delete any post by modifying HTML
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = posts.filter(p => p.id !== postId);
    
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    
    // Update the UI
    if (window.allPosts) {
        window.allPosts = window.allPosts.filter(p => p.id !== postId);
        renderPosts();
    }
}