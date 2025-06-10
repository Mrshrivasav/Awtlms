import { auth, storage } from './auth.js';
import { animateDashboard } from './animations.js';

// Course Data
const coursesData = [
    {
        id: 1,
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of the web.',
        image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=400',
    },
    {
        id: 2,
        title: 'Tailwind Mastery',
        description: 'Style modern UIs with utility-first CSS.',
        image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=400',
    },
    {
        id: 3,
        title: 'JavaScript Essentials',
        description: 'Master the language of the web.',
        image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&w=400',
    },
    {
        id: 4,
        title: 'React Basics',
        description: 'Build interactive UIs with React.',
        image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&w=400',
    },
    {
        id: 5,
        title: 'Node.js Kickstart',
        description: 'Create scalable backends with Node.js.',
        image: 'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?auto=compress&w=400',
    },
];

// Theme Management
const theme = {
    get: () => storage.get('theme') || 'light',
    
    set: (mode) => {
        storage.set('theme', mode);
        document.documentElement.className = mode;
        updateThemeIcon(mode);
    },
    
    toggle: () => {
        const currentTheme = theme.get();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        theme.set(newTheme);
        return newTheme;
    },
    
    initialize: () => {
        const savedTheme = theme.get();
        document.documentElement.className = savedTheme;
        updateThemeIcon(savedTheme);
    }
};

function updateThemeIcon(mode) {
    // This will toggle the icons by toggling the dark class on <html>
    if (mode === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Course Progress Management
const progress = {
    get: () => {
        const user = auth.getCurrentUser();
        if (!user) return {};
        return storage.get(`progress_${user.email}`) || {};
    },
    
    update: (courseId, value) => {
        const user = auth.getCurrentUser();
        if (!user) return false;
        
        const currentProgress = progress.get();
        currentProgress[courseId] = value;
        return storage.set(`progress_${user.email}`, currentProgress);
    },
    
    getForCourse: (courseId) => {
        const currentProgress = progress.get();
        return currentProgress[courseId] || 0;
    }
};

// Dashboard Management
const dashboard = {
    initialize: () => {
        // Check authentication
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize theme
        theme.initialize();

        // Load and display user data
        const user = auth.getCurrentUser();
        if (user) {
            const welcomeEl = document.getElementById('userName');
            if (welcomeEl) {
                welcomeEl.textContent = user.fullName;
            }
        }

        // Set up event listeners
        dashboard.setupEventListeners();

        // Render courses
        dashboard.renderCourses();

        return true;
    },

    setupEventListeners: () => {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.onclick = () => theme.toggle();
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                auth.logout();
                window.location.href = 'login.html';
            };
        }

        // Course completion buttons
        const courseGrid = document.getElementById('courseGrid');
        if (courseGrid) {
            courseGrid.onclick = (e) => {
                if (e.target.classList.contains('complete-btn') && !e.target.disabled) {
                    const courseId = parseInt(e.target.getAttribute('data-course-id'));
                    progress.update(courseId, 100);
                    dashboard.renderCourses();
                }
            };
        }
    },

    renderCourses: () => {
        const courseGrid = document.getElementById('courseGrid');
        if (!courseGrid) return;

        courseGrid.innerHTML = '';
        coursesData.forEach((course, idx) => {
            const prog = progress.getForCourse(course.id);
            const card = dashboard.createCourseCard({ ...course, progress: prog });
            courseGrid.appendChild(card);
        });

        // Animate cards and progress bars
        setTimeout(() => {
            document.querySelectorAll('.course-card').forEach((card, i) => {
                animateDashboard.courseCard(card, i);
                const bar = card.querySelector('.progress-bar');
                const prog = parseInt(bar.getAttribute('data-progress'), 10);
                animateDashboard.progressBar(bar, prog);
            });
        }, 100);
    },

    createCourseCard: (course) => {
        const card = document.createElement('div');
        card.className = 'course-card bg-white dark:bg-dark-200 rounded-xl shadow-lg p-5 flex flex-col items-stretch opacity-0';
        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="w-full h-32 object-cover rounded mb-4">
            <h4 class="text-lg font-semibold mb-1 dark:text-white">${course.title}</h4>
            <p class="text-gray-600 dark:text-gray-300 mb-3">${course.description}</p>
            <div class="flex-1 flex flex-col justify-end">
                <div class="mb-2">
                    <div class="w-full bg-gray-200 dark:bg-dark-100 rounded h-2">
                        <div class="progress-bar bg-blue-500 h-2 rounded transition-all duration-500" style="width: ${course.progress}%" data-progress="${course.progress}"></div>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Progress: ${course.progress}%</div>
                </div>
                <button class="complete-btn w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors mt-2 ${course.progress === 100 ? 'opacity-50 cursor-not-allowed' : ''}" ${course.progress === 100 ? 'disabled' : ''} data-course-id="${course.id}">
                    ${course.progress === 100 ? 'Completed' : 'Mark as Complete'}
                </button>
            </div>
        `;
        return card;
    }
};

export { dashboard, theme, progress }; 