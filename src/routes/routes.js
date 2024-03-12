const express = require(`express`);
const app = express();
const controller = require(`../server.js`);

const fileUpload = require('express-fileupload');
app.use(express.json()); 
app.use(express.urlencoded( {extended: true})); 
app.use(fileUpload()); 

app.get(`/login`);


module.exports = app;