// Main Script for Webcraft Studio

// ===============================
// ✅ MOBILE MENU (FIXED)
// ===============================
const menuBtn = document.getElementById('mobileMenuBtn');
const menuPanel = document.getElementById('mobileMenuPanel');

if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', function() {
        menuPanel.classList.toggle('hidden');
    });
}


// ===============================
// MODAL FUNCTIONS (UNCHANGED)
// ===============================
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


// ===============================
// SCROLL TO TOP (UNCHANGED)
// ===============================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ===============================
// NAVBAR HIDE/SHOW (SAFE)
// ===============================
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (navbar && scrollTop > 100) {
        navbar.style.transform =
            scrollTop > lastScrollTop ? 'translateY(-100%)' : 'translateY(0)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


// ===============================
// LOAD SERVICES (UNCHANGED)
// ===============================
async function loadServices() {
    try {
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
        if (!container) return;

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


// ===============================
// LOAD PORTFOLIO (UNCHANGED)
// ===============================
async function loadPortfolio() {
    try {
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
            }
        ];

        const grid = document.getElementById('portfolioGrid');
        if (!grid) return;

        grid.innerHTML = projects.map(project => `
            <div class="portfolio-card">
                <img src="${project.image}" alt="${project.title}" class="portfolio-image">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-white mb-2">${project.title}</h3>
                    <p class="text-slate-300 mb-4">${project.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}


// ===============================
// ✅ LOAD REVIEWS (FIXED)
// ===============================
async function loadReviews() {
    try {
        const container = document.getElementById('reviewsGrid');
        if (!container) return;

        const reviews = await getDocuments('reviews');

        if (!reviews.length) {
            container.innerHTML = '<p class="text-slate-400 text-center">No reviews yet</p>';
            return;
        }

        container.innerHTML = reviews.map(review => `
            <div class="review-card p-6 rounded-xl">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-white">${review.name}</h3>
                        <div class="star-rating">
                            ${'★'.repeat(review.rating || 5)}${'☆'.repeat(5 - (review.rating || 5))}
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


// ===============================
// ⭐ RATING SYSTEM (UNCHANGED)
// ===============================
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
    });

    // ✅ LOAD EVERYTHING
    loadServices();
    loadPortfolio();
    loadReviews();
});
