import { v4 as uuidv4 } from 'uuid'; //for Session Token ID Generation
const express = require(`express`);
const app = express();
const controller = require(`../server.js`);

const fileUpload = require('express-fileupload');
app.use(express.json()); 
app.use(express.urlencoded( {extended: true})); 
app.use(fileUpload()); 

const session = require('express-session');
const uuid = uuidv4();

console.log('Random UUID:', uuid);

app.use(
  session({
    name: 'session',
    secret: uuid,
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
  })
);

app.get('/login');

module.exports = app;