

const mongoose = require('mongoose');
const Car = require('../models/car-models');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images')); // Store images in 'images' folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Set up Multer with storage configuration and file filtering
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.fieldname === 'image') { // Check if the fieldname matches 'image'
          cb(null, true);
      } else {
          cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE')); // Throw an error for unexpected fields
      }
  }
});


exports.addCar = async (req, res) => {
    try {
        const { name, year, category, oldPrice, price, location, fuelConsumption, safety, lastMaintenance, quality, comfort, isSportCar, seats, kmPerDay, warranty, insurance } = req.body;

        let imageUrl = null;
        if (req.file) {
            imageUrl = path.join('/images', req.file.filename);
        }

        const newCar = new Car({
            name,
            year,
            category,
            oldPrice,
            price,
            location,
            fuelConsumption,
            safety,
            lastMaintenance,
            quality,
            comfort,
            isSportCar: isSportCar === 'true',
            seats,
            kmPerDay,
            warranty,
            insurance,
            imageUrl,
        });

        const savedCar = await newCar.save();
        res.status(200).json({ message: 'Car added successfully', car: savedCar });
    } catch (error) {
        console.error('Error adding car:', error.message);
        res.status(400).json({ message: 'Car validation failed', error: error.message });
    }
};


exports.getAllCars = async (req, res) => {
    const category = req.query.category;
    let filter = {};

    if (category) {
        filter = { category };
    }

    try {
        const cars = await Car.find(filter);
        res.json(cars);
    } catch (err) {
        console.error('Error fetching cars:', err.message);
        res.status(500).json({ message: 'Failed to fetch cars', error: err.message });
    }
};


exports.updateCar = async (req, res) => {
    const {
        name,
        category,
        oldPrice,
        price,
        location,
        year,             
        fuelConsumption,    
        safety,
        lastMaintenance,
        quality,
        comfort,
        isSportCar,
        zeroToHundred,
        seats,
        kmPerDay,
        warranty,
        insurance
    } = req.body;

    const carId = req.params.id;

    try {
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        car.set({
            name,
            category,
            oldPrice,
            price,
            location,
            year,
            fuelConsumption,
            safety,
            lastMaintenance,
            quality,
            comfort,
            isSportCar,
            zeroToHundred,
            seats,
            kmPerDay,
            warranty,
            insurance,
        });

        if (req.file) {
            car.imageUrl = `/images/${req.file.filename}`;
        }

        const updatedCar = await car.save();
        res.status(200).json(updatedCar);
    } catch (error) {
        console.error('Error updating car:', error.message);
        res.status(500).json({ message: 'Failed to update car', error: error.message });
    }
};


exports.deleteCar = async (req, res) => {
    const carId = req.params.id;

    try {
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        await Car.deleteOne({ _id: carId });
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error.message);
        res.status(500).json({ message: 'Failed to delete car', error: error.message });
    }
};


exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Car.distinct('location');
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error.message);
        res.status(500).json({ message: 'Failed to fetch locations', error: error.message });
    }
};

exports.getCategoriesByLocation = async (req, res) => {
    const { location } = req.query;

    try {
        const categories = await Car.distinct('category', { location });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories by location:', error.message);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};


const isCarAvailable = (car, fromDate, toDate) => {
    const newFromDate = new Date(fromDate);
    const newToDate = new Date(toDate);

    for (let rental of car.rentalHistory) {
        const rentalFrom = new Date(rental.fromDate);
        const rentalTo = new Date(rental.toDate);

        if (
            (newFromDate >= rentalFrom && newFromDate <= rentalTo) ||
            (newToDate >= rentalFrom && newToDate <= rentalTo) ||
            (newFromDate <= rentalFrom && newToDate >= rentalTo)
        ) {
            return false;
        }
    }
    return true;
};


exports.filterCars = async (req, res) => {
    const { location, category, budget, rentalDays, fromDate, toDate } = req.query;

    try {
        const budgetLimit = parseFloat(budget);

        let cars = await Car.find({
            location,
            category,
            $or: [
                { price: { $lte: budgetLimit / rentalDays } },
                { oldPrice: { $lte: budgetLimit / rentalDays } }
            ]
        });

        cars = cars.filter(car => isCarAvailable(car, fromDate, toDate));

        res.status(200).json(cars);
    } catch (error) {
        console.error('Error filtering cars:', error.message);
        res.status(500).json({ message: 'Error filtering cars', error: error.message });
    }
};


exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        console.error('Error fetching car details:', error.message);
        res.status(500).json({ message: 'Error fetching car details', error: error.message });
    }
};


exports.checkAvailabilityAndBook = async (req, res) => {
    const { carId, fromDate, toDate } = req.body;

    try {
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const available = isCarAvailable(car, fromDate, toDate);

        if (!available) {
            return res.status(400).json({ message: 'Car is not available for the selected dates' });
        }

        car.rentalHistory.push({ fromDate, toDate });
        await car.save();

        return res.status(200).json({ message: 'Car booked successfully' });
    } catch (error) {
        console.error('Error checking availability:', error.message);
        return res.status(500).json({ message: 'Error checking availability', error: error.message });
    }
};

// Export the upload function to use in the routes
exports.upload = upload;
