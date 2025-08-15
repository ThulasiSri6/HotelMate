const db=require('../config/db');

const getHotels=async (req,res)=>{
    try{
        const [data]=await db.query("SELECT * FROM hotels");
        if (data.length === 0) {
            return res.status(404).json({ message: 'No hotels found' });
        }
        res.status(200).json(data);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
};

const getHotelByCity=async (req,res)=>{
    try{
        const city=req.params.city;
        if(!city){
            res.status(404).json({ message: 'Provide city name' });
        }
        const [data]=await db.query(`SELECT * FROM hotels WHERE city=?`,[city]);
        if (data.length === 0) {
            return res.status(404).json({ message: 'Oops! City not found...' });
        }
        res.status(200).json(data);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
};

const getHotelById=async (req,res)=>{
    try{
        const id=req.params.id;
        if(!id){
            res.status(404).json({ message: 'Provide ID' });
        }
        const [data]=await db.query(`SELECT * FROM hotels WHERE id=?`,[id]);
        if (data.length === 0) {
            return res.status(404).json({ message: 'No details available!' });
        }
        res.status(200).json(data);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
};

const getHotelPhotosById = async (req, res) => {
    const hotelId = req.params.id;
    if (!hotelId) {
        return res.status(400).json({ message: "Hotel ID is required" });
    }
    try {
        const [rows] = await db.query(
            "SELECT photo_url FROM photos WHERE hotel_id = ?",
            [hotelId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "No photos found for this hotel" });
        }
        const photoUrls = rows.map((row) => row.photo_url);
        res.json({ photos: photoUrls });
    } catch (error) {
        console.error("Error fetching hotel photos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getHotelAmenitiesById = async (req, res) => {
    const hotelId = req.params.id;
    if (!hotelId) {
        return res.status(400).json({ message: "Hotel ID is required" });
    }
    try {
        const [rows] = await db.query(
            "SELECT amenity FROM amenities WHERE hotel_id = ?",
            [hotelId] 
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "No amenities found for this hotel" });
        }
        const amenities = rows.map((row) => row.amenity);
        res.json({ amenities });
    } catch (error) {
        console.error("Error fetching hotel amenities:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const postHotel=async (req,res)=>{
    try{
        const {
            id,name, fullAddress, city, state, country, postalCode, latitude, longitude,
            priceMin, priceMax, rating, reviewsCount, ranking, totalHotels, contactEmail,
            contactPhone, contactWebsite, thumbnail, link
        } = req.body;
        if (
            !id || !name || !fullAddress || !city || !state || !country || !postalCode ||
            latitude === undefined || longitude === undefined || priceMin === undefined ||
            priceMax === undefined || rating === undefined || reviewsCount === undefined ||
            ranking === undefined || totalHotels === undefined || !contactEmail ||
            !contactPhone || !contactWebsite || !thumbnail || !link
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const query = `INSERT INTO Hotels 
            (id,name, fullAddress, city, state, country, postalCode, latitude, longitude, 
            priceMin, priceMax, rating, reviewsCount, ranking, totalHotels, contactEmail, 
            contactPhone, contactWebsite, thumbnail, link) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
        const values = [id,name, fullAddress, city, state, country, postalCode, latitude, longitude,
                        priceMin, priceMax, rating, reviewsCount, ranking, totalHotels,
                        contactEmail, contactPhone, contactWebsite, thumbnail, link];
        await db.query(query, values);
        res.status(200).json({ message: 'Hotel Inserted Successfully!' });
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
};


const updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        if (!hotelId) {
            return res.status(404).json({ message: 'Provide ID' });
        }

        const {
            contactEmail,
            contactPhone,
            contactWebsite,
            priceMin,
            priceMax,
            singleRooms,
            doubleRooms
        } = req.body;

        if (
            contactEmail === undefined &&
            contactPhone === undefined &&
            contactWebsite === undefined &&
            priceMin === undefined &&
            priceMax === undefined &&
            singleRooms === undefined &&
            doubleRooms === undefined
        ) {
            return res.status(400).json({ error: "At least one field is required for update" });
        }

        let updateFields = [];
        let values = [];

        if (contactEmail !== undefined) { updateFields.push("contactEmail = ?"); values.push(contactEmail); }
        if (contactPhone !== undefined) { updateFields.push("contactPhone = ?"); values.push(contactPhone); }
        if (contactWebsite !== undefined) { updateFields.push("contactWebsite = ?"); values.push(contactWebsite); }
        if (priceMin !== undefined) { updateFields.push("priceMin = ?"); values.push(priceMin); }
        if (priceMax !== undefined) { updateFields.push("priceMax = ?"); values.push(priceMax); }
        if (singleRooms !== undefined) { updateFields.push("singleRooms = ?"); values.push(singleRooms); }
        if (doubleRooms !== undefined) { updateFields.push("doubleRooms = ?"); values.push(doubleRooms); }

        values.push(hotelId);

        const query = `UPDATE Hotels SET ${updateFields.join(", ")} WHERE id = ?`;
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Hotel not found" });
        }

        res.status(200).json({ message: 'Hotel Updated Successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};


const deleteHotel=async (req,res)=>{
    try{
        const id=req.params.id;
        if(!id){
            res.status(404).json({ message: 'Provide ID' });
        }
        await db.query(`DELETE FROM hotels WHERE id=?`,[id]);
        res.status(200).json({ message: 'Hotel Deleted Successfully!' });
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
};


const postAdmin = async (req, res) => {
    try {
        const {hotel_id, password} = req.body;
        if (!hotel_id || !password ) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
        const checkQuery = `SELECT * FROM admin WHERE hotel_id = ?`;
        const [existingUser] = await db.query(checkQuery, [hotel_id]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Account for this ID already created!" });
        }

        const existQuery = `SELECT * FROM hotels WHERE id = ?`;
        const [existUser] = await db.query(existQuery, [hotel_id]);
        if (existUser.length <= 0) {
            return res.status(400).json({ error: "Invalid Hotel ID!" });
        }

        const query = `INSERT INTO admin 
            (hotel_id, password)
            VALUES (?, ?)`;

        const values = [hotel_id, password];
        await db.query(query, values);
        res.status(200).json({ message: 'Admin Registered Successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { hotel_id, password } = req.body;
        if (!hotel_id || !password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }

        const query = `SELECT * FROM admin WHERE hotel_id = ?`;
        const [user] = await db.query(query, [hotel_id]);

        if (user.length === 0) {
            return res.status(404).json({ error: "Admin not found" });
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

module.exports={getHotels,getHotelByCity,getHotelById,postHotel,updateHotel,deleteHotel,getHotelPhotosById,getHotelAmenitiesById,postAdmin,loginAdmin};

