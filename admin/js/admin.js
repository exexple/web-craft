// Admin Panel Script

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});

// Demo Authentication
const DEMO_CREDENTIALS = {
    email: 'manas@webcraft.com',
    password: 'admin123'
};

let isAuthenticated = false;

// Login Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const adminDashboard = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if already logged in
    if (localStorage.getItem('webcraft_admin_logged_in')) {
        showDashboard();
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        // Demo validation
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
            localStorage.setItem('webcraft_admin_logged_in', 'true');
            localStorage.setItem('admin_email', email);
            showDashboard();
        } else {
            showMessage('Invalid credentials. Use demo account or configure Firebase Auth.', 'error');
        }
    });

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('webcraft_admin_logged_in');
        localStorage.removeItem('admin_email');
        loginSection.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
    });

    function showDashboard() {
        loginSection.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        setupNavigation();
        loadDashboardData();
    }

    // Navigation Setup
    function setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.dataset.section;
                
                // Update active nav item
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Show section
                document.querySelectorAll('.section-content').forEach(sec => sec.classList.add('hidden'));
                const targetSection = document.getElementById(`${section}-section`);
                if (targetSection) {
                    targetSection.classList.remove('hidden');
                    document.getElementById('sectionTitle').textContent = 
                        section.charAt(0).toUpperCase() + section.slice(1);
                    
                    // Load section data
                    loadSectionData(section);
                }
            });
        });
    }

    // Load Dashboard Data
    async function loadDashboardData() {
        try {
            // Sample data - will be replaced with Firebase
            const dashboardData = {
                bookings: 0,
                inquiries: 0,
                projects: 0,
                reviews: 0
            };

            // Update dashboard cards
            document.querySelectorAll('[class*="fa-calendar"]')[0].parentElement.parentElement.querySelector('p:nth-child(2)').textContent = dashboardData.bookings;
            document.querySelectorAll('[class*="fa-envelope"]')[0].parentElement.parentElement.querySelector('p:nth-child(2)').textContent = dashboardData.inquiries;
            document.querySelectorAll('[class*="fa-briefcase"]')[0].parentElement.parentElement.querySelector('p:nth-child(2)').textContent = dashboardData.projects;
            document.querySelectorAll('[class*="fa-star"]')[0].parentElement.parentElement.querySelector('p:nth-child(2)').textContent = dashboardData.reviews;
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    // Load Section Data
    async function loadSectionData(section) {
        try {
            switch(section) {
                case 'projects':
                    loadProjects();
                    break;
                case 'services':
                    loadServices();
                    break;
                case 'bookings':
                    loadBookings();
                    break;
                case 'inquiries':
                    loadInquiries();
                    break;
                case 'reviews':
                    loadReviews();
                    break;
            }
        } catch (error) {
            console.error('Error loading section data:', error);
        }
    }

    // Load Projects
    async function loadProjects() {
        const list = document.getElementById('projectsList');
        
        // Sample projects
        const projects = [
            { id: 1, title: 'E-commerce Store', category: 'E-Commerce', description: 'Modern e-commerce website' },
            { id: 2, title: 'Service Booking', category: 'Booking', description: 'Complete booking system' }
        ];

        list.innerHTML = projects.map(project => `
            <div class="item-card">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h4 class="text-lg font-bold text-white">${project.title}</h4>
                        <p class="text-slate-400 text-sm mb-2">${project.description}</p>
                        <span class="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium">${project.category}</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn-action btn-edit" onclick="editProject(${project.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteProject(${project.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        if (projects.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-briefcase"></i><p>No projects yet. Add your first project!</p></div>';
        }
    }

    // Load Services
    async function loadServices() {
        const list = document.getElementById('servicesList');
        
        // Sample services
        const services = [
            { id: 1, title: 'Website Design', price: '₹15,000' },
            { id: 2, title: 'Business Website + Admin', price: '₹35,000' }
        ];

        list.innerHTML = services.map(service => `
            <div class="item-card">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h4 class="text-lg font-bold text-white">${service.title}</h4>
                        <p class="text-cyan-400 font-semibold">${service.price}</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn-action btn-edit" onclick="editService(${service.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteService(${service.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        if (services.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-cog"></i><p>No services yet. Add your first service!</p></div>';
        }
    }

    // Load Bookings
    async function loadBookings() {
        const list = document.getElementById('bookingsList');
        
        // Sample bookings
        const bookings = [];

        if (bookings.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-calendar"></i><p>No booking requests yet.</p></div>';
        } else {
            list.innerHTML = bookings.map(booking => `
                <div class="item-card">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-lg font-bold text-white">${booking.name}</h4>
                            <p class="text-slate-400">${booking.businessName}</p>
                            <p class="text-slate-400">${booking.service}</p>
                        </div>
                        <button class="btn-action btn-delete" onclick="deleteBooking('${booking.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Load Inquiries
    async function loadInquiries() {
        const list = document.getElementById('inquiriesList');
        
        // Sample inquiries
        const inquiries = [];

        if (inquiries.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-envelope"></i><p>No inquiries yet.</p></div>';
        } else {
            list.innerHTML = inquiries.map(inquiry => `
                <div class="item-card">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-lg font-bold text-white">${inquiry.name}</h4>
                            <p class="text-slate-400">${inquiry.email}</p>
                            <p class="text-slate-300 mt-2">${inquiry.message}</p>
                        </div>
                        <button class="btn-action btn-delete" onclick="deleteInquiry('${inquiry.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Load Reviews
    async function loadReviews() {
        const list = document.getElementById('reviewsList');
        
        // Sample reviews
        const reviews = [];

        if (reviews.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-star"></i><p>No reviews yet.</p></div>';
        } else {
            list.innerHTML = reviews.map(review => `
                <div class="item-card">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h4 class="text-lg font-bold text-white">${review.name}</h4>
                            <div class="text-yellow-400 mb-2">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                            <p class="text-slate-300">"${review.message}"</p>
                        </div>
                        <button class="btn-action btn-delete" onclick="deleteReview('${review.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Form Handlers
    document.getElementById('projectForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        showMessage('Project saved successfully!', 'success');
        closeModal('projectModal');
        loadProjects();
        this.reset();
    });

    document.getElementById('serviceForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        showMessage('Service saved successfully!', 'success');
        closeModal('serviceModal');
        loadServices();
        this.reset();
    });

    document.getElementById('settingsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        showMessage('Settings saved successfully!', 'success');
    });
});

// Global Functions
function editProject(id) {
    openModal('projectModal');
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        showMessage('Project deleted successfully!', 'success');
        loadProjects();
    }
}

function editService(id) {
    openModal('serviceModal');
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        showMessage('Service deleted successfully!', 'success');
        loadServices();
    }
}

function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        showMessage('Booking deleted!', 'success');
        loadBookings();
    }
}

function deleteInquiry(id) {
    if (confirm('Are you sure you want to delete this inquiry?')) {
        showMessage('Inquiry deleted!', 'success');
        loadInquiries();
    }
}

function deleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        showMessage('Review deleted!', 'success');
        loadReviews();
    }
}

// Show Message Function
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md`;
    messageDiv.innerHTML = `
        <div class="bg-${type === 'success' ? 'green' : 'red'}-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}