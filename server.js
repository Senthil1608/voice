// server.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path'); // Import the path module

const app = express();
const port = 5500; // Choose a port number

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Update the route to serve index.html from the 'public' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file upload and call MATLAB script
app.post('/upload', upload.single('audioFile'), (req, res) => {
    const audioData = req.file.buffer.toString('base64');

    // You should replace the following command with the actual MATLAB script execution
    const matlabScript = `matlab -r "your_matlab_script('${audioData}')";`;

    exec(matlabScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing MATLAB script: ${error.message}`);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Assuming MATLAB script outputs plot data
        const plotData = stdout;

        // Send the plot data as JSON to the client
        res.json({ plotData });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
