const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.PARKING_API_KEY;
const indexPath = path.join(__dirname, 'index.html');


// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));


// Fetch parking data when server starts up
async function fetchData() {
    try {
        // Make API call to fetch parking data
        const response = await axios.get('http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2', {
            headers: {
                'AccountKey': API_KEY,
                'Accept': 'application/json'
            }
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return [];
    }
}

// Route to serve index.html file
app.get('/', async (req, res, next) => {
    // Fetch parking data
    const parkingData = await fetchData();
    
    // Send index.html file with parking data as JSON
    res.sendFile(indexPath);
});

// Route to serve parking data as JSON
app.get('/data', async (req, res, next) => {
    // Fetch parking data
    const parkingData = await fetchData();
    
    // Send parking data as JSON
    res.json(parkingData);
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
