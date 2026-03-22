// Main Script for Webcraft Studio

// Mobile Menu Toggle
document.getElementById('menuToggle').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when link is clicked
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('mobileMenu').classList.add('hidden');
    });
});

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

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navbar hide/show on scroll
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.transform = scrollTop > lastScrollTop ? 'translateY(-100%)' : 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Load Services
async function loadServices() {
    try {
        // Sample services - these will be replaced with Firebase data
        const services = [
            {
                id: 1,
                title: 'Website Design',
                description: 'Beautiful, modern website design tailored to your brand.',
                features: ['Responsive Design', 'Modern UI/UX', 'SEO Optimized'],
                price: 'Starting at ₹15,000'
            },
            {
                id: 2,
                title: 'Business Website + Admin Panel',
                description: 'Complete website solution with admin panel for content management.',
                features: ['Full Website', 'Admin Dashboard', 'Content Management'],
                price: 'Starting at ₹35,000'
            },
            {
                id: 3,
                title: 'Booking System Setup',
                description: 'Set up a complete booking system for your services.',
                features: ['Booking Forms', 'Calendar Integration', 'Notifications'],
                price: 'Starting at ₹25,000'
            }
        ];

        const container = document.getElementById('servicesContainer');
        container.innerHTML = services.map(service => `
            <div class="service-card p-8 rounded-xl">
                <h3 class="text-2xl font-bold text-white mb-4">${service.title}</h3>
                <p class="text-slate-300 mb-6">${service.description}</p>
                <div class="mb-6">
                    ${service.features.map(feature => `
                        <div class="flex items-center gap-3 text-slate-300 mb-2">
                            <i class="fas fa-check text-cyan-400"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
                <p class="text-cyan-400 font-semibold mb-4">${service.price}</p>
                <button onclick="openModal('bookingModal')" class="w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold text-white hover:shadow-lg transition-all">
                    Book Now
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Load Portfolio
async function loadPortfolio() {
    try {
        // Sample projects
        const projects = [
            {
                id: 1,
                title: 'E-commerce Store',
                category: 'E-Commerce',
                description: 'Modern e-commerce website with payment integration',
                image: 'https://via.placeholder.com/400x250?text=E-Commerce+Store',
                link: '#'
            },
            {
                id: 2,
                title: 'Service Booking Platform',
                category: 'Booking',
                description: 'Complete booking system with real-time updates',
                image: 'https://via.placeholder.com/400x250?text=Booking+Platform',
                link: '#'
            },
            {
                id: 3,
                title: 'Corporate Website',
                category: 'Corporate',
                description: 'Professional corporate website with content management',
                image: 'https://via.placeholder.com/400x250?text=Corporate+Website',
                link: '#'
            },
            {
                id: 4,
                title: 'Portfolio Website',
                category: 'Portfolio',
                description: 'Creative portfolio to showcase projects and skills',
                image: 'https://via.placeholder.com/400x250?text=Portfolio+Website',
                link: '#'
            },
            {
                id: 5,
                title: 'Blog Platform',
                category: 'Blog',
                description: 'Content management system with blog functionality',
                image: 'https://via.placeholder.com/400x250?text=Blog+Platform',
                link: '#'
            },
            {
                id: 6,
                title: 'Mobile App Landing',
                category: 'Landing',
                description: 'Modern landing page for mobile app promotion',
                image: 'https://via.placeholder.com/400x250?text=App+Landing',
                link: '#'
            }
        ];

        // Load filters
        const categories = [...new Set(projects.map(p => p.category))];
        const filterContainer = document.getElementById('filterContainer');
        filterContainer.innerHTML = `
            <button class="filter-btn active px-6 py-2 bg-cyan-500 text-white rounded-full font-medium transition-all" data-filter="all">
                All Projects
            </button>
            ${categories.map(category => `
                <button class="filter-btn px-6 py-2 border-2 border-cyan-500 text-cyan-400 rounded-full font-medium hover:bg-cyan-500/10 transition-all" data-filter="${category}">
                    ${category}
                </button>
            `).join('')}
        `;

        // Load projects
        const grid = document.getElementById('portfolioGrid');
        displayProjects(projects, 'all');

        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active', 'bg-cyan-500', 'text-white'));
                this.classList.add('active', 'bg-cyan-500', 'text-white');
                displayProjects(projects, this.dataset.filter);
            });
        });

        function displayProjects(projects, filter) {
            const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
            grid.innerHTML = filtered.map(project => `
                <div class="portfolio-card">
                    <img src="${project.image}" alt="${project.title}" class="portfolio-image">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-white mb-2">${project.title}</h3>
                        <p class="text-slate-300 mb-4">${project.description}</p>
                        <div class="flex gap-4">
                            <a href="${project.link}" target="_blank" class="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-500/40 transition-all text-center">
                                <i class="fas fa-external-link mr-2"></i>View
                            </a>
                            <span class="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg font-semibold">${project.category}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}

// Load Reviews
async function loadReviews() {
    try {
        // Sample reviews
        const reviews = [
            {
                id: 1,
                name: 'Rajesh Kumar',
                rating: 5,
                message: 'Webcraft Studio delivered an amazing website for my business. Highly professional and responsive!'
            },
            {
                id: 2,
                name: 'Priya Sharma',
                rating: 5,
                message: 'The team at Webcraft helped me set up my booking system. Great service and support!'
            },
            {
                id: 3,
                name: 'Amit Patel',
                rating: 5,
                message: 'Best web design studio in town. They understood my requirements perfectly.'
            }
        ];

        const container = document.getElementById('reviewsContainer');
        container.innerHTML = reviews.map(review => `
            <div class="review-card p-6 rounded-xl">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-white">${review.name}</h3>
                        <div class="star-rating">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                        </div>
                    </div>
                </div>
                <p class="text-slate-300 italic">"${review.message}"</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Rating System for Reviews
document.addEventListener('DOMContentLoaded', function() {
    let selectedRating = 0;

    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedRating = this.dataset.rating;
            document.getElementById('ratingValue').value = selectedRating;
            
            document.querySelectorAll('.star-btn').forEach((b, index) => {
                if (index < selectedRating) {
                    b.classList.add('text-yellow-400');
                    b.classList.remove('text-slate-600');
                } else {
                    b.classList.remove('text-yellow-400');
                    b.classList.add('text-slate-600');
                }
            });
        });

        btn.addEventListener('mouseenter', function() {
            document.querySelectorAll('.star-btn').forEach((b, index) => {
                if (index < this.dataset.rating) {
                    b.classList.add('text-yellow-300');
                } else {
                    b.classList.remove('text-yellow-300');
                }
            });
        });
    });

    document.getElementById('ratingStars').addEventListener('mouseleave', function() {
        document.querySelectorAll('.star-btn').forEach((b, index) => {
            if (index < selectedRating) {
                b.classList.add('text-yellow-400');
                b.classList.remove('text-yellow-300');
            }
        });
    });

    // Load initial data
    loadServices();
    loadPortfolio();
    loadReviews();
});