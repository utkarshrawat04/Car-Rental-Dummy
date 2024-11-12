const express = require('express');
const router = express.Router();
const carController = require('../controllers/car-controller');


router.post('/', carController.upload.single('image'), carController.addCar);




router.get('/', carController.getAllCars);


router.put('/:id', carController.upload.single('image'), carController.updateCar);

router.delete('/:id', carController.deleteCar);

//GET Route to fetch distinct locations
router.get('/locations', carController.getAllLocations);

// Route to get categories by location
router.get('/categories', carController.getCategoriesByLocation);

//GET Route to filter the Car
router.get('/filter', carController.filterCars);

// Route to fetch a car by ID   
router.get('/carId/:carId', carController.getCarById);

// Add a route to check availability and book the car
router.post('/checkAvailabilityAndBook', carController.checkAvailabilityAndBook);

module.exports = router;
