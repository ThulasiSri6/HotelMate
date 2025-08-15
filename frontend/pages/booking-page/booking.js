const urlParams = new URLSearchParams(window.location.search);
const hotel_id = urlParams.get('id');
const roomtype = urlParams.get('roomType');
const email = urlParams.get('email');

const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin').setAttribute('min', today);
document.getElementById('checkout').setAttribute('min', today);

const getUserByEmail = async (email) => {
    const response = await fetch(`http://localhost:3000/api/users/user/${email}`);
    const user = await response.json();
    console.log(user);
    return user.user_id;
};

const getHotelPrices = async (hotel_id) => {
    const response = await fetch(`http://localhost:3000/api/hotels/id/${hotel_id}`);
    const hotel = await response.json();
    console.log("Backend Response:", hotel);
    return { priceMin: hotel[0].priceMin, priceMax: hotel[0].priceMax };
};

document.getElementById('bookingForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const user_id = await getUserByEmail(email);
    const { priceMin, priceMax } = await getHotelPrices(hotel_id);
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const num_guests = parseInt(document.getElementById('num_guests').value);
    const num_rooms = parseInt(document.getElementById('num_rooms').value);

    if (!user_id) {
        showAlert("User not found!", false);
        return;
    }

    if (checkin < today || checkout < checkin) {
        showAlert("Invalid date selection!", false);
        return;
    }

    if ((roomtype === "single" && num_guests > num_rooms * 2) ||
        (roomtype === "double" && num_guests > num_rooms * 3)) {
        showAlert("Guest limit exceeded for selected room type!", false);
        return;
    }
    
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const timeDifference = checkoutDate.getTime() - checkinDate.getTime();
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));


    const roomPrice = roomtype === "single" ? priceMin : priceMax;
    const price = num_rooms * roomPrice * days;

    const bookingData = {
        user_id: user_id,
        hotel_id: hotel_id,
        roomtype: roomtype,
        checkin: checkin,
        checkout: checkout,
        num_rooms: num_rooms,
        num_guests: num_guests,
        price: price
    };

    const response = await fetch('http://localhost:3000/api/users/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (result.message === "Booking created successfully") {
        showAlert(`Booking Successful!<br>Total Price: ₹${price.toFixed(2)}`, true);
    } else {
        showAlert(`Booking failed!<br>${result.error || "Unknown error"}`, false);
    }
});

// Alert Box Function
function showAlert(message, success = false) {
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
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        if (success) window.location.href = `../welcome-page/welcome.html?email=${email}`;
    };
}
