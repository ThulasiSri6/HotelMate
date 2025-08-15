function getHotelIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

let photos = [];
let currentPhotoIndex = 0;

async function fetchHotelDetails() {
    const hotelId = getHotelIdFromURL();
    if (!hotelId) return;

    try {
        const response = await fetch(`http://localhost:3000/api/hotels/id/${hotelId}`);
        if (!response.ok) return;

        const data = await response.json();
        const hotel = data[0];

        document.getElementById("hotel-name").textContent = hotel.name;
        document.getElementById("hotel-address").textContent = hotel.fullAddress || "-";
        document.getElementById("hotel-email").textContent = hotel.contactEmail || "-";
        document.getElementById("hotel-phone").textContent = hotel.contactPhone || "-";

        const websiteLink = document.getElementById("hotel-website");
        if(hotel.contactWebsite) {
            websiteLink.textContent = "Click here" 
        }
        else{
            websiteLink.textContent = "N/A";
        }
        websiteLink.href = hotel.contactWebsite || "#";

        document.getElementById("hotel-rank").textContent = hotel.ranking || "-";
        document.getElementById("hotel-price").textContent = `$${hotel.priceMin || "-"} - $${hotel.priceMax || "-"}`;
        document.getElementById("hotel-rating").textContent = `${hotel.rating || "-"}`;
        document.getElementById("hotel-reviews").textContent = `${hotel.reviewsCount || "0"} reviews`;

        document.getElementById("single-room-price").textContent = `₹${hotel.priceMin || "-"}`;
        document.getElementById("double-room-price").textContent = `₹${hotel.priceMax || "-"}`;
        document.getElementById("single-room-available").textContent = hotel.singleRooms || "0";
        document.getElementById("double-room-available").textContent = hotel.doubleRooms || "0";

        await fetchHotelAmenities(hotelId);
        await fetchHotelPhotos(hotelId);

    } catch (error) {
        console.error("Error fetching hotel details:", error);
    }
}

async function fetchHotelAmenities(hotelId) {
    try {
        const response = await fetch(`http://localhost:3000/api/hotels/amenities/${hotelId}`);
        if (!response.ok) return;

        const data = await response.json();
        const amenitiesList = document.getElementById("hotel-amenities");

        amenitiesList.innerHTML = '';
        data.amenities.forEach(amenity => {
            const li = document.createElement('li');
            li.textContent = amenity;
            amenitiesList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching amenities:", error);
    }
}

async function fetchHotelPhotos(hotelId) {
    try {
        const response = await fetch(`http://localhost:3000/api/hotels/photos/${hotelId}`);
        if (!response.ok) return;

        const data = await response.json();
        photos = data.photos; // Store photos globally for navigation
        const photosContainer = document.getElementById("hotel-photos");

        photosContainer.innerHTML = '';
        photos.forEach((photoUrl, index) => {
            const img = document.createElement('img');
            img.src = photoUrl;
            img.alt = "Hotel Photo";
            img.classList.add("hotel-photo");
            if (index === 0) img.classList.add("active");
            photosContainer.appendChild(img);
        });
    } catch (error) {
        console.error("Error fetching photos:", error);
    }
}

function showPhoto(index) {
    const photoElements = document.querySelectorAll("#hotel-photos img");
    photoElements.forEach((photo, i) => {
        photo.classList.toggle("active", i === index);
    });
}

function showAlert(message) {
    document.getElementById("alert-message").textContent = message;
    document.getElementById("alert-modal").style.display = "flex";
}


document.getElementById("close-alert").addEventListener("click", () => {
    document.getElementById("alert-modal").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    fetchHotelDetails();

    const bookButtons = document.querySelectorAll(".book-now");
    bookButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const roomType = event.target.getAttribute("data-room-type");
            const hotelId = getHotelIdFromURL();
            if (!hotelId) return;
    
            let availableRooms = 0;
            if (roomType === "single") {
                availableRooms = parseInt(document.getElementById("single-room-available").textContent);
            } else if (roomType === "double") {
                availableRooms = parseInt(document.getElementById("double-room-available").textContent);
            }
    
            if (isNaN(availableRooms) || availableRooms <= 0) {
                showAlert(`No ${roomType} rooms are available for booking.`);
                return;
            }
            
            const urlParams = new URLSearchParams(window.location.search);
            const email=urlParams.get('email');
            window.location.href = `../booking-page/booking.html?id=${hotelId}&roomType=${roomType}&email=${email}`;
        });
    });
    

    document.querySelector("#prev-photo").addEventListener("click", () => {
        currentPhotoIndex = (currentPhotoIndex > 0) ? currentPhotoIndex - 1 : photos.length - 1;
        showPhoto(currentPhotoIndex);
    });

    document.querySelector("#next-photo").addEventListener("click", () => {
        currentPhotoIndex = (currentPhotoIndex < photos.length - 1) ? currentPhotoIndex + 1 : 0;
        showPhoto(currentPhotoIndex);
    });
});
