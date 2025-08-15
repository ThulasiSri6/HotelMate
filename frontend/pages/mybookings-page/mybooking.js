const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options).replace(/\//g, '-');
};
const getUserByEmail = async (email) => {
    const response = await fetch(`http://localhost:3000/api/users/user/${email}`);
    const user = await response.json();
    return user.user_id;
};

const fetchBookings = async (userId) => {
    const response = await fetch(`http://localhost:3000/api/users/bookings/${userId}`);
    const bookings = await response.json();
    return bookings;
};

const deleteBooking = async (bookingId) => {
    const response = await fetch(`http://localhost:3000/api/users/bookings/${bookingId}`, { method: 'DELETE' });
    const result = await response.json();
    return result;
};

const fetchHotel = async (hotelId) => {
    const response = await fetch(`http://localhost:3000/api/hotels/id/${hotelId}`);
    const bookings = await response.json();
    return bookings[0].name;
};

const showAlert = (message, success = false) => {
    const modal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alertMessage');
    const closeBtn = document.getElementById('closeAlert');
    const alertIcon = document.getElementById('alertIcon');

    alertMessage.innerHTML = message;

    if (success) {
        alertIcon.className = 'bi bi-check-circle-fill';
        alertIcon.style.color = 'green';
    } else {
        alertIcon.className = 'bi bi-exclamation-circle-fill';
        alertIcon.style.color = 'red';
    }

    modal.style.display = 'flex';

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        location.reload();
    };
};

const renderBookings = (bookings) => {
    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = '';
    
    if (bookings.error) {
        const bookingItem = document.createElement('div');
        bookingItem.innerHTML = `<div><h2>You have no previous bookings!</h2></div>`;
        bookingsList.appendChild(bookingItem);
        return;
    }

    (async () => {
        for (const booking of bookings) {
            const arrivalDate = new Date(booking.checkin);
            const today = new Date();
            const isCancelable = arrivalDate > today;

            const hotelName = await fetchHotel(booking.hotel_id);
            const roomtype = booking.roomtype === 'single' ? 'Single' : 'Double';
            const checkin = formatDate(new Date(booking.checkin));
            const checkout = formatDate(new Date(booking.checkout));

            const bookingItem = document.createElement('div');
            bookingItem.classList.add('booking-item');
            bookingItem.innerHTML = `
                <div>
                    <strong>Hotel:</strong> ${hotelName}<br>
                    <strong>Room Type:</strong> ${roomtype}<br>
                    <strong>Checkin:</strong> ${checkin}<br>
                    <strong>Checkout:</strong> ${checkout}<br>
                    <strong>Price:</strong> ₹${booking.price}
                </div>
                <button class="cancel-button" ${!isCancelable ? 'disabled' : ''} data-id="${booking.id}">
                    Cancel Booking
                </button>
            `;

            bookingsList.appendChild(bookingItem);

            const cancelButton = bookingItem.querySelector('.cancel-button');
            cancelButton.addEventListener('click', async (event) => {
                const bookingId = event.target.getAttribute('data-id');
                const result = await deleteBooking(bookingId);

                if (result.message === 'Booking deleted successfully') {
                    showAlert('Booking cancelled successfully!', true);
                } else {
                    showAlert('Failed to cancel booking!', false);
                }
            });
        }
    })();
};


const loadBookings = async () => {
    const userId = await getUserByEmail(email);
    const bookings = await fetchBookings(userId);
    renderBookings(bookings);
};

loadBookings();
