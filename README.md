# HotelMate
HotelMate is a web application built with Node.js, Express, MySQL, and HTML/CSS/JavaScript to simplify hotel room reservations. It allows users to sign up, search for hotels in a selected location, view hotel details, and book rooms seamlessly. Admins can manage hotel details and keep their listings updated.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📌 Project Overview
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
HotelMate is a full-stack hotel booking platform designed to provide users with a smooth, user-friendly experience while searching for and reserving hotel rooms. Built using Node.js, Express, MySQL, and vanilla HTML/CSS/JavaScript, the application offers two primary roles — users and administrators — with distinct access levels and capabilities.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🔐 User Features
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. Secure Sign-Up & Login

      Users can register and log in securely using session-based authentication. Credentials are validated against the database, ensuring secure access to personal booking data.

2. Hotel Search by Location

      Users can search for hotels based on a chosen location. Matching hotel listings are fetched dynamically and displayed for convenient browsing.

3. Hotel Details View

      Each hotel listing provides an in-depth view that includes room types, available amenities, photos, and other property details to help users make informed decisions.

4. Room Booking

      After selecting a room type, users fill in booking details such as check-in/check-out dates, number of guests, and contact info. Bookings are confirmed and stored under the user’s account.

5. Booking Management

   Users have access to a "My Bookings" section where they can view current and past bookings. If needed, users can cancel future reservations with ease.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🛠️ Admin Features
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. Secure Admin Login

    Admins log in through a dedicated admin portal with their credentials, granting them access to hotel management functionality.

2. Hotel Data Management

    Through the Admin Dashboard, administrators can manage their hotel listings. They can add or update hotel details, manage room types, modify amenities, and upload new photos to keep listings accurate and appealing.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🌐 Project Purpose
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

HotelMate bridges the gap between travelers and hotel owners by offering a reliable and intuitive reservation platform. Users enjoy a smooth experience while booking rooms, and hotel managers benefit from a simple interface for keeping their property listings up to date. It’s a scalable and robust foundation for any hotel reservation system.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🛠️ Tech Stack
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | HTML, CSS, JavaScript              |
| Backend        | Node.js, Express.js                |
| Database       | MySQL                              |
| Authentication | Session-based login (User & Admin) |
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🗂️ Database Design
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

HotelMate uses a relational database in MySQL to efficiently manage users, hotels, bookings, and related data. Below is an overview of the core tables and their roles:

- **users** – User accounts & personal details  
- **admin** – Admin accounts linked to hotels  
- **hotel** – Hotel details & location  
- **bookings** – Reservations & booking status  
- **photos** – Images linked to hotels  
- **amenities** – Hotel services/features
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

⚙️ Getting Started
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Prerequisites
    - Node.js (v16 or above)  
    - MySQL  
    - npm (bundled with Node.js)


Folder Structure
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    HotelMate/
    ├── backend/          # Node.js + Express server
    ├── frontend/         # HTML, CSS, JavaScript files
    ├── .env              # Environment variables for DB
    └── README.md

Installation
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Clone the repository:git clone https://github.com/ThulasiSri6/HotelMate.git
cd HotelMate

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🔧 Backend Setup
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.Navigate to the backend folder:

    cd backend

2.Install dependencies
  
    npm install

3.Create a MySQL database named hotelmate.

4.In the backend folder, create a .env file and add your MySQL credentials:
  
    DB_HOST=localhost  
    DB_USER=root  
    DB_PASSWORD=your_password  
    DB_NAME=hotelmate  
  
5.Start the backend server:
   
    npm start

The backend will typically run at: http://localhost:5000

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


⭐️ Show Your Support
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

If you like this project, give it a ⭐ on GitHub!

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 




