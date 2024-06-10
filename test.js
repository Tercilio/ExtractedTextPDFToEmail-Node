// Testing only the function of extracting text from PDF

const fs = require('fs');
const pdf = require('pdf-parse');

// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);

        // Extract the first 30 lines
        const lines = data.text.split('\n').slice(0, 30);
        const extractedText = lines.join('\n');

        // Log the extracted text
        console.log('Extracted text from PDF:', extractedText);

        return extractedText;
    } catch (error) {
        console.error(`Error extracting text from PDF: ${error}`);
        throw error;
    }
}

const filePath = 'C:\\Users\\User\\Desktop\\pdftestee.pdf';

extractTextFromPDF(filePath)
    .then(() => {
        console.log('Text extraction completed.');
    })
    .catch((error) => {
        console.error('Text extraction failed:', error);
    });



