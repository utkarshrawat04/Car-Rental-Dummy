const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  
const userRoutes = require('./router/user-router');
const carRoutes = require('./router/car-router');  
const app = express(); 
const cors = require('cors');
app.use(cors()); 

app.use(bodyParser.json()); 

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/customer', userRoutes);


app.use('/api/cars', carRoutes);  
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});
