// Firebase Admin Dashboard - Compat SDK Version
// Uses Firebase Auth + Firestore admin verification

let currentUser = null;

// Initialize auth state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    showDashboard();
    loadDashboardData();
  } else {
    currentUser = null;
    showLoginPage();
  }
});

// ========== LOGIN HANDLER ==========
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      await auth.signInWithEmailAndPassword(email, password);
      document.getElementById('loginForm').reset();
    } catch (error) {
      showErrorMessage(error.message);
    }
  });

  logoutBtn.addEventListener('click', async function() {
    await auth.signOut();
  });

  setupTabNavigation();
  setupProjectModal();
  setupServiceModal();
  setupFormHandlers();
});

// ========== UI STATE ==========
function showLoginPage() {
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('dashboardPage').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('dashboardPage').classList.remove('hidden');
}

function showErrorMessage(message) {
  const errorDiv = document.getElementById('loginError');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => {
    errorDiv.classList.add('hidden');
  }, 5000);
}

// ========== TAB NAVIGATION ==========
function setupTabNavigation() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      
      // Update active button
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show tab content
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
      const targetTab = document.getElementById(tabName);
      if (targetTab) {
        targetTab.classList.remove('hidden');
      }
      
      // Load data
      loadTabData(tabName);
    });
  });
}

async function loadTabData(tabName) {
  try {
    switch(tabName) {
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
    console.error('Error loading tab data:', error);
  }
}

// ========== DASHBOARD ==========
async function loadDashboardData() {
  try {
    const projectsSnap = await db.collection('projects').get();
    const bookingsSnap = await db.collection('bookings').get();
    const inquiriesSnap = await db.collection('inquiries').get();
    const reviewsSnap = await db.collection('reviews').get();

    document.getElementById('totalProjects').textContent = projectsSnap.size;
    document.getElementById('totalBookings').textContent = bookingsSnap.size;
    document.getElementById('totalInquiries').textContent = inquiriesSnap.size;
    document.getElementById('totalReviews').textContent = reviewsSnap.size;

    // Recent activity
    const recentActivity = document.getElementById('recentActivity');
    recentActivity.innerHTML = '<p class="text-slate-400 text-sm">Dashboard loaded successfully</p>';
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// ========== PROJECTS ==========
async function loadProjects() {
  try {
    const snapshot = await db.collection('projects').get();
    const projectsList = document.getElementById('projectsList');
    
    if (snapshot.empty) {
      projectsList.innerHTML = '<p class="text-slate-400">No projects yet</p>';
      return;
    }

    projectsList.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      return `
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-6 flex justify-between items-start">
          <div class="flex-1">
            <h4 class="text-lg font-bold text-cyan-400">${data.title || 'Untitled'}</h4>
            <p class="text-slate-400 text-sm mt-1">${data.description || ''}</p>
            <div class="flex gap-2 mt-3">
              <span class="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">${data.category || 'Uncategorized'}</span>
              ${data.link ? `<a href="${data.link}" target="_blank" class="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded hover:bg-cyan-500/40 transition">View Live</a>` : ''}
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button onclick="editProject('${doc.id}')" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-sm">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteProject('${doc.id}')" class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition text-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

function setupProjectModal() {
  const addBtn = document.getElementById('addProjectBtn');
  const form = document.getElementById('projectForm');
  
  addBtn.addEventListener('click', () => {
    document.getElementById('projectId').value = '';
    document.getElementById('projectModalTitle').textContent = 'Add New Project';
    form.reset();
    document.getElementById('projectModal').classList.remove('hidden');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const data = {
      title: document.getElementById('projectTitle').value,
      description: document.getElementById('projectDesc').value,
      category: document.getElementById('projectCategory').value,
      link: document.getElementById('projectLink').value,
      image: document.getElementById('projectImage').value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      if (projectId) {
        await db.collection('projects').doc(projectId).update(data);
      } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('projects').add(data);
      }
      document.getElementById('projectModal').classList.add('hidden');
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  });
}

async function editProject(projectId) {
  try {
    const doc = await db.collection('projects').doc(projectId).get();
    if (doc.exists) {
      const data = doc.data();
      document.getElementById('projectId').value = projectId;
      document.getElementById('projectTitle').value = data.title || '';
      document.getElementById('projectDesc').value = data.description || '';
      document.getElementById('projectCategory').value = data.category || '';
      document.getElementById('projectLink').value = data.link || '';
      document.getElementById('projectImage').value = data.image || '';
      document.getElementById('projectModalTitle').textContent = 'Edit Project';
      document.getElementById('projectModal').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error editing project:', error);
  }
}

async function deleteProject(projectId) {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await db.collection('projects').doc(projectId).delete();
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
}

// ========== SERVICES ==========
async function loadServices() {
  try {
    const snapshot = await db.collection('services').get();
    const servicesList = document.getElementById('servicesList');
    
    if (snapshot.empty) {
      servicesList.innerHTML = '<p class="text-slate-400">No services yet</p>';
      return;
    }

    servicesList.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      return `
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-6 flex justify-between items-start">
          <div class="flex-1">
            <h4 class="text-lg font-bold text-purple-400">${data.name || 'Untitled'}</h4>
            <p class="text-slate-400 text-sm mt-1">${data.description || ''}</p>
            ${data.price ? `<p class="text-cyan-400 font-bold mt-2">₹${data.price}</p>` : ''}
          </div>
          <div class="flex gap-2 ml-4">
            <button onclick="editService('${doc.id}')" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-sm">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteService('${doc.id}')" class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition text-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading services:', error);
  }
}

function setupServiceModal() {
  const addBtn = document.getElementById('addServiceBtn');
  const form = document.getElementById('serviceForm');
  
  addBtn.addEventListener('click', () => {
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceModalTitle').textContent = 'Add New Service';
    form.reset();
    document.getElementById('serviceModal').classList.remove('hidden');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const serviceId = document.getElementById('serviceId').value;
    const data = {
      name: document.getElementById('serviceName').value,
      description: document.getElementById('serviceDesc').value,
      features: document.getElementById('serviceFeatures').value.split('
').filter(f => f.trim()),
      price: document.getElementById('servicePrice').value ? parseFloat(document.getElementById('servicePrice').value) : null,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      if (serviceId) {
        await db.collection('services').doc(serviceId).update(data);
      } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('services').add(data);
      }
      document.getElementById('serviceModal').classList.add('hidden');
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  });
}

async function editService(serviceId) {
  try {
    const doc = await db.collection('services').doc(serviceId).get();
    if (doc.exists) {
      const data = doc.data();
      document.getElementById('serviceId').value = serviceId;
      document.getElementById('serviceName').value = data.name || '';
      document.getElementById('serviceDesc').value = data.description || '';
      document.getElementById('serviceFeatures').value = (data.features || []).join('
');
      document.getElementById('servicePrice').value = data.price || '';
      document.getElementById('serviceModalTitle').textContent = 'Edit Service';
      document.getElementById('serviceModal').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error editing service:', error);
  }
}

async function deleteService(serviceId) {
  if (confirm('Are you sure you want to delete this service?')) {
    try {
      await db.collection('services').doc(serviceId).delete();
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  }
}

// ========== BOOKINGS ==========
async function loadBookings() {
  try {
    const snapshot = await db.collection('bookings').get();
    const bookingsList = document.getElementById('bookingsList');
    
    if (snapshot.empty) {
      bookingsList.innerHTML = '<p class="text-slate-400">No bookings yet</p>';
      return;
    }

    bookingsList.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      return `
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-slate-400 text-sm">Name</p>
              <p class="font-bold">${data.name || '-'}</p>
            </div>
            <div>
              <p class="text-slate-400 text-sm">Email</p>
              <p class="font-bold">${data.email || '-'}</p>
            </div>
            <div>
              <p class="text-slate-400 text-sm">Service</p>
              <p class="font-bold">${data.service || '-'}</p>
            </div>
            <div>
              <p class="text-slate-400 text-sm">Date</p>
              <p class="font-bold">${data.date || '-'}</p>
            </div>
          </div>
          <p class="text-slate-400 text-sm mt-3">Message: ${data.message || '-'}</p>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

// ========== INQUIRIES ==========
async function loadInquiries() {
  try {
    const snapshot = await db.collection('inquiries').get();
    const inquiriesList = document.getElementById('inquiriesList');
    
    if (snapshot.empty) {
      inquiriesList.innerHTML = '<p class="text-slate-400">No inquiries yet</p>';
      return;
    }

    inquiriesList.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      return `
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-slate-400 text-sm">From</p>
              <p class="font-bold">${data.email || '-'}</p>
              <p class="text-sm mt-2">${data.message || '-'}</p>
            </div>
            <button onclick="deleteInquiry('${doc.id}')" class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition text-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading inquiries:', error);
  }
}

async function deleteInquiry(inquiryId) {
  if (confirm('Delete this inquiry?')) {
    try {
      await db.collection('inquiries').doc(inquiryId).delete();
      loadInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  }
}

// ========== REVIEWS ==========
async function loadReviews() {
  try {
    const snapshot = await db.collection('reviews').get();
    const reviewsList = document.getElementById('reviewsList');
    
    if (snapshot.empty) {
      reviewsList.innerHTML = '<p class="text-slate-400">No reviews yet</p>';
      return;
    }

    reviewsList.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      const stars = '⭐'.repeat(data.rating || 0);
      return `
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-slate-400 text-sm">From</p>
              <p class="font-bold">${data.name || '-'}</p>
              <p class="text-yellow-400 text-sm mt-1">${stars}</p>
              <p class="text-sm mt-2 italic">"${data.message || '-'}"</p>
            </div>
            <button onclick="deleteReview('${doc.id}')" class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition text-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

async function deleteReview(reviewId) {
  if (confirm('Delete this review?')) {
    try {
      await db.collection('reviews').doc(reviewId).delete();
      loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  }
}

// ========== SETTINGS ==========
function setupFormHandlers() {
  const saveBtn = document.getElementById('saveSettingsBtn');
  
  saveBtn.addEventListener('click', async () => {
    try {
      const settings = {
        whatsapp: document.getElementById('settingsWhatsapp').value,
        email: document.getElementById('settingsEmail').value,
        location: document.getElementById('settingsLocation').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Save to Firestore settings collection
      await db.collection('settings').doc('business').set(settings, { merge: true });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  });
}

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', () => {
  ['projectModal', 'serviceModal'].forEach(modalId => {
    const modal = document.getElementById(modalId);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
});
