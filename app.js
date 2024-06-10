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

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to extract text from a PDF
async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const lines = data.text.split('\n').slice(0, 30);
        const extractedText = lines.join('\n');
        return extractedText;
    } catch (error) {
        console.error(`Error extracting text from PDF: ${error}`);
        throw error;
    }
}

// Route for file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'File not found' });
        }

        // Check if the file is a PDF
        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ success: false, message: 'The uploaded file is not a PDF' });
        }

        // Extract text from the PDF
        const extractedText = await extractTextFromPDF(req.file.path);

        // Check if email was provided
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).json({ success: false, message: 'Email not provided' });
        }

        // Read the HTML template
        const htmlTemplatePath = path.join(__dirname, 'email_template.html');
        let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');

        // Replace the placeholder with the extracted text
        const formattedText = extractedText.split('\n').map(line => `<p>${line}</p>`).join('');
        htmlContent = htmlContent.replace('{{ extractedText | safe }}', formattedText);

        // Send an email with the extracted text and formatted HTML content
        await sendMail(userEmail, 'Extracted Text from PDF', extractedText, htmlContent);
        
        res.status(200).json({ success: true, message: `The email has been successfully sent to ${userEmail}`});

        // Optionally, delete the file after processing
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
