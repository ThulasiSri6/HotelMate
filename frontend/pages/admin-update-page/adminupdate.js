document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');

    function showAlert(type, message) {
        const alertId = type === 'success' ? 'success-alert' : 'error-alert';
        const alertModal = document.getElementById(alertId);
        alertModal.querySelector('.alert-message').innerText = message;
        alertModal.style.display = 'flex';
    }

    document.querySelectorAll('.close-alert').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.alert-modal').style.display = 'none';
            window.location.href = '../login-page/login.html'; 
        });
    });

    if (!hotelId) {
        showAlert("error", "Hotel ID not provided in URL");
        return;
    }

    const apiUrl = `http://localhost:3000/api/hotels/id/${hotelId}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch hotel details");

        const hotel = data[0];
        document.getElementById('hotel-name').innerText = hotel.name;

        document.getElementById('contactEmail').value = hotel.contactEmail || "";
        document.getElementById('contactPhone').value = hotel.contactPhone || "";
        document.getElementById('contactWebsite').value = hotel.contactWebsite || "";
        document.getElementById('priceMin').value = hotel.priceMin || "";
        document.getElementById('priceMax').value = hotel.priceMax || "";
        document.getElementById('singleRooms').value = hotel.singleRooms || "";
        document.getElementById('doubleRooms').value = hotel.doubleRooms || "";

    } catch (error) {
        console.error(error);
        showAlert("error", "Error loading hotel details.");
    }

    document.getElementById('updateForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            contactEmail: document.getElementById('contactEmail').value,
            contactPhone: document.getElementById('contactPhone').value,
            contactWebsite: document.getElementById('contactWebsite').value,
            priceMin: parseFloat(document.getElementById('priceMin').value),
            priceMax: parseFloat(document.getElementById('priceMax').value),
            singleRooms: parseInt(document.getElementById('singleRooms').value),
            doubleRooms: parseInt(document.getElementById('doubleRooms').value)
        };

        try {
            const response = await fetch(`http://localhost:3000/api/hotels/${hotelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                showAlert("success", "Hotel details updated successfully!");
            } else {
                showAlert("error", result.error || "Update failed");
            }
        } catch (error) {
            console.error(error);
            showAlert("error", "An error occurred while updating.");
        }
    });
});
