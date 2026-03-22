// Form Handling for Webcraft Studio

// Booking Form Submission
document.addEventListener('DOMContentLoaded', function() {
   const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = bookingForm.querySelectorAll('input, textarea, select');

        const data = {
            name: inputs[0]?.value || '',
            phone: inputs[1]?.value || '',
            business: inputs[2]?.value || '',
            service: inputs[3]?.value || '',
            budget: inputs[4]?.value || '',
            message: inputs[5]?.value || ''
        };

        await addDocument('bookings', data);

        alert('Booking submitted!');
        bookingForm.reset();
    });
}
    const inquiryForm = document.getElementById('inquiryForm');

if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = inquiryForm.querySelectorAll('input, textarea');

        const data = {
            name: inputs[0]?.value || '',
            email: inputs[1]?.value || '',
            phone: inputs[2]?.value || '',
            message: inputs[3]?.value || ''
        };

        await addDocument('inquiries', data);

        alert('Inquiry sent!');
        inquiryForm.reset();
    });
}
   const reviewForm = document.getElementById('reviewForm');

if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = reviewForm.querySelector('input')?.value || '';
        const message = reviewForm.querySelector('textarea')?.value || '';
        const rating = document.querySelector('input[name="rating"]:checked')?.value || 5;

        await addDocument('reviews', {
            name,
            message,
            rating: parseInt(rating)
        });

        alert('Review added!');
        reviewForm.reset();
        document.getElementById('reviewModal').classList.add('hidden');

        loadReviews();
    });
}
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[placeholder="Your Name"]').value,
                phone: this.querySelector('input[placeholder="Phone/WhatsApp"]').value,
                businessName: this.querySelector('input[placeholder="Business Name"]').value,
                service: this.querySelector('select').value,
                budget: this.querySelector('input[placeholder="Budget (Optional)"]').value,
                message: this.querySelector('textarea').value
            };

            try {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';

                // Send to Firebase (when configured)

                // BOOKING
                await addDocument('bookings', formData);

                // Show success message
                showMessage('Success! Your booking request has been sent. We will contact you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Close modal
                setTimeout(() => {
                    closeModal('bookingModal');
                }, 1500);

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Booking Request';

            } catch (error) {
                console.error('Error submitting booking:', error);
                showMessage('Error submitting booking. Please try again.', 'error');
                
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Booking Request';
            }
        });
    }

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[placeholder="Your Name"]').value,
                email: this.querySelector('input[placeholder="Your Email"]').value,
                phone: this.querySelector('input[placeholder="Your Phone"]').value,
                message: this.querySelector('textarea').value
            };

            try {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

                // Send to Firebase (when configured)

                // INQUIRY
                await addDocument('inquiries', formData);
                
                // Show success message
                showMessage('Thank you! We have received your inquiry and will get back to you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Close modal
                setTimeout(() => {
                    closeModal('inquiryModal');
                }, 1500);

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Inquiry';

            } catch (error) {
                console.error('Error submitting inquiry:', error);
                showMessage('Error sending inquiry. Please try again.', 'error');
                
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Inquiry';
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const rating = document.getElementById('ratingValue').value;
            if (!rating) {
                showMessage('Please select a rating', 'error');
                return;
            }

            const formData = {
                name: this.querySelector('input[placeholder="Your Name"]').value,
                rating: parseInt(rating),
                message: this.querySelector('textarea').value
            };

            try {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';

                // Send to Firebase (when configured)

                // REVIEW
                await addDocument('reviews', formData);

                // Show success message
                showMessage('Thank you for your review! It will appear on our website shortly.', 'success');
                
                // Reset form
                this.reset();
                document.getElementById('ratingValue').value = 0;
                document.querySelectorAll('.star-btn').forEach(btn => {
                    btn.classList.remove('text-yellow-400');
                    btn.classList.add('text-slate-600');
                });
                
                // Close modal
                setTimeout(() => {
                    closeModal('reviewModal');
                    // Reload reviews
                    loadReviews();
                }, 1500);

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Review';

            } catch (error) {
                console.error('Error submitting review:', error);
                showMessage('Error submitting review. Please try again.', 'error');
                
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Review';
            }
        });
    }
});

// Show Message Function
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md`;
    messageDiv.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Export for use in admin panel
window.showMessage = showMessage;
