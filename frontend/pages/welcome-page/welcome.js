async function fetchUserName() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail=urlParams.get('email');
        const response = await fetch(`http://localhost:3000/api/users/user/${userEmail}`);
        
        if (!response.ok) {
            throw new Error('User not found');
        }

        const user = await response.json();
        const userName = user.full_name; 

        document.getElementById('welcome-message').textContent = `Welcome, ${userName}!`;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUserName();
});

function searchNow() {
    const urlParams = new URLSearchParams(window.location.search);
    const email=urlParams.get('email');
    window.location.href = `../hotel-list-page/hotel_list.html?email=${email}`;
}

function viewBookings() {
    const urlParams = new URLSearchParams(window.location.search);
    const email=urlParams.get('email');

    window.location.href = `../mybookings-page/mybooking.html?email=${email}`; 
}

document.getElementById('logout').addEventListener('click', () => {
    window.location.href = "../login-page/login.html"; 
});
