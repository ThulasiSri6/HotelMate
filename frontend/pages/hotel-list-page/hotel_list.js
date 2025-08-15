async function searchHotelByCity(){
    const city = document.getElementById("search").value.toLowerCase().trim();
    if(!city){
        return;
    }
    
    const response = await fetch(`http://localhost:3000/api/hotels/city/${city}`, {
        method: "GET"
    });
    if(!response.ok){
        const hotelList = document.getElementById("hotel-list");
        hotelList.innerHTML =`<p><i class="bi bi-search"></i>  Oops! City Not Found...</p>`;
        hotelList.classList.add("error-message");
        return;
    }
    const data = await response.json();
    const container = document.getElementById('hotel-list');
    container.innerHTML = ""; 
    data.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.className = "hotel-card";
        const fullStars = Math.floor(hotel.rating);
            const halfStar = hotel.rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            let starsHTML = "";

            for (let i = 0; i < fullStars; i++) {
                starsHTML += `<i class="bi bi-star-fill"></i>`; 
            }
            if (halfStar) {
                starsHTML += `<i class="bi bi-star-half"></i>`; 
            }
            for (let i = 0; i < emptyStars; i++) {
                starsHTML += `<i class="bi bi-star"></i>`;
            }

            hotelCard.innerHTML = `
                <img src="${hotel.thumbnail}" alt="${hotel.name}">
                <div class="hotel-info">
                    <h3>${hotel.name}</h3>
                    <p><strong>Rank:</strong> ${hotel.ranking}</p>
                    <p><strong>Price:</strong> ₹${hotel.priceMin} - ₹${hotel.priceMax}</p>
                </div>
                <div class="hotel-actions">
                    <p class="rating">${starsHTML} (${hotel.rating})</p>
                    <p class="review-count">${hotel.reviewsCount} reviews</p>
                    <button class="details-btn" onclick="viewHotel(${hotel.id})">View Details</button>
                </div>
            `;
        container.appendChild(hotelCard);
    });
}

function viewHotel(hotelId) {
    const urlParams = new URLSearchParams(window.location.search);
    const email=urlParams.get('email');
    window.location.href = `../hotel-details-page/hotel-details.html?id=${hotelId}&email=${email}`;
}

