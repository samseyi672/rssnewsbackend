const express  = require('express');
const bodyParser  =  require('body-parser');
const {streaming}  = require('./app/url')
const axios = require('axios');
const path = require("path");
const cors = require('cors');
//this enables us to create sensitive env variables and stores  passwords  in there
const dotenv =   require('dotenv');
const app  =  express() ;
var xmlparser = require('express-xml-bodyparser');
//enable cors
app.use(cors({
    origin: '*',
   // credentials:true
}));
const port = process.env.PORT || 5000;
dotenv.config();
app.use(express.urlencoded({extended: true})); // New
app.use(express.json()); // New
app.use(xmlparser());
console.log('calling to start node ');
app.use(xmlparser({
    normalizeTags: false
  }));
// import authRoutes
const authRoutes =  require('./app/Router');
//route middleware 
app.use('/api/',authRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`)) ;





















