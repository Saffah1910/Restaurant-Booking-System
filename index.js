import express from "express";
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import flash from "flash-express";
import session from "express-session";
import pgp from "pg-promise";
import exphbs from "express-handlebars";

//import db query
import restaurant from "./services/restaurant.js";
//create instance for query
const query = restaurant();

//use pgppromise to cnnect to the databse
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

const app = express();

app.use(express.static('public'));
app.use(flash());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');




//home routes allows user to book will also contain req flash for error messages
app.get("/", (req, res) => {

    res.render('index', { tables: [{}, {}, { booked: true }, {}, {}, {}] })
});

//this will show all bookings that have been made
app.get("/bookings", (req, res) => {
    query.getBookedTables()
    res.render('bookings', { tables: [{}, {}, {}, {}, {}, {}] })
});

//should be able to book an avialable table, should book if its too mnay people and show error message, redirect back to home page
// app.post("/book", (req, res) => {
//     let table_name = req.body.tableNmae;
//     query.bookTable({
//         table_name,
//         username,
//         phoneNumber,
//         seats
//     });


// });



app.post('/book', async (req, res) => {
    const { tableId, booking_size, username, phone_number } = req.body;
  
    const result = await query.bookTable({
      tableName: tableId,
      username,
      phoneNumber: phone_number,
      seats: booking_size,
    });
});

//this will show al the bookigs for a sepacif user
app.get("/bookings/:username", (req, res) => {

});

//allows the admin to cancel booking
app.post("/cancel", (req, res) => {


    res.redirect('/bookings')

});








var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});