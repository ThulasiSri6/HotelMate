const db=require('../config/db');

const postUser = async (req, res) => {
    try {
        const {full_name, email, password, phone_number, date_of_birth, gender} = req.body;
        if (!full_name || !email || !password || !phone_number || !date_of_birth || !gender) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
        const checkQuery = `SELECT * FROM users WHERE email = ?`;
        const [existingUser] = await db.query(checkQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already exists. Please use a different email." });
        }
        const query = `INSERT INTO users 
            (full_name, email, password, phone_number, date_of_birth, gender)
            VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [full_name, email, password, phone_number, date_of_birth, gender];
        await db.query(query, values);
        res.status(200).json({ message: 'User Registered Successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const getUserByEmail=async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const query = `SELECT * FROM users WHERE email = ?`;
        const [user] = await db.query(query, [email]);

        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user[0]); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching the user" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }

        const query = `SELECT * FROM users WHERE email = ?`;
        const [user] = await db.query(query, [email]);

        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user[0].password !== password) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred during login" });
    }
};

const postBooking = async (req, res) => {
    try {
        const { user_id, hotel_id, roomtype, checkin, checkout, num_rooms, num_guests, price } = req.body;

        if (!user_id || !hotel_id || !roomtype || !checkin || !checkout || !num_rooms || !num_guests || !price) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        const today = new Date().toISOString().split('T')[0];
        if (new Date(checkin) < new Date(today)) {
            return res.status(400).json({ error: "Check-in date cannot be in the past" });
        }

        if (new Date(checkout) < new Date(checkin)) {
            return res.status(400).json({ error: "Check-out date cannot be before check-in date" });
        }

        const availabilityQuery = `SELECT singleRooms, doubleRooms FROM hotels WHERE id = ?`;
        const [hotel] = await db.query(availabilityQuery, [hotel_id]);

        if (!hotel || hotel.length === 0) {
            return res.status(404).json({ error: "Hotel not found" });
        }

        const availableRooms = roomtype.toLowerCase() === 'single' ? hotel[0].singleRooms : hotel[0].doubleRooms;

        if (num_rooms > availableRooms) {
            return res.status(400).json({ error: `Only ${availableRooms} ${roomtype} rooms are available.` });
        }

        const insertQuery = `INSERT INTO bookings (user_id, hotel_id, roomtype, checkin, checkout, num_rooms, num_guests, price)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [user_id, hotel_id, roomtype, checkin, checkout, num_rooms, num_guests, price];
        const [result] = await db.query(insertQuery, values);

        const newRoomCount = availableRooms - num_rooms;
        const updateQuery = roomtype.toLowerCase() === 'single'
            ? `UPDATE hotels SET singleRooms = ? WHERE id = ?`
            : `UPDATE hotels SET doubleRooms = ? WHERE id = ?`;

        await db.query(updateQuery, [newRoomCount, hotel_id]);

        res.status(200).json({ message: 'Booking created successfully', bookingId: result.insertId });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while creating the booking" });
    }
};

const getBookings = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM bookings');
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching bookings" });
    }
};

const deleteBooking=async (req, res) => {
    try {
        
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Booking ID is required" });
        }

        const [booking] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);

        if (booking.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        await db.query('DELETE FROM bookings WHERE id = ?', [id]);

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while deleting the booking" });
    }
};

const getBookingsByUserId = async (req, res) => {
    try {
        const userId = req.params.userid;
        
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        
        const [results] = await db.query('SELECT * FROM bookings WHERE user_id = ?', [userId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "No bookings found for the given user ID" });
        }

        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching bookings by user ID" });
    }
};


module.exports={postUser,getUserByEmail,loginUser,postBooking,getBookings,getBookingsByUserId,deleteBooking};