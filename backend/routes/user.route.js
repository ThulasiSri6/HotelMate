const express=require('express');
const {postUser,getUserByEmail,loginUser,postBooking,getBookings,getBookingsByUserId,deleteBooking} = require('../controller/user.controller');
const router=express.Router();

router.post('/',postUser);
router.get('/user/:email',getUserByEmail);
router.post('/login',loginUser);
router.get('/bookings',getBookings);
router.get('/bookings/:userid',getBookingsByUserId);
router.post('/bookings',postBooking);
router.delete('/bookings/:id',deleteBooking);

module.exports=router; 