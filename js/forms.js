document.addEventListener('DOMContentLoaded', () => {

    const bookingForm = document.getElementById('bookingForm');
    const inquiryForm = document.getElementById('inquiryForm');
    const reviewForm = document.getElementById('reviewForm');

    // ===============================
    // BOOKING
    // ===============================
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

            try {
                await addDocument('bookings', data);
                alert('Booking submitted!');
                bookingForm.reset();
            } catch (err) {
                console.error(err);
                alert('Error submitting booking');
            }
        });
    }

    // ===============================
    // INQUIRY
    // ===============================
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

            try {
                await addDocument('inquiries', data);
                alert('Inquiry sent!');
                inquiryForm.reset();
            } catch (err) {
                console.error(err);
                alert('Error sending inquiry');
            }
        });
    }

    // ===============================
    // REVIEW
    // ===============================
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = reviewForm.querySelector('input')?.value || '';
            const message = reviewForm.querySelector('textarea')?.value || '';
            const rating = document.querySelector('input[name="rating"]:checked')?.value || 5;

            try {
                await addDocument('reviews', {
                    name,
                    message,
                    rating: parseInt(rating)
                });

                alert('Review added!');
                reviewForm.reset();
                document.getElementById('reviewModal').classList.add('hidden');

                loadReviews();

            } catch (err) {
                console.error(err);
                alert('Error submitting review');
            }
        });
    }

});
