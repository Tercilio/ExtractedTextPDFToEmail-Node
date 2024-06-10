const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const sendMail = require('./nodemailer');
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to extract text from a PDF
async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const lines = data.text.split('\n').slice(0, 30); // Limiting to first 30 lines
        return lines.join('\n'); // Joining lines with newline characters
    } catch (error) {
        console.error(`Error extracting text from PDF: ${error}`);
        throw error;
    }
}

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for the form page
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// Route for file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'File not found' });
        }

        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ success: false, message: 'The uploaded file is not a PDF' });
        }

        const extractedText = await extractTextFromPDF(req.file.path);
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).json({ success: false, message: 'Email not provided' });
        }

        // Sending the extracted text via email
        await sendMail(userEmail, 'Extracted Text from PDF', extractedText, false); // Passing false to indicate plain text
        
        res.status(200).json({ success: true, message: `The email has been successfully sent to ${userEmail}` });

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err}`);
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ success: false, message: 'An unexpected error occurred' });
    }
});

module.exports = app;
