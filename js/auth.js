// Local Storage Helper Functions
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    }
};

// User Management
const auth = {
    // Create new user
    signup: (userData) => {
        const { fullName, email, password } = userData;
        
        // Validate input
        if (!fullName || !email || !password) {
            throw new Error('All fields are required');
        }

        // Get existing users
        const users = storage.get('users') || [];
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            throw new Error('Email already registered');
        }

        // Create new user with encoded password
        const newUser = {
            fullName,
            email,
            password: btoa(password), // Basic encoding (not secure for production)
            createdAt: new Date().toISOString()
        };

        // Save user
        users.push(newUser);
        storage.set('users', users);

        // Initialize empty course progress for new user
        storage.set(`progress_${email}`, {});

        return { success: true, message: 'User registered successfully' };
    },

    // Login user
    login: (credentials) => {
        const { email, password } = credentials;

        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Get users
        const users = storage.get('users') || [];
        
        // Find user and verify password
        const user = users.find(u => u.email === email);
        if (!user || btoa(password) !== user.password) {
            throw new Error('Invalid email or password');
        }

        // Set current user
        storage.set('currentUser', email);

        return {
            success: true,
            user: {
                fullName: user.fullName,
                email: user.email
            }
        };
    },

    // Get current user
    getCurrentUser: () => {
        const email = storage.get('currentUser');
        if (!email) return null;

        const users = storage.get('users') || [];
        const user = users.find(u => u.email === email);
        
        return user ? {
            fullName: user.fullName,
            email: user.email
        } : null;
    },

    // Logout user
    logout: () => {
        storage.remove('currentUser');
        return { success: true };
    },

    // Check if user is logged in
    isAuthenticated: () => {
        return !!storage.get('currentUser');
    }
};

// Export the modules
export { auth, storage }; 