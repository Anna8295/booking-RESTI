require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const nodemailer = require('nodemailer');

//Views engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//Static folder 
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/reservation', (req, res) => {
    res.render('reservation')
})

app.post('/send', async (req, res) => {
    const message = `
        <h2>Your reservation</h2>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Date: ${req.body.date}</li>
            <li>Time: ${req.body.time}</li>
            <li>People: ${req.body.numberOfPeople}</li>
        </ul>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.azet.sk",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_USER_EMAIL,
            pass: process.env.NODEMAILER_USER_PASSWORD 
        },
        // tls:{
        //     rejectUnauthorized:false
        // }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"RESTI" <restiketest@azet.sk>', // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "Reservation", // Subject line
        text: `HI! ${req.body.name}`, // plain text body
        html: message, // html body
    });

    console.log("Message sent: %s", info.messageId);
    
    res.redirect('/');
});


app.listen(3000, () => {
    console.log('listening on port 3000')
})