# PDF Text Extractor API

This project is an API that allows you to upload PDF files, extracts the text from the first 30 lines of the PDF, and sends the extracted text via email using Nodemailer.

# Requirements

- Node.js (version 14 or higher)
- npm (version 6 or higher)

## 1 - Installation

1.1 - Clone the repository to your local environment:
   ```sh
     git clone https://github.com/your-username/pdf-text-extractor-api.git
     cd pdf-text-extractor-api
   ```
1.2 - Install the project dependencies:
   ```sh
     git clone https://github.com/your-username/pdf-text-extractor-api.git
     cd pdf-text-extractor-api
   ```
1.3 - Edit the `.env` file with your credentials:  
 ```plaintext
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_USER=your-email@gmail.com
    MAIL_PASS=your-password
    PORT=3000
 ```
## 2 - Runnin the Project

2.1 - Start the server:
 ```sh
     npm start
 ```
NOTE: The server will be running on the port defined in the .env file (or on port 3000 by default).

# API Endpoints

  * Upload and Extract Text from PDF
  * URL: /upload
  * Method: POST
  * Description: Uploads a PDF file, extracts the text from the first 30 lines, and sends the extracted text via email.

  1 - Parameters
   * Form Data:
   * file: PDF file to be uploaded.
   * email: Email address to send the extracted text to.

# Project Structure

  * server.js: Sets up and starts the server.
  * app.js: Defines the server routes and logic.
  * nodemailer.js: Configures and sends emails using Nodemailer.
  * uploads/: Directory where PDF files are temporarily stored.
  * .env: Configuration file for environment variables.

# Dependencies

  `express:` Web framework for Node.js.
  `multer:` Middleware for handling multipart/form-data.
  `pdf-parse:` Library for extracting text from PDF files.
  `nodemailer:` Module for sending emails.
  `dotenv:` Module for loading environment variables from a .env file.

# Notes
  * Ensure that your email server's access permissions are correctly configured to allow email sending through Nodemailer.
  * This project uses Gmail's SMTP service by default. To use other email services, adjust the settings in the .env file and in the nodemailer.js file as necessary.
  
# Instructions

* Clone the repository and navigate to the project directory.
* Install dependencies with npm install.
* Create a .env file with the required environment variables.
* Start the server with npm start.
* Test the /upload endpoint using a tool like curl or Postman.

