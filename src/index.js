require('dotenv').config();
const express = require('express');
const app = express();
const personRoutes = require('./app/routes/persons');
const {dbConnect} = require('./config/db');
const redis = require('./config/redisClient');





const port = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.json());


//routes
app.use("/",personRoutes);



//connection 
dbConnect();


app.listen(port, () => {
    console.log('Api ready on: ',`http://localhost:${port}`);
});